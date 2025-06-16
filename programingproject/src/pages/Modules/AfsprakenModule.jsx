import React, { useState, useEffect } from "react";
import { baseUrl } from "../../config";

export default function Afspraken() {
  const [bedrijvenLijst, setBedrijvenLijst] = useState([]);
  const [geselecteerdBedrijf, setGeselecteerdBedrijf] = useState(null);
  const [tijdslot, setTijdslot] = useState("");
  const [afspraakIngediend, setAfspraakIngediend] = useState(false);

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        const res = await fetch(`${baseUrl}/bedrijvenmodule`);
        const data = await res.json();
        setBedrijvenLijst(data);
        console.log("Bedrijven uit database:", data);
      } catch (err) {
        console.error("Fout bij ophalen bedrijven:", err);
      }
    }
    fetchBedrijven();
  }, []);

  console.log("Afspraakmodule ontvangen:", geselecteerdBedrijf);

  return (
    <div className="page-container">
      <h2>Afspraak maken</h2>
      <p>Selecteer hieronder een bedrijf en een tijdslot om een afspraak vast te leggen.</p>

      {geselecteerdBedrijf && (
        <div className="bedrijf-info">
          <h3>{geselecteerdBedrijf?.naam}</h3>
          {geselecteerdBedrijf?.logo_url && <img src={geselecteerdBedrijf.logo_url} alt={`${geselecteerdBedrijf.naam} logo`} style={{ maxWidth: "150px" }} />}
          <p>{geselecteerdBedrijf?.beschrijving}</p>
        </div>
      )}

      {!afspraakIngediend ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          setAfspraakIngediend(true);
        }}>
          <label>Bedrijf:</label><br />
          <select
            required
            value={geselecteerdBedrijf ? String(geselecteerdBedrijf.bedrijf_id) : ""}
            onChange={(e) => {
              const gekozenId = Number(e.target.value);
              console.log("Gekozen ID (type):", gekozenId, typeof gekozenId);
              const gekozen = bedrijvenLijst.find(b => Number(b.bedrijf_id) === gekozenId);
              console.log("Gekozen bedrijf:", gekozen);
              if (gekozen) {
                setGeselecteerdBedrijf(gekozen);
              }
            }}
          >
            <option value="" disabled>Kies een bedrijf</option>
            {bedrijvenLijst.map(bedrijf => (
              <option key={bedrijf.bedrijf_id} value={String(bedrijf.bedrijf_id)}>
                {bedrijf.naam}
              </option>
            ))}
          </select><br /><br />

          <label>Tijdslot:</label><br />
          <select required value={tijdslot} onChange={(e) => setTijdslot(e.target.value)}>
            <option value="">Kies een tijd</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
          </select><br /><br />

          <button type="submit">Afspraak maken</button>
        </form>
      ) : (
        <div className="afspraak-overzicht">
          <h3>Overzicht van je afspraak</h3>
          <p><strong>Bedrijf:</strong> {geselecteerdBedrijf?.naam}</p>
          <p><strong>Tijdslot:</strong> {tijdslot}</p>
          <p><strong>Beschrijving:</strong> {geselecteerdBedrijf?.beschrijving}</p>
          {geselecteerdBedrijf?.logo_url && (
            <img src={geselecteerdBedrijf.logo_url} alt={`${geselecteerdBedrijf.naam} logo`} style={{ maxWidth: "150px" }} />
          )}
        </div>
      )}
    </div>
  );
}