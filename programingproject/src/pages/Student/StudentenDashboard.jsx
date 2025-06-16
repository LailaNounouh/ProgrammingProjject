import React, { useState, useEffect, useMemo } from 'react'; 
import './StudentenDashboard.css';
import { baseUrl } from "../../config";

function StudentenDashboard() {
  const [bedrijven, setBedrijven] = useState([]);
  const [filterSector, setFilterSector] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        const response = await fetch(`${baseUrl}/bedrijvenmodule`);
        if (!response.ok) {
          throw new Error(`HTTP-fout! status: ${response.status}`);
        }
        const data = await response.json();
        setBedrijven(data);
        setError(null);
      } catch (error) {
        console.error("Fout bij laden bedrijven:", error);
        setError("Fout bij laden bedrijven, probeer later opnieuw.");
      }
    }

    fetchBedrijven();
  }, []);

  const alleSectoren = useMemo(() => {
    const sectorSet = new Set();
    bedrijven.forEach(b => {
      if (b.sector_naam) sectorSet.add(b.sector_naam);
    });
    return Array.from(sectorSet).sort();
  }, [bedrijven]);

  const gefilterdeBedrijven = filterSector === 'all'
    ? bedrijven
    : bedrijven.filter(b => b.sector_naam === filterSector);

  return (
    <div className="app">
      <main>

        <section id="bedrijven" className="bedrijven-section">
          <h2>Deelnemende bedrijven:</h2>

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
            {error ? (
              <p className="error">{error}</p>
            ) : bedrijven.length === 0 ? (
              <p>Bedrijven worden geladen...</p>
            ) : gefilterdeBedrijven.length === 0 ? (
              <p>Geen bedrijven gevonden in deze sector.</p>
            ) : (
              gefilterdeBedrijven.map((bedrijf, index) => (
                <div className="bedrijf-kaart" key={`${bedrijf.naam}-${index}`}>
                  {bedrijf.logo_url ? (
                    <img
                      src={bedrijf.logo_url}
                      alt={`${bedrijf.naam} logo`}
                      className="bedrijf-logo"
                    />
                  ) : (
                    <div className="logo-placeholder">Geen logo</div>
                  )}
                  <p>{bedrijf.naam}</p>
                  <a href={`/bedrijven/${bedrijf.naam}`} className="meer-info-link">
                    Meer info
                  </a>
                </div>
              ))
            )}
          </div>
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
          {/* Placeholder voor toekomstige afsprakenmodule */}
        </section>
      </main>
    </div>
  );
}

export default StudentenDashboard;
