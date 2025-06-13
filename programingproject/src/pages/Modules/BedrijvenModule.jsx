import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../config";
import "./BedrijvenModule.css";

export default function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        const response = await fetch(`${baseUrl}/bedrijvenmodule`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setBedrijven(data);
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
        <ul className="bedrijven-lijst">
          {bedrijven.map((bedrijf) => (
            <li key={`${bedrijf.naam}-${bedrijf.email}`} className="bedrijf-item">
              {bedrijf.logo_url && (
                <img
                  src={bedrijf.logo_url}
                  alt={`Logo van ${bedrijf.naam}`}
                  className="bedrijf-logo"
                />
              )}

              <div className="bedrijf-info">
                <h3>
                  <Link to={`/bedrijf/${encodeURIComponent(bedrijf.naam)}`}>
                    {bedrijf.naam}
                  </Link>
                </h3>

                <p>
                  <strong>Adres:</strong>{" "}
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
