import React, { useState, useEffect } from 'react';
import './StudentenDashboard.css';

function App() {
  const [bedrijven, setBedrijven] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/bedrijven")
      .then((res) => res.json())
      .then((data) => setBedrijven(data))
      .catch((error) => console.error("Fout bij laden bedrijven:", error));
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
                  <p>{String(bedrijf.name || bedrijf.id)}</p>
                  <a href="#">Meer info</a>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="standen" className="standen-section">
          <h2>Standen:</h2>
          <div className="standen-grid">
            {/* Voorbeeldstructuur */}
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
            {/* Voeg eventueel meer toe volgens het plan */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

        <section id="afspraak">
          {/* Afspraak maken sectie - voeg inhoud toe indien gewenst */}
        </section>