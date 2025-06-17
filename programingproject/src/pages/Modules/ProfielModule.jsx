import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../context/ProfileContext";
import "./ProfielModule.css";

const ProfielModule = () => {
  const { gebruiker } = useAuth();
  const { profiel, fetchProfiel, loading, updateProfiel } = useProfile();

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

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfiel();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateProfiel(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Fout bij bijwerken profiel:", error);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="profiel-container">
      <h2>Mijn Profiel</h2>

      <div className="profiel-sectie">
        <h3>Persoonlijke Informatie</h3>
        <div className="profiel-info">
          <div className="info-item">
            <label>Naam:</label>
            <input type="text" name="naam" value={formData.naam} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Studie:</label>
            <input type="text" name="studie" value={formData.studie} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="profiel-sectie">
        <h3>Contact Informatie</h3>
        <div className="profiel-info">
          <div className="info-item">
            <label>Telefoonnummer:</label>
            <input type="tel" name="telefoon" value={formData.telefoon} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>LinkedIn:</label>
            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="profiel-sectie">
        <h3>Over Mij</h3>
        <div className="profiel-info">
          <textarea name="beschrijving" value={formData.beschrijving} onChange={handleChange} rows="4" />
        </div>
      </div>

      <div className="profiel-sectie">
        <h3>Vaardigheden</h3>
        <div className="profiel-info">
          <div className="info-item">
            <label>Hard Skills (gescheiden met komma):</label>
            <input
              type="text"
              name="skills"
              value={formData.skills.join(', ')}
              onChange={(e) => {
                const skills = e.target.value.split(',').map(s => s.trim());
                setFormData(prev => ({ ...prev, skills }));
              }}
            />
          </div>
          <div className="info-item">
            <label>Talen (gescheiden met komma):</label>
            <input
              type="text"
              name="talen"
              value={formData.talen.join(', ')}
              onChange={(e) => {
                const talen = e.target.value.split(',').map(t => t.trim());
                setFormData(prev => ({ ...prev, talen }));
              }}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`opslaan-knop ${success ? 'success' : ''}`}
        onClick={handleSubmit}
      >
        {success ? "Opgeslagen" : "Opslaan"}
      </button>
    </div>
  );
};

export default ProfielModule;
