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

        // Check of data een array is of een object met een array erin
        if (Array.isArray(data)) {
          setBedrijven(data);
        } else if (Array.isArray(data.bedrijven)) {
          setBedrijven(data.bedrijven);
        } else {
          console.error("Ongeldig formaat van API-response:", data);
          setBedrijven([]);
        }
      } catch (error) {
        console.error("Fout bij ophalen bedrijven:", error);
        setBedrijven([]);
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
            <div key={bedrijf.bedrijf_id} className="bedrijf-kaart">
              {bedrijf.logo_url ? (
                <img
                  src={bedrijf.logo_url}
                  alt={`Logo van ${bedrijf.naam}`}
                  className="bedrijf-logo"
                />
              ) : (
                <div className="logo-placeholder">Geen logo</div>
              )}

              <h3>{bedrijf.naam}</h3>

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

              {bedrijf.telefoonnummer && (
                <p>
                  <strong>Telefoon:</strong> {bedrijf.telefoonnummer}
                </p>
              )}

              {bedrijf.website_of_linkedin && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={bedrijf.website_of_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {bedrijf.website_of_linkedin}
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
