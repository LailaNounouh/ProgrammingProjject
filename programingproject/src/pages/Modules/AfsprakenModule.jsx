import React, { useState, useEffect } from "react";
import "./AfsprakenModule.css";
import { baseUrl } from "../../config";
import io from "socket.io-client";

export default function Afspraken() {
  const [bedrijven, setBedrijven] = useState([]);
  const [bedrijfId, setBedrijfId] = useState("");
  const [tijdslot, setTijdslot] = useState("");
  const [datum] = useState("2026-03-13");
  const [beschikbareTijdsloten, setBeschikbareTijdsloten] = useState([]);
  const [bezetteTijdsloten, setBezetteTijdsloten] = useState([]);
  const [alleTijdsloten, setAlleTijdsloten] = useState([]);
  const [afspraakIngediend, setAfspraakIngediend] = useState(false);
  const [afspraakDetails, setAfspraakDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [socket, setSocket] = useState(null);
  const [afsprakenOverzicht, setAfsprakenOverzicht] = useState([]);

  useEffect(() => {
    const newSocket = io(baseUrl);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("user") || "{}");
    if (!student?.id) return;

    fetch(`${baseUrl}/afspraken/student/${student.id}?datum=2026-03-13`)
      .then((res) => res.json())
      .then((data) => setAfsprakenOverzicht(data))
      .catch((err) => console.error("Afspraken ophalen mislukt:", err));
  }, []);

  useEffect(() => {
    if (!socket || !bedrijfId) return;

    socket.emit("joinAppointmentRoom", { bedrijfId, datum });
    socket.on("appointmentCreated", (data) => {
      if (data.bedrijf_id === bedrijfId && data.datum === datum) {
        setBezetteTijdsloten((prev) => [...prev, data.tijdslot]);
        setBeschikbareTijdsloten((prev) => prev.filter((t) => t !== data.tijdslot));
      }
    });

    return () => {
      socket.emit("leaveAppointmentRoom", { bedrijfId, datum });
      socket.off("appointmentCreated");
    };
  }, [socket, bedrijfId, datum]);

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/bedrijvenmodule`);
        if (!res.ok) throw new Error("Kon bedrijven niet ophalen");
        const data = await res.json();
        setBedrijven(data);
      } catch (err) {
        setError("Probleem bij ophalen bedrijven.");
      } finally {
        setLoading(false);
      }
    }
    fetchBedrijven();
  }, []);

  useEffect(() => {
    async function fetchTijdsloten() {
      if (!bedrijfId) return;

      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/afspraken/beschikbaar/${bedrijfId}?datum=${datum}`);
        if (!res.ok) throw new Error("Tijdsloten ophalen mislukt");
        const data = await res.json();
        setBeschikbareTijdsloten(data.beschikbaar || []);
        setBezetteTijdsloten(data.bezet || []);
        setAlleTijdsloten(data.alle || []);
        setTijdslot("");
      } catch (err) {
        setError("Kon tijdsloten niet ophalen.");
      } finally {
        setLoading(false);
      }
    }
    fetchTijdsloten();
  }, [bedrijfId, datum, refreshTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bedrijfId || !tijdslot) {
      setError("Selecteer een bedrijf en tijdslot");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const student_id = user.id;
      const res = await fetch(`${baseUrl}/afspraken/nieuw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id, bedrijf_id: bedrijfId, tijdslot, datum }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Fout bij maken afspraak");
      }

      const selectedBedrijf = bedrijven.find((b) => b.bedrijf_id === parseInt(bedrijfId));
      setAfspraakDetails({
        bedrijfNaam: selectedBedrijf?.naam || "Onbekend",
        tijdslot,
        datum,
        bedrijfId,
      });

      setBezetteTijdsloten((prev) => [...prev, tijdslot]);
      setBeschikbareTijdsloten((prev) => prev.filter((t) => t !== tijdslot));
      setAfspraakIngediend(true);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container afspraken-module">
      <h2 className="module-title">Afspraak maken</h2>

      {afsprakenOverzicht.length > 0 && (
        <div className="info-blok">
          <h4>📌 Je hebt al afspraken op 13 maart 2026 met:</h4>
          <ul>
            {afsprakenOverzicht.map((a, i) => (
              <li key={i}>🏢 {a.bedrijfsnaam} om {a.tijdslot}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!afspraakIngediend ? (
        <form onSubmit={handleSubmit}>
          <select value={bedrijfId} onChange={(e) => setBedrijfId(e.target.value)} required>
            <option value="">Kies een bedrijf</option>
            {bedrijven.map((b) => (
              <option key={b.bedrijf_id} value={b.bedrijf_id}>{b.naam}</option>
            ))}
          </select>

          {bedrijfId && (
            <div className="tijdslot-grid">
              {alleTijdsloten.map((tijd) => (
                <button
                  key={tijd}
                  type="button"
                  className={`tijdslot-btn ${tijdslot === tijd ? "gekozen" : ""} ${bezetteTijdsloten.includes(tijd) ? "bezet" : ""}`}
                  disabled={bezetteTijdsloten.includes(tijd)}
                  onClick={() => setTijdslot(tijd)}
                >
                  {tijd} {bezetteTijdsloten.includes(tijd) ? "🔒" : ""}
                </button>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading || !tijdslot}>Afspraak maken</button>
        </form>
      ) : (
        <div>
          <h4>✅ Afspraak succesvol ingediend</h4>
          <p>{afspraakDetails.bedrijfNaam} op {afspraakDetails.tijdslot}</p>
        </div>
      )}
    </div>
  );
}