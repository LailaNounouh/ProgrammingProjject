import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../context/ProfileContext";
import "./ProfielModule.css";

const ProfielModule = () => {
  const { gebruiker } = useAuth();
  const { profiel, fetchProfiel, loading } = useProfile();

  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    studie: "",
    telefoon: "",
    linkedin: "",
    beschrijving: "",
    skills: [],
    talen: [],
  });

  useEffect(() => {
    fetchProfiel();
  }, []);

  useEffect(() => {
    if (profiel) {
      setFormData({
        naam: profiel.naam || "",
        email: profiel.email || "",
        studie: profiel.studie || "",
        telefoon: profiel.telefoon || "",
        linkedin: profiel.linkedin || "",
        beschrijving: profiel.beschrijving || "",
        skills: [...(profiel.hardSkills || []), ...(profiel.softSkills || [])],
        talen: profiel.talen || [],
      });
    }
  }, [profiel]);

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
            <label>Hard Skills:</label>
            <p>{profiel?.hardSkills?.join(", ") || "Geen"}</p>
            <label>Soft Skills:</label>
            <p>{profiel?.softSkills?.join(", ") || "Geen"}</p>
          </div>
          <div className="info-item">
            <label>Talen (gescheiden met komma):</label>
            <p>{formData.talen.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfielModule;
