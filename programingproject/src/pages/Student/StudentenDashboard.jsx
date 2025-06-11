import React, { useState, useEffect } from 'react';
import './StudentenDashboard.css';
import { baseUrl } from "../../config";

function App() {
  const [bedrijven, setBedrijven] = useState([]);

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
          <button className="filter-button">Filter ▼</button>
          <div className="bedrijven-lijst">
            {bedrijven.length === 0 ? (
              <p>Bedrijven worden geladen...</p>
            ) : (
              bedrijven.map((bedrijf, index) => (
                <div className="bedrijf-kaart" key={index}>
                  <div className="logo-placeholder"></div>
                  <p>{bedrijf.name || bedrijf.id}</p>
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
