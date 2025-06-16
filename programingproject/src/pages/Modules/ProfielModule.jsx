import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../context/ProfileContext";
import "./ProfielModule.css";

const ProfielModule = () => {
  const { gebruiker } = useAuth();
  const { profiel, fetchProfiel, loading } = useProfile();

  useEffect(() => {
    fetchProfiel();
  }, []);

  if (loading) return <div className="loading">Laden...</div>;

  // Get profile data from localStorage if not in context
  const profielData = profiel || JSON.parse(localStorage.getItem("userProfile")) || {};
  console.log("Profile data:", profielData); // Debug log

  return (
    <div className="profiel-container">
      <h2>Mijn Profiel</h2>
      
      <div className="profiel-sectie">
        <h3>Persoonlijke Informatie</h3>
        <div className="profiel-info">
          <div className="info-item">
            <strong>Naam:</strong> {profielData.naam || 'Niet opgegeven'}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {profielData.email || 'Niet opgegeven'}
          </div>
          <div className="info-item">
            <strong>Studie:</strong> {profielData.studie || 'Niet opgegeven'}
          </div>
        </div>
      </div>

      <div className="profiel-sectie">
        <h3>Contact Informatie</h3>
        <div className="profiel-info">
          <div className="info-item">
            <strong>Telefoonnummer:</strong> {profielData.telefoon || 'Niet opgegeven'}
          </div>
          {profielData.linkedin && (
            <div className="info-item">
              <strong>LinkedIn:</strong> 
              <a href={profielData.linkedin} target="_blank" rel="noopener noreferrer">
                {profielData.linkedin}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="profiel-sectie">
        <h3>Vaardigheden en Talen</h3>
        <div className="profiel-info">
          <div className="info-item">
            <strong>Skills:</strong>
            <div className="tags">
              {profielData.skills && profielData.skills.map((skill, index) => (
                <span key={`skill-${index}`} className="tag">
                  {skill.label || skill}
                </span>
              ))}
            </div>
          </div>
          <div className="info-item">
            <strong>Talen:</strong>
            <div className="tags">
              {profielData.talen && profielData.talen.map((taal, index) => (
                <span key={`taal-${index}`} className="tag">
                  {taal.label || taal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {profielData.beschrijving && (
        <div className="profiel-sectie">
          <h3>Over Mij</h3>
          <div className="profiel-info">
            <p>{profielData.beschrijving}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfielModule;
