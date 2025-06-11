import React, { useEffect, useState } from "react";
import { baseUrl } from "../../config";

export default function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        const response = await fetch(`${baseUrl}/bedrijven`);
        const data = await response.json();
        setBedrijven(data);
      } catch (error) {
        console.error("Fout bij ophalen bedrijven:", error);
      }
    }

    fetchBedrijven();
  }, []);

  return (
    <div className="page-container">
      <h2>Deelnemende Bedrijven</h2>
      <p>Hieronder vind je een overzicht van alle bedrijven die deelnemen aan de beursdag.</p>

      {bedrijven.length === 0 ? (
        <p>Bedrijven worden geladen...</p>
      ) : (
        <div className="bedrijven-grid">
          {bedrijven.map((bedrijf) => (
            <div key={bedrijf.id} className="bedrijf-kaart">
              {bedrijf.logo_url && (
                <img
                  src={bedrijf.logo_url}
                  alt={`Logo van ${bedrijf.bedrijfsnaam}`}
                  className="bedrijf-logo"
                />
              )}
              <h3>{bedrijf.bedrijfsnaam}</h3>
              <p>{bedrijf.beschrijving || "Geen beschrijving beschikbaar."}</p>
              <p>
                {bedrijf.straat ?? ""} {bedrijf.nummer ?? ""}, {bedrijf.postcode ?? ""} {bedrijf.gemeente ?? ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
