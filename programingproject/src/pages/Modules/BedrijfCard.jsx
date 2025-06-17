import React, { useState } from 'react';
import './BedrijfCard.css';

const BedrijfCard = ({ bedrijf }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

          <div className="info-section">
            <h4>Vacatures</h4>
            <ul>
              {bedrijf.vacatures?.map((vacature, index) => (
                <li key={index}>{vacature}</li>
              ))}
            </ul>
          </div>

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
        </div>
      )}
    </div>
  );
};

export default BedrijfCard;