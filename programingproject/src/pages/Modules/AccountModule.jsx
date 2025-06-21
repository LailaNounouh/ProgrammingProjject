import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../context/ProfileContext";
import Studierichtingen from "../../components/dropdowns/Studierichtingen";
import CodeerTaalSelector from "../../components/dropdowns/CodeerTaalSelector";
import TaalSelector from "../../components/dropdowns/TaalSelector";
import HardSkillsSelector from "../../components/dropdowns/HardSkillsSelector";
import SoftSkillsSelector from "../../components/dropdowns/SoftSkillsSelector";
import { FaEdit, FaEye, FaSave, FaTimes } from "react-icons/fa";
import "./AccountModule.css";

const AccountModule = () => {
  const { gebruiker } = useAuth();
  const { profiel, fetchProfiel, updateProfiel, loading } = useProfile();
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    naam: "",
    voornaam: "",
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
        voornaam: profiel.voornaam || "",
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
    setIsSubmitting(true);
    setSuccess(false);
    try {
      const editableData = {
        naam: formData.naam,
        voornaam: formData.voornaam,
        email: gebruiker?.email || "",
        telefoon: formData.telefoon,
        beschrijving: formData.beschrijving,
        linkedin: formData.linkedin,
        codeertaal: formData.codeertaal,
        talen: formData.talen,
        hardSkills: formData.hardSkills,
        softSkills: formData.softSkills,
        studie: formData.studie
      };

      const result = await updateProfiel(editableData);
      if (result.success) {
        setSuccess(true);
        // Schakelen naar kijkmodus na succesvol opslaan
        setTimeout(() => {
          setEditMode(false);
          setSuccess(false);
        }, 1500);
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

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSuccess(false);
  };

  const cancelEdit = () => {
    // Reset formData naar huidige profiel data
    if (profiel) {
      setFormData({
        naam: profiel.naam || "",
        voornaam: profiel.voornaam || "",
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
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="account-container">
        <div className="loading">Profiel laden...</div>
      </div>
    );
  }

  if (!gebruiker) {
    return (
      <div className="account-container">
        <div className="error">
          Je moet ingelogd zijn om je profiel te bekijken.
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h2 className="module-title">Mijn Account</h2>
        <button 
          onClick={toggleEditMode} 
          className={`toggle-mode-btn ${editMode ? 'viewing' : 'editing'}`}
        >
          {editMode ? (
            <>
              <FaEye /> Bekijken
            </>
          ) : (
            <>
              <FaEdit /> Bewerken
            </>
          )}
        </button>
      </div>

      {editMode ? (
        // Bewerk modus (formulier)
        <form onSubmit={handleSubmit} className="account-form">
          <section className="account-section">
            <h3>Persoonlijke Informatie</h3>

            <div className="form-group">
              <label htmlFor="voornaam">Voornaam</label>
              <input
                id="voornaam"
                type="text"
                value={formData.voornaam}
                onChange={(e) => handleInputChange("voornaam", e.target.value)}
              />
            </div>

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

          <section className="account-section">
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

          <section className="account-section">
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

          <section className="account-section">
            <h3>Over Mij</h3>
            <div className="form-group">
              <label htmlFor="beschrijving">Beschrijving</label>
              <textarea
                id="beschrijving"
                rows="4"
                maxLength="1000"
                value={formData.beschrijving}
                onChange={(e) =>
                  handleInputChange("beschrijving", e.target.value)
                }
                placeholder="Vertel iets over jezelf..."
              />
              <small className="char-count">
                {formData.beschrijving.length}/1000 karakters
              </small>
            </div>
          </section>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={cancelEdit}
            >
              <FaTimes /> Annuleren
            </button>
            <button
              type="submit"
              className={`save-button${success ? " success" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Opslaan..."
              ) : success ? (
                "Opgeslagen!"
              ) : (
                <>
                  <FaSave /> Opslaan
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        // Bekijk modus (profiel overzicht)
        <div className="account-details">
          <section className="account-section">
            <h3>Persoonlijke Informatie</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Voornaam</label>
                <p>{formData.voornaam || "Niet ingevuld"}</p>
              </div>
              <div className="info-item">
                <label>Naam</label>
                <p>{formData.naam || "Niet ingevuld"}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{formData.email || "Niet ingevuld"}</p>
              </div>
              <div className="info-item">
                <label>Studie</label>
                <p>{formData.studie || "Niet ingevuld"}</p>
              </div>
            </div>
          </section>

          <section className="account-section">
            <h3>Contact Informatie</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Telefoonnummer</label>
                <p>{formData.telefoon || "Niet ingevuld"}</p>
              </div>
              <div className="info-item">
                <label>LinkedIn</label>
                <p>
                  {formData.linkedin ? (
                    <a href={formData.linkedin} target="_blank" rel="noopener noreferrer">
                      {formData.linkedin}
                    </a>
                  ) : (
                    "Niet ingevuld"
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className="account-section">
            <h3>Over Mij</h3>
            <div className="info-item beschrijving">
              <p>{formData.beschrijving || "Geen beschrijving toegevoegd."}</p>
            </div>
          </section>

          <section className="account-section">
            <h3>Vaardigheden</h3>
            <div className="skills-container">
              {formData.codeertaal && formData.codeertaal.length > 0 && (
                <div className="skills-section">
                  <h4>Codeertalen</h4>
                  <div className="tags">
                    {formData.codeertaal.map((taal, index) => (
                      <span key={index} className="tag codeertaal-tag">
                        {taal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.talen && formData.talen.length > 0 && (
                <div className="skills-section">
                  <h4>Talen</h4>
                  <div className="tags">
                    {formData.talen.map((taal, index) => (
                      <span key={index} className="tag taal-tag">
                        {taal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.hardSkills && formData.hardSkills.length > 0 && (
                <div className="skills-section">
                  <h4>Hard Skills</h4>
                  <div className="tags">
                    {formData.hardSkills.map((skill, index) => (
                      <span key={index} className="tag hardskill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.softSkills && formData.softSkills.length > 0 && (
                <div className="skills-section">
                  <h4>Soft Skills</h4>
                  <div className="tags">
                    {formData.softSkills.map((skill, index) => (
                      <span key={index} className="tag softskill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(!formData.codeertaal || formData.codeertaal.length === 0) &&
                (!formData.talen || formData.talen.length === 0) &&
                (!formData.hardSkills || formData.hardSkills.length === 0) &&
                (!formData.softSkills || formData.softSkills.length === 0) && (
                  <p className="no-skills">
                    Geen vaardigheden toegevoegd. Klik op 'Bewerken' om vaardigheden toe te voegen.
                  </p>
                )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AccountModule;