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
    <div className="afspraken-shell">
      <div className="afspraken-card">
        <h1 className="afspraken-title">
          <span className="spark">✦</span> Afspraak maken
        </h1>

        {afsprakenOverzicht.length > 0 && (
          <div className="afspraken-reeds">
            <p className="reeds-label">
              Je hebt al afspraken op <strong>13 maart 2026</strong> met:
            </p>
            <ul className="reeds-list">
              {afsprakenOverzicht.map((a, i) => (
                <li key={i} className="reeds-item">
                  <span className="reeds-bullet" />
                  <span className="reeds-bedrijf">{a.bedrijfsnaam}</span>
                  <span className="reeds-tijd">{a.tijdslot}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <div className="afspraken-alert afspraken-alert--error">{error}</div>}
        {afspraakIngediend && afspraakDetails && (
          <div className="afspraken-alert afspraken-alert--ok">
            Afspraak bevestigd: {afspraakDetails.bedrijfNaam} – {afspraakDetails.tijdslot}
          </div>
        )}

        {!afspraakIngediend && (
          <form onSubmit={handleSubmit} className="afspraak-inline-form">
            <div className="field-row">
              {presetBedrijf && bedrijfId ? (
                <div className="vast-bedrijf-chip">
                  {bedrijven.find(b => String(b.bedrijf_id) === String(bedrijfId))?.naam || `#${bedrijfId}`}
                  <button
                    type="button"
                    className="wissel-mini"
                    onClick={() => {
                      setPresetBedrijf(false);
                      setBedrijfId("");
                      setTijdslot("");
                      navigate("/student/afspraken", { replace: true });
                    }}
                    title="Wijzig bedrijf"
                  >
                    Wijzig
                  </button>
                </div>
              ) : (
                <select
                  value={bedrijfId}
                  onChange={e => { setBedrijfId(e.target.value); setTijdslot(""); }}
                  className="afspraak-select"
                  required
                >
                  <option value="">Kies een bedrijf</option>
                  {bedrijven.map(b => (
                    <option key={b.bedrijf_id} value={b.bedrijf_id}>{b.naam}</option>
                  ))}
                </select>
              )}

              <button
                type="submit"
                disabled={loading || !bedrijfId || !tijdslot}
                className="primary-btn"
              >
                {loading ? 'Bezig...' : 'Afspraak maken'}
              </button>
            </div>

            {bedrijfId && (
              <div className="slots-wrap">
                <div className="slots-header">
                  <span className="slots-label">Beschikbare tijdsloten</span>
                  <div className="slots-legend">
                    <span><i className="dot dot--vrij" /> vrij</span>
                    <span><i className="dot dot--gekozen" /> gekozen</span>
                    <span><i className="dot dot--bezet" /> bezet</span>
                  </div>
                </div>
                <div className="slots-grid">
                  {alleTijdsloten.map(t => {
                    const bezet = bezetteTijdsloten.includes(t);
                    const active = tijdslot === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        className={`slot-chip ${bezet ? 'is-bezet' : ''} ${active ? 'is-active' : ''}`}
                        disabled={bezet}
                        onClick={() => setTijdslot(t)}
                      >
                        {t}
                      </button>
                    );
                  })}
                  {alleTijdsloten.length === 0 && (
                    <div className="slots-empty">Geen tijdsloten geladen.</div>
                  )}
                </div>
              </div>
            )}
          </form>
        )}

        {afspraakIngediend && (
          <div className="result-actions">
            <button
              className="primary-btn"
              onClick={() => {
                setAfspraakIngediend(false);
                setTijdslot("");
                setAfspraakDetails(null);
                if (!presetBedrijf) setBedrijfId("");
              }}
            >
              Nieuwe afspraak
            </button>
            <button
              className="ghost-btn"
              onClick={() => navigate('/student')}
            >
              Terug naar dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}