import React, { useState, useEffect } from "react";
import "./BedrijvenModule.css";
import { baseUrl } from "../../config";

export default function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function haalBedrijvenOp() {
      try {
        setLoading(true);
        console.log(`Bedrijven ophalen van: ${baseUrl}/bedrijvenmodule`);
        
        const res = await fetch(`${baseUrl}/bedrijvenmodule`);
        if (!res.ok) throw new Error("Kon bedrijven niet ophalen");
        
        const data = await res.json();
        console.log("Bedrijven data:", data);
        setBedrijven(data);
      } catch (err) {
        console.error("Fout bij ophalen bedrijven:", err);
        setError("Er is een probleem opgetreden bij het ophalen van de bedrijven.");
      } finally {
        setLoading(false);
      }
    }

    haalBedrijvenOp();
  }, []);

  return (
    <div className="page-container bedrijven-module">
      <h2 className="module-title">Deelnemende Bedrijven</h2>
      <p className="module-subtext">
        Hier vind je een overzicht van alle bedrijven die deelnemen aan het event.
      </p>

      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Bedrijven laden...</p>
      ) : (
        <div className="bedrijven-grid">
          {bedrijven.map((bedrijf) => (
            <div key={bedrijf.bedrijf_id} className="bedrijf-kaart">
              <div className="bedrijf-logo">
                {bedrijf.logo_url ? (
                  <img src={bedrijf.logo_url} alt={`${bedrijf.naam} logo`} />
                ) : (
                  <div className="placeholder-logo">{bedrijf.naam.charAt(0)}</div>
                )}
              </div>
              <h3 className="bedrijf-naam">{bedrijf.naam}</h3>
              <p className="bedrijf-beschrijving">{bedrijf.beschrijving || "Geen beschrijving beschikbaar"}</p>
              {bedrijf.website && (
                <a 
                  href={bedrijf.website.startsWith('http') ? bedrijf.website : `https://${bedrijf.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bedrijf-link"
                >
                  Bezoek website
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}