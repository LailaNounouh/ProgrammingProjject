import React, { useState, useEffect, useMemo } from 'react';
import './StudentenDashboard.css';
import { baseUrl } from "../../config";

function App() {
  const [bedrijven, setBedrijven] = useState([]);
  const [filterSector, setFilterSector] = useState('all');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [laadFout, setLaadFout] = useState(false);

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        const response = await fetch(`${baseUrl}/bedrijven`);
        const data = await response.json();
        console.log("⬇️ Ontvangen bedrijven data:", data);

        if (Array.isArray(data)) {
          setBedrijven(data);
        } else {
          console.error("❌ Verwachte array, maar kreeg:", data);
          setLaadFout(true);
        }
      } catch (error) {
        console.error("Fout bij laden bedrijven:", error);
        setLaadFout(true);
      }
    }

    fetchBedrijven();
  }, []);

  // Unieke sectoren uit de bedrijvenlijst halen
  const alleSectoren = useMemo(() => {
    const sectorSet = new Set();
    bedrijven.forEach(b => {
      if (b.sector_naam) sectorSet.add(b.sector_naam);
    });
    return Array.from(sectorSet).sort();
  }, [bedrijven]);

  // Filteren op sector
  const gefilterdeBedrijven = filterSector === 'all'
    ? bedrijven
    : bedrijven.filter(b => b.sector_naam === filterSector);

  return (
    <div className="app">
      <main>
        <section className="linkedin-section">
          <label htmlFor="linkedin">LinkedIn toevoegen:*</label>
          <input
            type="url"
            id="linkedin"
            placeholder="URL naar LinkedIn profiel"
            value={linkedinUrl}
            onChange={e => setLinkedinUrl(e.target.value)}
          />
        </section>

        <section id="bedrijven" className="bedrijven-section">
          <h2>Deelnemende bedrijven:</h2>

          {laadFout && (
            <p className="error">
              ❌ Fout bij laden van bedrijven. Probeer later opnieuw.
            </p>
          )}

          {!laadFout && (
            <>
              <label htmlFor="sectorFilter">Filter op sector:</label>
              <select
                id="sectorFilter"
                value={filterSector}
                onChange={e => setFilterSector(e.target.value)}
                className="filter-select"
              >
                <option value="all">Alle sectoren</option>
                {alleSectoren.map((sector, idx) => (
                  <option key={idx} value={sector}>{sector}</option>
                ))}
              </select>

              <div className="bedrijven-lijst">
                {bedrijven.length === 0 ? (
                  <p>Bedrijven worden geladen...</p>
                ) : gefilterdeBedrijven.length === 0 ? (
                  <p>Geen bedrijven gevonden in deze sector.</p>
                ) : (
                  gefilterdeBedrijven.map((bedrijf) => (
                    <div className="bedrijf-kaart" key={bedrijf.id || bedrijf.bedrijf_id}>
                      {bedrijf.logo_url ? (
                        <img
                          src={bedrijf.logo_url}
                          alt={`${bedrijf.bedrijfsnaam || bedrijf.naam} logo`}
                          className="bedrijf-logo"
                        />
                      ) : (
                        <div className="logo-placeholder">Geen logo</div>
                      )}
                      <p>{bedrijf.bedrijfsnaam || bedrijf.naam || 'Naam onbekend'}</p>
                      <a href="#">Meer info</a>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>

        <section id="standen" className="standen-section">
          <h2>Standen:</h2>
          <div className="standen-grid">
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
            <div className="stand">Buffet</div>
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
            <div className="stand">Onthaal</div>
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
          </div>
        </section>

        <section id="afspraak">
          {/* Afspraak maken sectie - voeg inhoud toe indien gewenst */}
        </section>
      </main>
    </div>
  );
}

export default App;
