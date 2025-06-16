import React, { useState, useEffect } from "react";
import { baseUrl } from "../../config";
import { useParams } from "react-router-dom";

export default function Afspraken() {
  const [geselecteerdBedrijf, setGeselecteerdBedrijf] = useState(null);
  const [tijdslot, setTijdslot] = useState("");
  const [afspraakIngediend, setAfspraakIngediend] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function fetchBedrijf() {
      try {
        const res = await fetch(`${baseUrl}/afspraken/${id}`);
        const data = await res.json();
        setGeselecteerdBedrijf(data);
      } catch (err) {
        console.error("Fout bij ophalen bedrijf:", err);
      }
    }
    fetchBedrijf();
  }, [id]);

  console.log("Afspraakmodule ontvangen:", geselecteerdBedrijf);

  return (
    <div className="page-container">
      <h2>Afspraak maken</h2>
      <p>Selecteer hieronder een tijdslot om een afspraak vast te leggen.</p>

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