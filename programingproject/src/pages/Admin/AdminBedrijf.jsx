import React, { useState, useEffect } from 'react';
import './AdminBedrijf.css';
import { useNavigate } from "react-router-dom";
import { baseUrl } from '../../config';

function AdminBedrijf() {
  const [bedrijven, setBedrijven] = useState([]);
  const [filter, setFilter] = useState('');
  const [toonBewerken, setToonBewerken] = useState(false);
  const [nieuweNaam, setNieuweNaam] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${baseUrl}/bedrijvenmodule`)
      .then((res) => {
        if (!res.ok) throw new Error('Netwerkfout');
        return res.json();
      })
      .then((data) => {
        const bedrijvenLijst = Array.isArray(data) ? data : data.bedrijven;
        if (!bedrijvenLijst || !Array.isArray(bedrijvenLijst)) {
          throw new Error("Ongeldig formaat van API-response");
        }
        setBedrijven(bedrijvenLijst);
      })
      .catch((err) => {
        console.error('Fout bij ophalen bedrijven:', err.message);
      });
  }, []);

  const vernieuwBedrijven = () => {
    fetch(`${baseUrl}/bedrijvenmodule`)
      .then((res) => res.json())
      .then((data) => {
        const bedrijvenLijst = Array.isArray(data) ? data : data.bedrijven;
        setBedrijven(bedrijvenLijst);
      });
  };

  const voegBedrijfToe = () => {
    if (!nieuweNaam.trim()) return;
    fetch(`${baseUrl}/bedrijvenmodule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naam: nieuweNaam })
    })
      .then(() => {
        setNieuweNaam('');
        vernieuwBedrijven();
      })
      .catch(console.error);
  };

  const verwijderBedrijf = (id) => {
    fetch(`${baseUrl}/bedrijvenmodule/${id}`, {
      method: 'DELETE'
    })
      .then(vernieuwBedrijven)
      .catch(console.error);
  };

  const wijzigBedrijf = (id, nieuweNaam) => {
    fetch(`${baseUrl}/bedrijvenmodule/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naam: nieuweNaam })
    })
      .then(vernieuwBedrijven)
      .catch(console.error);
  };

  return (
    <div className="admin-dashboard">
      <div className="terug-knop-container">
        <button className="terug-button" onClick={() => navigate("/admin")}>
          ← Terug naar dashboard
        </button>
      </div>

      <main className="admin-main">
        <section className="bedrijven-section">
          <h2>Deelnemende bedrijven:</h2>

          <div className="bedrijven-header">
            <input
              type="text"
              placeholder="Filter op naam..."
              className="filter-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button className="bewerken-button" onClick={() => setToonBewerken(!toonBewerken)}>
              {toonBewerken ? 'Opslaan' : 'Bewerken'}
            </button>
          </div>

          {!toonBewerken && (
            <div className="bedrijven-grid">
              {bedrijven
                .filter((bedrijf) => bedrijf.naam?.toLowerCase().includes(filter.toLowerCase()))
                .map((bedrijf, index) => (
                  <div key={bedrijf.bedrijf_id || index} className="bedrijf-card">
                    <div className="bedrijf-image">
                      <div className="bedrijf-logo-placeholder"></div>
                    </div>
                    <strong>{bedrijf.naam}</strong>
                    <p className="meer-info">• Meer info</p>
                  </div>
                ))}
            </div>
          )}

          {toonBewerken && (
            <div className="bewerken-container">
              <div className="toevoegen-container">
                <input
                  type="text"
                  placeholder="Nieuwe bedrijfsnaam"
                  value={nieuweNaam}
                  onChange={(e) => setNieuweNaam(e.target.value)}
                />
                <button className="toevoegen-button" onClick={voegBedrijfToe}>Toevoegen</button>
              </div>

              <ul className="bedrijven-lijst">
                {bedrijven.map((bedrijf) => (
                  <li key={bedrijf.bedrijf_id} className="bedrijf-item">
                    <input
                      defaultValue={bedrijf.naam}
                      onBlur={(e) => wijzigBedrijf(bedrijf.bedrijf_id, e.target.value)}
                    />
                    <button className="verwijder-button" onClick={() => verwijderBedrijf(bedrijf.bedrijf_id)}>
                      Verwijderen
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminBedrijf;
