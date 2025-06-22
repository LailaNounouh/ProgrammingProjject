import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../context/ProfileContext";
import "./AccountModule.css";
import { FaEdit, FaEye, FaSave, FaTimes } from "react-icons/fa";
import SoftSkillsSelector from "../../components/dropdowns/SoftSkillsSelector";
import HardSkillsSelector from "../../components/dropdowns/HardSkillsSelector";
import CodeerTaalSelector from "../../components/dropdowns/CodeerTaalSelector";
import TaalSelector from "../../components/dropdowns/TaalSelector";
import axios from "axios";
import { baseUrl as API_URL } from "../../config";

export default function AccountModule() {
  const navigate = useNavigate();
  const { gebruiker } = useAuth();
  const { updateProfiel: contextUpdateProfiel, profiel, fetchProfiel } = useProfile();
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
  
  // Initialiseer met lege arrays om undefined errors te voorkomen
  const [softskills, setSoftskills] = useState([]);
  const [hardskills, setHardskills] = useState([]);
  const [codeertalen, setCodeertalen] = useState([]);
  const [talen, setTalen] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("persoonlijk"); // Nieuwe state voor tabs

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
        if (!gebruiker) {
          navigate('/login');
          return;
        }
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

  useEffect(() => {
    if (profiel) {
      console.log("Profiel geladen in AccountModule:", profiel);
      console.log("Softskills in profiel:", profiel.softskills);
      console.log("Hardskills in profiel:", profiel.hardskills);
      
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
      
      // Controleer of de skills arrays zijn en gebruik lege arrays als fallback
      if (Array.isArray(profiel.softskills)) {
        console.log("Setting softskills from profile:", profiel.softskills);
        setSoftskills(profiel.softskills);
      } else if (typeof profiel.softskills === 'string') {
        try {
          const parsedSkills = JSON.parse(profiel.softskills || '[]');
          console.log("Parsed softskills from string:", parsedSkills);
          setSoftskills(parsedSkills);
        } catch (e) {
          console.error("Error parsing softskills string:", e);
          setSoftskills([]);
        }
      } else {
        console.warn("Softskills is geen array of string:", profiel.softskills);
        setSoftskills([]);
      }
      
      if (Array.isArray(profiel.hardskills)) {
        console.log("Setting hardskills from profile:", profiel.hardskills);
        setHardskills(profiel.hardskills);
      } else if (typeof profiel.hardskills === 'string') {
        try {
          const parsedSkills = JSON.parse(profiel.hardskills || '[]');
          console.log("Parsed hardskills from string:", parsedSkills);
          setHardskills(parsedSkills);
        } catch (e) {
          console.error("Error parsing hardskills string:", e);
          setHardskills([]);
        }
      } else {
        console.warn("Hardskills is geen array of string:", profiel.hardskills);
        setHardskills([]);
      }
      
      // Laad codeertalen
      if (Array.isArray(profiel.codeertaal)) {
        setCodeertalen(profiel.codeertaal);
      } else if (typeof profiel.codeertaal === 'string') {
        try {
          const parsedTalen = JSON.parse(profiel.codeertaal || '[]');
          setCodeertalen(parsedTalen);
        } catch (e) {
          console.error("Error parsing codeertaal string:", e);
          setCodeertalen([]);
        }
      } else {
        setCodeertalen([]);
      }
      
      // Laad talen
      if (Array.isArray(profiel.talen)) {
        setTalen(profiel.talen);
      } else if (typeof profiel.talen === 'string') {
        try {
          const parsedTalen = JSON.parse(profiel.talen || '[]');
          setTalen(parsedTalen);
        } catch (e) {
          console.error("Error parsing talen string:", e);
          setTalen([]);
        }
      } else {
        setTalen([]);
      }
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
    if (saving) return;
    
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("Begin opslaan wijzigingen");
      console.log("Huidige softskills:", softskills);
      console.log("Huidige hardskills:", hardskills);
      console.log("Huidige codeertalen:", codeertalen);
      console.log("Huidige talen:", talen);
      
      // Maak een kopie van userData om mee te werken
      let profielData = { ...userData };
      
      // Voeg de skills toe aan de profielData
      profielData.softskills = Array.isArray(softskills) ? softskills : [];
      profielData.hardskills = Array.isArray(hardskills) ? hardskills : [];
      profielData.codeertaal = Array.isArray(codeertalen) ? codeertalen : [];
      profielData.talen = Array.isArray(talen) ? talen : [];
      
      if (userData.foto_url && typeof userData.foto_url !== "string") {
        console.log("Uploaden met foto");
        const formData = new FormData();
        formData.append("naam", userData.naam || "");
        formData.append("email", userData.email || "");
        formData.append("telefoon", userData.telefoon || "");
        formData.append("aboutMe", userData.aboutMe || "");
        formData.append("github", userData.github_url || "");
        formData.append("linkedin", userData.linkedin_url || "");
        formData.append("studie", userData.studie || "");
        formData.append("profilePicture", userData.foto_url);
        formData.append("jobstudent", userData.jobstudent);
        formData.append("werkzoekend", userData.werkzoekend);
        formData.append("stage_gewenst", userData.stage_gewenst);
        
        // Voeg de skills toe als JSON strings
        formData.append("softskills", JSON.stringify(softskills));
        formData.append("hardskills", JSON.stringify(hardskills));
        formData.append("codeertaal", JSON.stringify(codeertalen));
        formData.append("talen", JSON.stringify(talen));
        
        // Debug log van alle formdata
        for (let [key, val] of formData.entries()) {
          if (val instanceof File) {
            console.log(`FormData: ${key}: [file] ${val.name}`);
          } else {
            console.log(`FormData: ${key}:`, val);
          }
        }
        
        const result = await contextUpdateProfiel(formData, true);
        if (!result.success) {
          throw new Error(result.error || "Fout bij opslaan profiel");
        }
      } else {
        console.log("Uploaden zonder foto");
        // Zorg ervoor dat de skills als arrays worden verzonden
        profielData.softskills = Array.isArray(softskills) ? softskills : [];
        profielData.hardskills = Array.isArray(hardskills) ? hardskills : [];
        profielData.codeertaal = Array.isArray(codeertalen) ? codeertalen : [];
        profielData.talen = Array.isArray(talen) ? talen : [];
        
        console.log("📤 JSON profielData wordt verzonden:", profielData);
        const result = await contextUpdateProfiel(profielData, false);
        if (!result.success) {
          throw new Error(result.error || "Fout bij opslaan profiel");
        }
      }

      console.log("Profiel succesvol opgeslagen");
      setSuccessMessage("Profiel succesvol opgeslagen!");
      setEditMode(false);
      
      // Direct het profiel opnieuw ophalen
      await fetchProfiel();
    } catch (err) {
      console.error("Fout bij opslaan:", err);
      setErrorMessage("Fout bij opslaan profiel: " + (err.message || "Onbekende fout"));
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
        <h2>Mijn Account</h2>
        {!editMode && (
          <button className="edit-btn" onClick={() => setEditMode(true)}>
            <FaEdit /> Bewerken
          </button>
        )}
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="account-sections">
        {editMode ? (
          <div className="persoonlijke-info">
            {/* Tabs voor bewerkmodus */}
            <div className="account-tabs">
              <button 
                className={`tab-button ${activeTab === 'persoonlijk' ? 'active' : ''}`}
                onClick={() => setActiveTab('persoonlijk')}
              >
                Persoonlijke Info
              </button>
              <button 
                className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                Vaardigheden
              </button>
              <button 
                className={`tab-button ${activeTab === 'talen' ? 'active' : ''}`}
                onClick={() => setActiveTab('talen')}
              >
                Talen
              </button>
              <button 
                className={`tab-button ${activeTab === 'voorkeuren' ? 'active' : ''}`}
                onClick={() => setActiveTab('voorkeuren')}
              >
                Voorkeuren
              </button>
            </div>
            
            <form onSubmit={opslaanWijzigingen}>
              {/* Persoonlijke informatie tab */}
              {activeTab === 'persoonlijk' && (
                <div className="tab-content">
                  <h3>Persoonlijke Informatie</h3>
                  
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
                </div>
              )}
              
              {/* Vaardigheden tab */}
              {activeTab === 'skills' && (
                <div className="tab-content">
                  <h3>Vaardigheden</h3>
                  <div className="skills-container">
                    <SoftSkillsSelector value={softskills} onChange={setSoftskills} readOnly={false} />
                    <HardSkillsSelector value={hardskills} onChange={setHardskills} readOnly={false} />
                  </div>
                </div>
              )}
              
              {/* Talen tab */}
              {activeTab === 'talen' && (
                <div className="tab-content">
                  <h3>Talen & Programmeren</h3>
                  <div className="skills-container">
                    <CodeerTaalSelector value={codeertalen} onChange={setCodeertalen} readOnly={false} />
                    <TaalSelector value={talen} onChange={setTalen} readOnly={false} />
                  </div>
                </div>
              )}
              
              {/* Voorkeuren tab */}
              {activeTab === 'voorkeuren' && (
                <div className="tab-content">
                  <h3>Voorkeuren</h3>
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
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={cancelEdit}>
                  <FaTimes /> Annuleren
                </button>
                <button type="submit" className="opslaan-btn" disabled={saving}>
                  {saving ? "Opslaan..." : <><FaSave /> Wijzigingen opslaan</>}
                </button>
              </div>
            </form>
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
              <h3>Over Mij</h3>
              <p>{userData.aboutMe || "Geen beschrijving toegevoegd"}</p>
            </section>
            
            <section className="account-section">
              <h3>Sociale Media</h3>
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
              <h3>Voorkeuren</h3>
              <div className="voorkeuren-lijst">
                <div className="voorkeur-item">
                  <span className="voorkeur-label">Studentenjob:</span>
                  <span className={`voorkeur-status ${userData.jobstudent ? 'actief' : 'inactief'}`}>
                    {userData.jobstudent ? 'Ja' : 'Nee'}
                  </span>
                </div>
                <div className="voorkeur-item">
                  <span className="voorkeur-label">Werkzoekend:</span>
                  <span className={`voorkeur-status ${userData.werkzoekend ? 'actief' : 'inactief'}`}>
                    {userData.werkzoekend ? 'Ja' : 'Nee'}
                  </span>
                </div>
                <div className="voorkeur-item">
                  <span className="voorkeur-label">Stageplaats:</span>
                  <span className={`voorkeur-status ${userData.stage_gewenst ? 'actief' : 'inactief'}`}>
                    {userData.stage_gewenst ? 'Ja' : 'Nee'}
                  </span>
                </div>
              </div>
            </section>
            
            <section className="account-section">
              <h3>Vaardigheden</h3>
              <div className="skills-overview">
                <div className="skills-container">
                  <h4>Soft Skills</h4>
                  {Array.isArray(softskills) && softskills.length > 0 ? (
                    <ul className="skills-list">
                      {softskills.map((skill, index) => (
                        <li key={`soft-${index}`} className="skill-tag">{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Geen soft skills toegevoegd</p>
                  )}
                </div>
                
                <div className="skills-container">
                  <h4>Hard Skills</h4>
                  {Array.isArray(hardskills) && hardskills.length > 0 ? (
                    <ul className="skills-list">
                      {hardskills.map((skill, index) => (
                        <li key={`hard-${index}`} className="skill-tag">{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Geen hard skills toegevoegd</p>
                  )}
                </div>
              </div>
            </section>
            
            <section className="account-section">
              <h3>Talen & Programmeren</h3>
              <div className="skills-overview">
                <div className="skills-container">
                  <h4>Programmeertalen</h4>
                  {Array.isArray(codeertalen) && codeertalen.length > 0 ? (
                    <ul className="skills-list">
                      {codeertalen.map((taal, index) => (
                        <li key={`code-${index}`} className="skill-tag">{taal}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Geen programmeertalen toegevoegd</p>
                  )}
                </div>
                
                <div className="skills-container">
                  <h4>Talen</h4>
                  {Array.isArray(talen) && talen.length > 0 ? (
                    <ul className="skills-list">
                      {talen.map((taal, index) => (
                        <li key={`taal-${index}`} className="skill-tag">{taal}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Geen talen toegevoegd</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
