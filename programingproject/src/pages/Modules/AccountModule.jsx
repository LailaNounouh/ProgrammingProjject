import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../context/ProfileContext";
import "./AccountModule.css";
import { FaEdit, FaEye, FaSave, FaTimes } from "react-icons/fa";

// Selectors importeren
import SoftSkillsSelector from "../../components/dropdowns/SoftSkillsSelector";
import HardSkillsSelector from "../../components/dropdowns/HardSkillsSelector";

export default function AccountModule() {
  const navigate = useNavigate();
  const { gebruiker } = useAuth();
  const { updateProfiel, profiel, fetchProfiel } = useProfile();
  const [userData, setUserData] = useState({
    email: "",
    naam: "",
    studie: "",
    foto_url: null,
    linkedin_url: "",
    github_url: "",
    jobstudent: false,
    werkzoekend: false,
    stage_gewenst: false,
    telefoon: "",
    aboutMe: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [softskills, setSoftskills] = useState([]);
  const [hardskills, setHardskills] = useState([]);
  
  const studieOpties = [
    "Informatica",
    "Toegepaste Informatica",
    "Graduaat Programmeren",
    "Toegepaste Informatica: AI",
    "Toegepaste Informatica: Applicatieontwikkeling",
    "Toegepaste Informatica: Systemen en Netwerken",
    "Andere"
  ];

  useEffect(() => {
    const haalGebruikerOp = async () => {
      try {
        setLoading(true);

        // Check if user is logged in via AuthProvider
        if (!gebruiker) {
          navigate('/login');
          return;
        }

        // Fetch profile data
        await fetchProfiel();

        setLoading(false);
      } catch (error) {
        setErrorMessage("Er is een probleem opgetreden bij het laden van je gegevens.");
        setLoading(false);
      }
    };

    if (gebruiker) {
      haalGebruikerOp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, gebruiker]);

  // Update userData when profiel changes
  useEffect(() => {
    if (profiel) {
      setUserData({
        email: profiel.email || gebruiker?.email || "",
        naam: profiel.naam || gebruiker?.naam || "",
        studie: profiel.studie || "",
        foto_url: profiel.foto_url || null,
        linkedin_url: profiel.linkedin || "",
        github_url: profiel.github || "",
        jobstudent: profiel.jobstudent || false,
        werkzoekend: profiel.werkzoekend || false,
        stage_gewenst: profiel.stage_gewenst || false,
        telefoon: profiel.telefoon || "",
        aboutMe: profiel.beschrijving || "",
        
      });
      setSoftskills(profiel.softskills || []);
      setHardskills(profiel.hardskills || []);
    } else if (gebruiker) {
      setUserData({
        email: gebruiker.email || "",
        naam: gebruiker.naam || "",
        studie: gebruiker.studie || "",
        foto_url: gebruiker.foto_url || null,
        linkedin_url: gebruiker.linkedin_url || "",
        github_url: gebruiker.github_url || "",
        jobstudent: gebruiker.jobstudent || false,
        werkzoekend: gebruiker.werkzoekend || false,
        stage_gewenst: gebruiker.stage_gewenst || false,
        telefoon: gebruiker.telefoon || "",
        aboutMe: gebruiker.aboutMe || "",
      });
      setSoftskills([]);
      setHardskills([]);
    }
  }, [profiel, gebruiker]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setErrorMessage("Profielfoto moet een afbeelding zijn (JPEG, PNG, etc.).");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Profielfoto mag niet groter zijn dan 5MB.");
      return;
    }
    
    setUserData({
      ...userData,
      foto_url: file
    });
    
    setErrorMessage("");
  };

  const opslaanWijzigingen = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      let profielData = {
        ...userData,
        softskills,
        hardskills,
      };

      // Check of er een bestand is
      if (userData.foto_url && typeof userData.foto_url !== "string") {
        // Gebruik FormData voor file upload
        const formData = new FormData();
        formData.append("naam", userData.naam);
        formData.append("email", userData.email);
        formData.append("telefoon", userData.telefoon);
        formData.append("aboutMe", userData.aboutMe);
        formData.append("github", userData.github_url);
        formData.append("linkedin", userData.linkedin_url);
        formData.append("studie", userData.studie);
        formData.append("softskills", JSON.stringify(softskills));
        formData.append("hardskills", JSON.stringify(hardskills));
        formData.append("profilePicture", userData.foto_url);

        await updateProfiel(formData, true); // true = multipart
      } else {
        // Gewoon JSON
        await updateProfiel(profielData, false);
      }

      setSuccessMessage("Profiel succesvol opgeslagen!");
      setEditMode(false);
      fetchProfiel();
    } catch (err) {
      setErrorMessage("Fout bij opslaan profiel.");
    }
    setSaving(false);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div className="page-container account-module">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Gegevens laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container account-module">
      <div className="account-header">
        <h2 className="module-title">Mijn Account</h2>
        <button 
          onClick={() => setEditMode(!editMode)} 
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
      
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="account-sections">
        {editMode ? (
          <div className="persoonlijke-info">
            <h3>Persoonlijke Informatie</h3>
            <form onSubmit={opslaanWijzigingen}>
              <div className="form-group">
                <label htmlFor="email">E-mailadres</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  readOnly
                  className="readonly-field"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="naam">Naam</label>
                <input
                  type="text"
                  id="naam"
                  name="naam"
                  value={userData.naam}
                  readOnly
                  className="readonly-field"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telefoon">Telefoonnummer</label>
                <input
                  type="tel"
                  id="telefoon"
                  name="telefoon"
                  value={userData.telefoon}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="studie">Opleiding</label>
                <select
                  id="studie"
                  name="studie"
                  value={userData.studie}
                  onChange={handleInputChange}
                >
                  <option value="">Selecteer opleiding</option>
                  {studieOpties.map(optie => (
                    <option key={optie} value={optie}>{optie}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="aboutMe">Over mij</label>
                <textarea
                  id="aboutMe"
                  name="aboutMe"
                  value={userData.aboutMe}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="linkedin_url">LinkedIn URL</label>
                <input
                  type="url"
                  id="linkedin_url"
                  name="linkedin_url"
                  value={userData.linkedin_url}
                  onChange={handleInputChange}
                  placeholder="https://www.linkedin.com/in/jouw-profiel"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="github_url">GitHub URL</label>
                <input
                  type="url"
                  id="github_url"
                  name="github_url"
                  value={userData.github_url}
                  onChange={handleInputChange}
                  placeholder="https://github.com/jouw-gebruikersnaam"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="foto">Profielfoto</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="foto"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {(userData.foto_url && typeof userData.foto_url === 'string') && (
                    <div className="profielfoto-preview">
                      <img src={userData.foto_url} alt="Profielfoto preview" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="checkboxen-groep">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="jobstudent"
                    name="jobstudent"
                    checked={userData.jobstudent}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="jobstudent">Ik zoek een studentenjob</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="werkzoekend"
                    name="werkzoekend"
                    checked={userData.werkzoekend}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="werkzoekend">Ik ben werkzoekend</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="stage_gewenst"
                    name="stage_gewenst"
                    checked={userData.stage_gewenst}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="stage_gewenst">Ik zoek een stageplaats</label>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={cancelEdit}>
                  <FaTimes /> Annuleren
                </button>
                <button type="submit" className="opslaan-btn" disabled={saving}>
                  {saving ? "Opslaan..." : <><FaSave /> Wijzigingen opslaan</>}
                </button>
              </div>
            </form>
            {/* Selectors tonen in edit mode */}
            <div className="skills-section">
              <SoftSkillsSelector value={softskills} onChange={setSoftskills} readOnly={!editMode} />
              <HardSkillsSelector value={hardskills} onChange={setHardskills} readOnly={!editMode} />
            </div>
          </div>
        ) : (
          <div className="account-details">
            <section className="account-section">
              <h3>Persoonlijke Informatie</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Email</label>
                  <p>{userData.email || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>Naam</label>
                  <p>{userData.naam || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>Telefoonnummer</label>
                  <p>{userData.telefoon || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>Opleiding</label>
                  <p>{userData.studie || "Niet ingevuld"}</p>
                </div>
              </div>
            </section>
            
            <section className="account-section">
              <h3>Profielfoto</h3>
              <div className="profile-photo-container">
                {userData.foto_url ? (
                  <img src={userData.foto_url} alt="Profielfoto" className="profile-photo" />
                ) : (
                  <div className="no-photo">Geen profielfoto geüpload</div>
                )}
              </div>
            </section>

            <section className="account-section">
              <h3>Contact & Links</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>LinkedIn</label>
                  <p>
                    {userData.linkedin_url ? (
                      <a href={userData.linkedin_url} target="_blank" rel="noopener noreferrer">
                        {userData.linkedin_url}
                      </a>
                    ) : (
                      "Niet ingevuld"
                    )}
                  </p>
                </div>
                <div className="info-item">
                  <label>GitHub</label>
                  <p>
                    {userData.github_url ? (
                      <a href={userData.github_url} target="_blank" rel="noopener noreferrer">
                        {userData.github_url}
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
                <p>{userData.aboutMe || "Geen beschrijving toegevoegd."}</p>
              </div>
            </section>

            <section className="account-section">
              <h3>Status</h3>
              <div className="status-indicators">
                {userData.jobstudent && <span className="status-tag jobstudent">Zoekt studentenjob</span>}
                {userData.werkzoekend && <span className="status-tag werkzoekend">Werkzoekend</span>}
                {userData.stage_gewenst && <span className="status-tag stage">Zoekt stageplaats</span>}
                {!userData.jobstudent && !userData.werkzoekend && !userData.stage_gewenst && 
                  <p>Geen status geselecteerd</p>
                }
              </div>
            </section>

            {/* Selectors tonen in view mode */}
            <section className="account-section">
              <h3>Vaardigheden & Talen</h3>
              <div className="skills-section">
                <SoftSkillsSelector value={softskills} onChange={setSoftskills} readOnly={!editMode} />
                <HardSkillsSelector value={hardskills} onChange={setHardskills} readOnly={!editMode} />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}