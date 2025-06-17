import "./AfsprakenModule.css";
import React, { useState, useEffect } from "react";
import { baseUrl } from "../../config";

export default function Afspraken() {
  const beschikbareTijdsloten = [
    "13:30", "13:45", "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "15:45", "16:00", "16:15"
  ];

  // Voorbeeld: deze tijdsloten zijn al bezet (kun je dynamisch maken later)
  const bezetteTijdsloten = ["14:00", "15:30"];

  const [bedrijven, setBedrijven] = useState([]);
  const [bedrijfId, setBedrijfId] = useState("");
  const [tijdslot, setTijdslot] = useState("");
  const [afspraakIngediend, setAfspraakIngediend] = useState(false);

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        const res = await fetch(`${baseUrl}/bedrijvenmodule`);
        const data = await res.json();
        setBedrijven(data);
      } catch (err) {
        console.error("Fout bij ophalen bedrijven:", err);
      }
    }
    fetchBedrijven();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAfspraakIngediend(true);
  };

  return (
    <div className="page-container afspraken-module">
      <h2 className="module-title">Afspraak maken</h2>

      {!afspraakIngediend ? (
        <div className="form-blok">
          <p className="module-subtext">Selecteer hieronder een bedrijf en een tijdslot om een afspraak vast te leggen.</p>
          <form onSubmit={handleSubmit}>
            <label>Bedrijf:</label><br />
            <select
              required
              className="form-select"
              value={bedrijfId}
              onChange={(e) => setBedrijfId(e.target.value)}
            >
              <option value="">Kies een bedrijf</option>
              {bedrijven.map((bedrijf) => (
                <option key={bedrijf.bedrijf_id} value={bedrijf.bedrijf_id}>
                  {bedrijf.naam}
                </option>
              ))}
            </select><br /><br />

            <label>Kies een tijdstip:</label>
            <div className="tijdslot-grid">
              {beschikbareTijdsloten.map((tijd) => {
                const isBezet = bezetteTijdsloten.includes(tijd);
                const isGekozen = tijdslot === tijd;
                return (
                  <button
                    key={tijd}
                    type="button"
                    disabled={isBezet}
                    className={`tijdslot-btn ${isBezet ? "bezet" : ""} ${isGekozen ? "gekozen" : ""}`}
                    onClick={() => setTijdslot(tijd)}
                  >
                    {tijd}
                  </button>
                );
              })}
            </div><br />

            <button type="submit" className="btn-submit">Afspraak maken</button>
          </form>
        </div>
      ) : (
        <div className="overzicht-blok">
          <p className="bevestiging"><strong>✅ Je afspraak is ingediend!</strong></p>
          <p><strong>Bedrijf:</strong> {bedrijven.find(b => b.bedrijf_id === parseInt(bedrijfId))?.naam}</p>
          <p><strong>Tijdslot:</strong> {tijdslot}</p>
        </div>
      )}
    </div>
  );
}