// /src/pages/Modules/ProfielSettingsModule.jsx

import React, { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthProvider";
import Studierichtingen from "../../components/dropdowns/Studierichtingen";
import CodeerTaalSelector from "../../components/dropdowns/CodeerTaalSelector";
import TaalSelector from "../../components/dropdowns/TaalSelector";
import HardSkillsSelector from "../../components/dropdowns/HardSkillsSelector";
import SoftSkillsSelector from "../../components/dropdowns/SoftSkillsSelector";
import "./ProfielSettingsModule.css";

const ProfielSettingsModule = () => {
  const { gebruiker } = useAuth();
  const { profiel, fetchProfiel, updateProfiel, loading } = useProfile();

  const [formData, setFormData] = useState({
    naam: "",
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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (gebruiker?.id) {
      fetchProfiel();
    }
  }, [gebruiker]);

  useEffect(() => {
    if (profiel) {
      setFormData({
        naam: profiel.naam || "",
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
    setIsSubmitting(true);
    setSuccess(false);
    try {
      const editableData = {
        telefoon: formData.telefoon,
        beschrijving: formData.beschrijving,
        linkedin: formData.linkedin,
        codeertaal: formData.codeertaal,
        talen: formData.talen,
        hardSkills: formData.hardSkills,
        softSkills: formData.softSkills,
      };

      const result = await updateProfiel(editableData);
      if (result.success) {
        setSuccess(true);
      } else {
        throw new Error(result.error || "Kon profiel niet updaten");
      }
    } catch (error) {
      console.error("Fout bij bijwerken profiel:", error);
      alert("Er ging iets mis bij het bijwerken van je profiel");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="profiel-settings">
        <div className="loading">Profiel laden...</div>
      </div>
    );
  }

  if (!gebruiker) {
    return (
      <div className="profiel-settings">
        <div className="error">
          Je moet ingelogd zijn om je profiel te bewerken.
        </div>
      </div>
    );
  }

  return (
    <div className="profiel-settings">
      <h2 className="module-title">Profiel Instellingen</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <section className="form-section">
          <h3>Persoonlijke Informatie</h3>

          <div className="form-group">
            <label htmlFor="naam">Naam</label>
            <input
              id="naam"
              type="text"
              value={formData.naam}
              onChange={(e) => handleInputChange("naam", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={gebruiker?.email || ""}
              readOnly
              className="readonly-field"
            />
          </div>

          <div className="form-group">
  <label htmlFor="studie">Studierichting</label>
  <Studierichtingen
    selectedStudie={formData.studie}
    onChange={(selected) => handleInputChange("studie", selected)}
  />
</div>
        </section>

        <section className="form-section">
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
        </section>

        <section className="form-section">
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
        </section>

        <section className="form-section">
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
        </section>

        <div className="form-actions">
          <button
            type="submit"
            className={`save-button${success ? " success" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Opslaan..."
              : success
              ? "Opgeslagen"
              : "Opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfielSettingsModule;