import React, { useEffect, useState } from "react";
import { baseUrl } from "../../config";
import "./BedrijvenModule.css";

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
              {bedrijf.logo_url ? (
                <img
                  src={bedrijf.logo_url}
                  alt={`Logo van ${bedrijf.bedrijfsnaam}`}
                  className="bedrijf-logo"
                />
              ) : (
                <div className="logo-placeholder">Geen logo</div>
              )}

              <h3>{bedrijf.bedrijfsnaam}</h3>

              <p className="bedrijf-beschrijving">
                {bedrijf.beschrijving || "Geen beschrijving beschikbaar."}
              </p>

              <p className="bedrijf-adres">
                {bedrijf.straat ?? ""} {bedrijf.nummer ?? ""},{" "}
                {bedrijf.postcode ?? ""} {bedrijf.gemeente ?? ""}
              </p>

              {bedrijf.email && (
                <p>
                  <strong>Email:</strong> {bedrijf.email}
                </p>
              )}

              {bedrijf.telefoon && (
                <p>
                  <strong>Telefoon:</strong> {bedrijf.telefoon}
                </p>
              )}

              {bedrijf.website && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={bedrijf.website} target="_blank" rel="noopener noreferrer">
                    {bedrijf.website}
                  </a>
                </p>
              )}

              {bedrijf.linkedin && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={bedrijf.linkedin} target="_blank" rel="noopener noreferrer">
                    {bedrijf.linkedin}
                  </a>
                </p>
              )}

              {bedrijf.sector_naam && (
                <p>
                  <strong>Sector:</strong> {bedrijf.sector_naam}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
