import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import './SeekerDashboard.css'; 


const SeekerDashboard = () => {
  const { gebruiker } = useAuth();
  const [bedrijven, setBedrijven] = useState([]);

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
    <div className="dashboard-container">

      <div className="welcome-section">
        <h1>Welkom{gebruiker ? `, ${gebruiker.naam}` : ' op het dashboard'}</h1>
        <p>Bekijk hieronder de deelnemende bedrijven aan de CareerLaunch</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Deelnemende Bedrijven</h2>
            <Link to="/Seeker/bedrijven" className="view-all">
              Bekijk alles →
            </Link>
          </div>
          <div className="bedrijven-list">
            {bedrijven.length > 0 ? (
              bedrijven.map((bedrijf, index) => (
                <div key={`bedrijf-${bedrijf.id || index}`} className="bedrijf-item">
                  <span>{bedrijf.naam}</span>
                  <span className="bedrijf-sector">{bedrijf.sector}</span>
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
