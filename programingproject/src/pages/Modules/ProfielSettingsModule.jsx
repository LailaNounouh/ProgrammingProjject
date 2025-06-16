import React, { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthProvider";
import  CodeerTaalSelector  from "../../components/dropdowns/CodeerTaalSelector";
import  TaalSelector  from "../../components/dropdowns/TaalSelector";
import  HardSkillsSelector from "../../components/dropdowns/HardSkillsSelector";
import  SoftSkillsSelector  from "../../components/dropdowns/SoftSkillsSelector";
import "./ProfielSettingsModule.css";

const ProfielSettingsModule = () => {
  const { gebruiker } = useAuth();
  const { profiel, fetchProfiel, updateProfiel, loading } = useProfile();

  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    studie: "",
    telefoon: "",
    beschrijving: "",
    linkedin: "",
    codeertaal: [],
    talen: [],
    hardSkills: [],
    softSkills: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (gebruiker?.id) {
      fetchProfiel();
    }
  }, [gebruiker]);

  useEffect(() => {
    if (profiel) {
      setFormData({
        naam: profiel.naam || "",
        email: profiel.email || "",
        studie: profiel.studie || "",
        telefoon: profiel.telefoon || "",
        beschrijving: profiel.beschrijving || "",
        linkedin: profiel.linkedin || "",
        codeertaal: profiel.codeertaal || [],
        talen: profiel.talen || [],
        hardSkills: profiel.hardSkills || [],
        softSkills: profiel.softSkills || [],
      });
    }
  }, [profiel]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const editableData = {
        telefoon: formData.telefoon,
        beschrijving: formData.beschrijving,
        linkedin: formData.linkedin,
        skills: formData.skills,
        talen: formData.talen,
      };

      const result = await updateProfiel(editableData);
      
      if (result.success) {
        alert('Profiel succesvol bijgewerkt!');
      } else {
        throw new Error(result.error || 'Kon profiel niet updaten');
      }
    } catch (error) {
      console.error('Fout bij bijwerken profiel:', error);
      alert('Er ging iets mis bij het bijwerken van je profiel');
    }
  };

  if (loading) {
    return <div className="profiel-settings"><div className="loading">Profiel laden...</div></div>;
  }

  if (!gebruiker) {
    return <div className="profiel-settings"><div className="error">Je moet ingelogd zijn om je profiel te bewerken.</div></div>;
  }

  return (
    <div className="profiel-settings">
      <h2>Profiel Instellingen</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Persoonlijke gegevens */}
        <div className="form-section">
          <h3>Persoonlijke Informatie</h3>
          {["naam", "email", "studie"].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                id={field}
                type="text"
                value={formData[field]}
                readOnly
                disabled
                className="readonly-field"
              />
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="form-section">
          <h3>Contact Informatie</h3>
          <div className="form-group">
            <label htmlFor="telefoon">Telefoonnummer</label>
            <input
              type="tel"
              id="telefoon"
              value={formData.telefoon}
              onChange={(e) => handleInputChange("telefoon", e.target.value)}
              placeholder="Bijv. +32 123 456 789"
            />
          </div>
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="url"
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              placeholder="https://www.linkedin.com/in/jouwnaam"
            />
          </div>
        </div>

        {/* Vaardigheden */}
        <div className="form-section">
          <h3>Vaardigheden</h3>
          <div className="form-group">
            <label>Codeertalen</label>
            <CodeerTaalSelector
              selectedSkills={formData.codeertaal}
              onChange={(selected) => handleInputChange("codeertaal", selected)}
            />
          </div>
          <div className="form-group">
            <label>Talen</label>
            <TaalSelector
              selectedTalen={formData.talen}
              onChange={(selected) => handleInputChange("talen", selected)}
            />
          </div>
          <div className="form-group">
            <label>Hard Skills</label>
            <HardSkillsSelector
              selectedOpleiding={formData.hardSkills}
              onChange={(selected) => handleInputChange("hardSkills", selected)}
            />
          </div>
          <div className="form-group">
            <label>Soft Skills</label>
            <SoftSkillsSelector
              selectedErvaring={formData.softSkills}
              onChange={(selected) => handleInputChange("softSkills", selected)}
            />
          </div>
        </div>

        {/* Beschrijving */}
        <div className="form-section">
          <h3>Over Mij</h3>
          <div className="form-group">
            <label htmlFor="beschrijving">Beschrijving</label>
            <textarea
              id="beschrijving"
              rows="4"
              maxLength="1000"
              value={formData.beschrijving}
              onChange={(e) => handleInputChange("beschrijving", e.target.value)}
              placeholder="Vertel iets over jezelf..."
            />
            <small className="char-count">
              {formData.beschrijving.length}/1000 karakters
            </small>
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={isSubmitting}>
            {isSubmitting ? "Opslaan..." : "Opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfielSettingsModule;
