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
            <div key={bedrijf.bedrijf_id} className="bedrijf-kaart-container">
              <div className="bedrijf-kaart">
                {/* Voorkant van de kaart */}
                <div className="bedrijf-voorkant">
                  <div className="bedrijf-logo">
                    {bedrijf.logo_url ? (
                      <img src={bedrijf.logo_url} alt={`${bedrijf.naam} logo`} />
                    ) : (
                      <div className="placeholder-logo">{bedrijf.naam.charAt(0)}</div>
                    )}
                  </div>
                  <div className="bedrijf-content">
                    <h3 className="bedrijf-naam">{bedrijf.naam}</h3>
                    <p className="bedrijf-beschrijving">
                      {bedrijf.beschrijving ? 
                        (bedrijf.beschrijving.length > 100 ? 
                          bedrijf.beschrijving.substring(0, 100) + '...' : 
                          bedrijf.beschrijving) : 
                        ""
                      }
                    </p>
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
                </div>
                
                {/* Achterkant van de kaart */}
                <div className="bedrijf-achterkant">
                  <div className="bedrijf-hover-header">
                    <div className="bedrijf-hover-naam">{bedrijf.naam}</div>
                    {bedrijf.sector && (
                      <div className="bedrijf-hover-sector">{bedrijf.sector}</div>
                    )}
                  </div>
                  
                  {bedrijf.contactpersoon && (
                    <div className="bedrijf-details-item">
                      <strong>Contactpersoon:</strong> {bedrijf.contactpersoon}
                    </div>
                  )}
                  {bedrijf.email && (
                    <div className="bedrijf-details-item">
                      <strong>Email:</strong> <a href={`mailto:${bedrijf.email}`}>{bedrijf.email}</a>
                    </div>
                  )}
                  {bedrijf.telefoonnummer && (
                    <div className="bedrijf-details-item">
                      <strong>Telefoon:</strong> <a href={`tel:${bedrijf.telefoonnummer}`}>{bedrijf.telefoonnummer}</a>
                    </div>
                  )}
                  {bedrijf.adres && (
                    <div className="bedrijf-details-item">
                      <strong>Adres:</strong> {bedrijf.adres}
                    </div>
                  )}
                  {bedrijf.specialisatie && (
                    <div className="bedrijf-details-item">
                      <strong>Specialisatie:</strong> {bedrijf.specialisatie}
                    </div>
                  )}
                  {bedrijf.website && (
                    <div className="bedrijf-details-item website-item">
                      <strong>Website:</strong> 
                      <a 
                        href={bedrijf.website.startsWith('http') ? bedrijf.website : `https://${bedrijf.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        {bedrijf.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}