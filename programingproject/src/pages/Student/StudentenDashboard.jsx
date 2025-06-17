import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import './StudentenDashboard.css';

const StudentDashboard = () => {
  const { gebruiker } = useAuth();
  const [bedrijven, setBedrijven] = useState([]);
  const [afspraken, setAfspraken] = useState([]);

  useEffect(() => {
    // Haal deelnemende bedrijven op
    const fetchBedrijven = async () => {
      try {
        const response = await fetch('http://10.2.160.211:3000/api/bedrijvenmodule');
        if (response.ok) {
          const data = await response.json();
          setBedrijven(data.slice(0, 5)); // Toon alleen de eerste 5 bedrijven
        }
      } catch (error) {
        console.error('Fout bij ophalen bedrijven:', error);
      }
    };

    // Haal afspraken op alleen als gebruiker bestaat
    const fetchAfspraken = async () => {
      if (!gebruiker?.id) return; 

      try {
        const response = await fetch(`http://10.2.160.211:3000/api/afspraken/student/${gebruiker.id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Opgehaalde afspraken:', data); 
          setAfspraken(data);
        } else {
          console.error('Fout bij ophalen afspraken:', await response.text());
        }
      } catch (error) {
        console.error('Fout bij ophalen afspraken:', error);
      }
    };

    fetchBedrijven();
    fetchAfspraken();
  }, [gebruiker]); 

  return (
    <div className="dashboard-container">

      <div className="welcome-section">
        <h1>Welkom{gebruiker ? `, ${gebruiker.naam}` : ' op het dashboard'}</h1>
        <p>Hier is een overzicht van de jobbeurs</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Deelnemende Bedrijven</h2>
            <Link to="/student/bedrijven" className="view-all">
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

        {gebruiker && (
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Komende Afspraken</h2>
              <Link to="/student/afspraken" className="view-all">
                Bekijk alles →
              </Link>
            </div>
            <div className="afspraken-list">
              {afspraken.length > 0 ? (
                afspraken.map((afspraak, index) => (
                  <div key={`afspraak-${afspraak.id || index}`} className="afspraak-item">
                    <div className="afspraak-info">
                      <span className="afspraak-bedrijf">{afspraak.bedrijf_naam}</span>
                      <span className="afspraak-tijd">
                        {new Date(afspraak.datum_tijd).toLocaleString('nl-BE')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="geen-afspraken">
                  Je hebt nog geen afspraken gepland.
                  <Link to="/student/afsprakenmodule" className="maak-afspraak">
                    Plan een afspraak
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;