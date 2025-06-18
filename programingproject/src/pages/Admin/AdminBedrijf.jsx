import React, { useState } from 'react';
import './AdminBedrijf.css';
import { useNavigate } from "react-router-dom";

function AdminBedrijf() {
  const [bedrijven, setBedrijven] = useState([
    { naam: 'Microsoft' }, { naam: 'Cisco' }, { naam: 'Sopra Steria' }, { naam: 'Webdoos' },
    { naam: 'Amazon' }, { naam: 'Google' }, { naam: 'Tesla' }, { naam: 'Meta' },
    { naam: 'Apple' }, { naam: 'IBM' }, { naam: 'Oracle' }, { naam: 'Dell' },
    { naam: 'Intel' }, { naam: 'Nvidia' }, { naam: 'SAP' }, { naam: 'Atos' },
    { naam: 'Capgemini' }, { naam: 'HP' }, { naam: 'Zoom' }, { naam: 'Slack' },
    { naam: 'Dropbox' }, { naam: 'Salesforce' }, { naam: 'Red Hat' }, { naam: 'GitHub' },
    { naam: 'Bitbucket' }, { naam: 'Trello' }, { naam: 'Spotify' }, { naam: 'YouTube' },
    { naam: 'Snapchat' }, { naam: 'TikTok' }
  ]);

  const [bewerkBedrijvenModus, setBewerkBedrijvenModus] = useState(false);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

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
      {/* ✅ Terugknop helemaal bovenaan */}
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
              .filter((bedrijf) => bedrijf.naam.toLowerCase().includes(filter.toLowerCase()))
              .map((bedrijf, index) => (
                <div key={index} className="bedrijf-card">
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
