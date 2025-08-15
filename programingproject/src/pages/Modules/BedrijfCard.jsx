import React, { useState } from 'react';
import './BedrijfCard.css';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom'; // <-- toegevoegd

const API_BASE = import.meta.env.VITE_API_BASE || 'http://10.2.160.211:3000/api';
const CAREER_LAUNCH_DAY = '2026-03-13';

const BedrijfCard = ({ bedrijf }) => {
  const { gebruiker } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate(); // <-- toegevoegd

  return (
    <div className={`bedrijf-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="bedrijf-header">
        <h3>{bedrijf.naam}</h3>
        <button
          className="toggle-info-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Verberg info' : 'Toon meer'}
        </button>
      </div>

      <div className="bedrijf-basic-info">
        <p className="sector">{bedrijf.sector}</p>
        <p className="locatie">{bedrijf.locatie}</p>
      </div>

      {isExpanded && (
        <div className="bedrijf-expanded-info">
          <div className="info-section">
            <h4>Over ons</h4>
            <p>{bedrijf.beschrijving}</p>
          </div>

            {bedrijf.vacatures?.length > 0 && (
              <div className="info-section">
                <h4>Vacatures</h4>
                <ul>
                  {bedrijf.vacatures.map((vacature, index) => (
                    <li key={index}>{vacature}</li>
                  ))}
                </ul>
              </div>
            )}

          <div className="info-section">
            <h4>Contact</h4>
            <p>Email: {bedrijf.email}</p>
            <p>Telefoon: {bedrijf.telefoon}</p>
            {bedrijf.website && (
              <a
                href={bedrijf.website}
                target="_blank"
                rel="noopener noreferrer"
                className="website-link"
              >
                Bezoek website
              </a>
            )}
          </div>

          <div className="info-section afspraak-section">
            <h4>Afspraak</h4>
            <button
              className="afspraak-act-btn"
              onClick={() => navigate(`/student/afspraken?bedrijf=${bedrijfId}`)}
            >
              Maak afspraak
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedrijfCard;