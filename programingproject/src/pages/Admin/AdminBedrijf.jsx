import React, { useState, useEffect } from 'react';
import './AdminBedrijf.css';
import { useNavigate } from "react-router-dom";
import { baseUrl } from '../../config';

function AdminBedrijf() {
  const [bedrijven, setBedrijven] = useState([]);
  const [bewerkBedrijvenModus, setBewerkBedrijvenModus] = useState(false);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  // ✅ Haal bedrijven op uit database bij laden van de component
  useEffect(() => {
    fetch(`${baseUrl}/bedrijvenmodule`)
      .then((res) => {
        if (!res.ok) throw new Error('Netwerkfout');
        return res.json();
      })
      .then((data) => {
        // ✅ Als de backend { bedrijven: [...] } teruggeeft
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

  const handleBedrijfNaamChange = (index, nieuweNaam) => {
    const nieuweBedrijven = [...bedrijven];
    nieuweBedrijven[index].naam = nieuweNaam;
    setBedrijven(nieuweBedrijven);
  };

  const handleVerwijderBedrijf = (index) => {
    const nieuweBedrijven = [...bedrijven];
    nieuweBedrijven.splice(index, 1);
    setBedrijven(nieuweBedrijven);
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
          </div>

          <div className="bedrijven-grid">
            {bedrijven
              .filter((bedrijf) => bedrijf.naam?.toLowerCase().includes(filter.toLowerCase()))
              .map((bedrijf, index) => (
                <div key={bedrijf.bedrijf_id || index} className="bedrijf-card">
                  <div className="bedrijf-image">
                    <div className="bedrijf-logo-placeholder"></div>
                  </div>
                  {bewerkBedrijvenModus ? (
                    <>
                      <input
                        type="text"
                        value={bedrijf.naam}
                        onChange={(e) => handleBedrijfNaamChange(index, e.target.value)}
                        className="bedrijf-input"
                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                      />
                      <button
                        className="verwijder-button"
                        onClick={() => handleVerwijderBedrijf(index)}
                      >
                        Verwijder
                      </button>
                    </>
                  ) : (
                    <strong>{bedrijf.naam}</strong>
                  )}
                  <p className="meer-info">• Meer info</p>
                </div>
              ))}
          </div>

          <div className="bedrijven-footer">
            <button
              className="bewerken-button"
              onClick={() => setBewerkBedrijvenModus(!bewerkBedrijvenModus)}
            >
              {bewerkBedrijvenModus ? 'Opslaan' : 'Bewerk'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminBedrijf;
