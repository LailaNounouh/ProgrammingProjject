import React, { useState, useEffect } from "react";
import "./AfsprakenModule.css";
import { baseUrl } from "../../config";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom"; // <-- toegevoegd

export default function Afspraken() {
  const [bedrijven, setBedrijven] = useState([]);
  const [bedrijfId, setBedrijfId] = useState("");
  const [presetBedrijf, setPresetBedrijf] = useState(false);          // <-- toegevoegd
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

  const location = useLocation();    // <-- toegevoegd
  const navigate = useNavigate();    // <-- toegevoegd

  // Lees queryparameter ?bedrijf=ID
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("bedrijf");
    if (q && !bedrijfId) {
      setBedrijfId(q);
      setPresetBedrijf(true);
    }
  }, [location.search, bedrijfId]);

  // Socket init
  useEffect(() => {
    const newSocket = io(baseUrl);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // Afspraken van student
  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("user") || "{}");
    if (!student?.id) return;
    fetch(`${baseUrl}/afspraken/student/${student.id}?datum=2026-03-13`)
      .then(r => r.json())
      .then(d => Array.isArray(d) && setAfsprakenOverzicht(d))
      .catch(() => {});
  }, []);

  // Socket room voor geselecteerd bedrijf
  useEffect(() => {
    if (!socket || !bedrijfId) return;
    socket.emit("joinAppointmentRoom", { bedrijfId, datum });
    socket.on("appointmentCreated", (data) => {
      if (String(data.bedrijf_id) === String(bedrijfId) && data.datum === datum) {
        setBezetteTijdsloten(p => [...p, data.tijdslot]);
        setBeschikbareTijdsloten(p => p.filter(t => t !== data.tijdslot));
      }
    });
    return () => {
      socket.emit("leaveAppointmentRoom", { bedrijfId, datum });
      socket.off("appointmentCreated");
    };
  }, [socket, bedrijfId, datum]);

  // Bedrijven laden
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/bedrijvenmodule`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setBedrijven(data || []);
      } catch {
        setError("Probleem bij ophalen bedrijven.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Controleer of preset bedrijf bestaat na laden
  useEffect(() => {
    if (presetBedrijf && bedrijfId && bedrijven.length) {
      const exists = bedrijven.some(b => String(b.bedrijf_id) === String(bedrijfId));
      if (!exists) {
        setPresetBedrijf(false);
        setBedrijfId("");
      }
    }
  }, [bedrijven, presetBedrijf, bedrijfId]);

  // Tijdsloten laden voor gekozen bedrijf
  useEffect(() => {
    if (!bedrijfId) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${baseUrl}/afspraken/beschikbaar/${bedrijfId}?datum=${datum}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setBeschikbareTijdsloten(data.beschikbaar || []);
        setBezetteTijdsloten(data.bezet || []);
        setAlleTijdsloten(data.alle || []);
        setTijdslot("");
      } catch {
        setError("Kon tijdsloten niet ophalen.");
      } finally {
        setLoading(false);
      }
    })();
  }, [bedrijfId, datum, refreshTrigger]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!bedrijfId || !tijdslot) {
      setError("Selecteer een bedrijf en tijdslot");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const student_id = user.id;
      const res = await fetch(`${baseUrl}/afspraken/nieuw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id,
          bedrijf_id: bedrijfId,
          tijdslot,
          datum
        })
      });
      const dataErr = !res.ok ? await res.json().catch(()=>({})) : null;
      if (!res.ok) throw new Error(dataErr?.error || "Fout bij maken afspraak");
      const selectedBedrijf = bedrijven.find(b => String(b.bedrijf_id) === String(bedrijfId));
      setAfspraakDetails({
        bedrijfNaam: selectedBedrijf?.naam || "Onbekend",
        tijdslot,
        datum,
        bedrijfId
      });
      setBezetteTijdsloten(p => [...p, tijdslot]);
      setBeschikbareTijdsloten(p => p.filter(t => t !== tijdslot));
      setAfspraakIngediend(true);
      setRefreshTrigger(p => p + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container afspraken-module">
      <h2 className="module-title">Afspraak maken</h2>

      {afsprakenOverzicht.length > 0 && (
        <div className="info-blok">
          <h4>📌 Je hebt al afspraken op 13 maart 2026 met:</h4>
            <ul>
              {afsprakenOverzicht.map((a,i)=>(
                <li key={i}>🏢 {a.bedrijfsnaam} om {a.tijdslot}</li>
              ))}
            </ul>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!afspraakIngediend ? (
        <form onSubmit={handleSubmit}>
          {presetBedrijf && bedrijfId ? (
            <div className="vast-bedrijf-label">
              <strong>Bedrijf:</strong>{" "}
              {bedrijven.find(b => String(b.bedrijf_id) === String(bedrijfId))?.naam || `#${bedrijfId}`}
              <button
                type="button"
                className="wissel-bedrijf-btn"
                onClick={() => {
                  setPresetBedrijf(false);
                  setBedrijfId("");
                  setTijdslot("");
                  navigate("/student/afspraken", { replace: true });
                }}
              >
                Wijzig
              </button>
            </div>
          ) : (
            <select
              value={bedrijfId}
              onChange={e => { setBedrijfId(e.target.value); setTijdslot(""); }}
              required
            >
              <option value="">Kies een bedrijf</option>
              {bedrijven.map(b => (
                <option key={b.bedrijf_id} value={b.bedrijf_id}>{b.naam}</option>
              ))}
            </select>
          )}

          {bedrijfId && (
            <div className="tijdslot-grid">
              {alleTijdsloten.map(t => {
                const bezet = bezetteTijdsloten.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    className={`tijdslot-btn ${tijdslot === t ? "gekozen" : ""} ${bezet ? "bezet" : ""}`}
                    disabled={bezet}
                    onClick={() => setTijdslot(t)}
                  >
                    {t} {bezet ? "🔒" : ""}
                  </button>
                );
              })}
            </div>
          )}

          <button type="submit" disabled={loading || !tijdslot}>
            {loading ? "Bezig..." : "Afspraak maken"}
          </button>
        </form>
      ) : (
        <div className="result-blok">
          <h4>✅ Afspraak succesvol ingediend</h4>
          <p>{afspraakDetails.bedrijfNaam} om {afspraakDetails.tijdslot}</p>
          <button
            type="button"
            onClick={() => {
              setAfspraakIngediend(false);
              setTijdslot("");
              setAfspraakDetails(null);
              if (!presetBedrijf) setBedrijfId("");
            }}
          >
            Nieuwe afspraak
          </button>
        </div>
      )}
    </div>
  );
}