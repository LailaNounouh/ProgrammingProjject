import React, { useState, useEffect } from 'react';
import './StudentenDashboard.css';
import { baseUrl } from "../../config";

function App() {
  const [bedrijven, setBedrijven] = useState([]);
  const [filterSector, setFilterSector] = useState('all'); // filtering op sector

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        const response = await fetch(`${baseUrl}/bedrijven`);
        const data = await response.json();
        setBedrijven(data);
      } catch (error) {
        console.error("Fout bij laden bedrijven:", error);
      }
    }
    fetchBedrijven();
  }, []);

  // Alle unieke sectoren uit bedrijven halen
  const alleSectoren = React.useMemo(() => {
    const sectorSet = new Set();
    bedrijven.forEach(b => {
      if (b.sector_naam) {
        sectorSet.add(b.sector_naam);
      }
    });
    return Array.from(sectorSet).sort();
  }, [bedrijven]);

  // Filter bedrijven op sector
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
          />
        </section>

        <section id="bedrijven" className="bedrijven-section">
          <h2>Deelnemende bedrijven:</h2>

          {/* Dropdown filter */}
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
              gefilterdeBedrijven.map((bedrijf, index) => (
                <div className="bedrijf-kaart" key={index}>
                  {bedrijf.logo_url ? (
                    <img
                      src={bedrijf.logo_url}
                      alt={`${bedrijf.bedrijfsnaam} logo`}
                      className="bedrijf-logo"
                    />
                  ) : (
                    <div className="logo-placeholder">Geen logo</div>
                  )}
                  <p>{bedrijf.bedrijfsnaam || bedrijf.name || bedrijf.id}</p>
                  <a href="#">Meer info</a>
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
          {/* Afspraak maken sectie - voeg inhoud toe indien gewenst */}
        </section>
      </main>
    </div>
  );
}

export default App;
