import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import './SeekerDashboard.css'; 


const SeekerDashboard = () => {
  const { gebruiker } = useAuth();
  const [bedrijven, setBedrijven] = useState([]);
  const [filterSector, setFilterSector] = useState('all');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Fout bij parsen van gebruikersdata:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchBedrijven = async () => {
      try {
        const response = await fetch('http://10.2.160.211:3000/api/bedrijvenmodule');
        if (response.ok) {
          const data = await response.json();
          setBedrijven(data.slice(0, 5)); // Toon enkel eerste 5 bedrijven
        }
      } catch (error) {
        console.error('Fout bij ophalen bedrijven:', error);
      }
    };

    fetchBedrijven();
  }, []);

  return (
    <div className="app">
      <main>
        {user && (
          <div className="gebruiker-info">
            <p><strong>Ingelogd als:</strong> {user.voornaam} {user.achternaam} ({user.email})</p>
          </div>
        )}

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

          <div className="bedrijven-grid">
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
                  <p className="bedrijf-naam">{bedrijf.naam}</p>
                  <a href={`/bedrijven/${bedrijf.naam}`} className="meer-info-link">
                    Meer info
                  </a>
                </div>
              ))
            ) : (
              <p>Laden van bedrijven...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
