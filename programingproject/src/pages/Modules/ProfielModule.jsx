import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../context/ProfileContext";
import "./ProfielModule.css";

const ProfielModule = () => {
  const { gebruiker } = useAuth();
  const { profiel, fetchProfiel, loading } = useProfile();

  const profielData = profiel || JSON.parse(localStorage.getItem("userProfile")) || {};

  const [formData, setFormData] = useState({
    naam: profielData.naam || '',
    email: profielData.email || '',
    studie: profielData.studie || '',
    telefoon: profielData.telefoon || '',
    linkedin: profielData.linkedin || '',
    beschrijving: profielData.beschrijving || '',
    skills: profielData.skills || [],
    talen: profielData.talen || [],
  });

  useEffect(() => {
    fetchProfiel();
  }, []);

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="profiel-container">
      <h2>Mijn Profiel</h2>

      <div className="profiel-sectie">
        <h3>Persoonlijke Informatie</h3>
        <div className="profiel-info">
          <div className="info-item">
            <label>Naam:</label>
            <p>{formData.naam}</p>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <p>{formData.email}</p>
          </div>
          <div className="info-item">
            <label>Studie:</label>
            <p>{formData.studie}</p>
          </div>
        </div>
      </div>

      <div className="profiel-sectie">
        <h3>Contact Informatie</h3>
        <div className="profiel-info">
          <div className="info-item">
            <label>Telefoonnummer:</label>
            <p>{formData.telefoon}</p>
          </div>
          <div className="info-item">
            <label>LinkedIn:</label>
            <p>{formData.linkedin}</p>
          </div>
        </div>
      </div>

      <div className="profiel-sectie">
        <h3>Over Mij</h3>
        <div className="profiel-info">
          <p>{formData.beschrijving}</p>
        </div>
      </div>

      <div className="profiel-sectie">
        <h3>Vaardigheden</h3>
        <div className="profiel-info">
          <div className="info-item">
            <label>Hard Skills (gescheiden met komma):</label>
            <p>{formData.skills.join(', ')}</p>
          </div>
          <div className="info-item">
            <label>Talen (gescheiden met komma):</label>
            <p>{formData.talen.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfielModule;
