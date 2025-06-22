import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../context/ProfileContext";
import "./AccountModule.css";
import { FaEdit, FaEye, FaSave, FaTimes, FaLinkedin, FaGithub } from "react-icons/fa";
import SoftSkillsSelector from "../../components/dropdowns/SoftSkillsSelector";
import HardSkillsSelector from "../../components/dropdowns/HardSkillsSelector";
import CodeerTaalSelector from "../../components/dropdowns/CodeerTaalSelector";
import TaalSelector from "../../components/dropdowns/TaalSelector";
import axios from "axios";
import { baseUrl as API_URL } from "../../config";

export default function AccountModule() {
  const navigate = useNavigate();
  const { gebruiker } = useAuth();
  const { fetchProfiel, profiel } = useProfile();
  const [userData, setUserData] = useState({
    email: "",
    naam: "",
    voornaam: "",
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
  const [voorkeuren, setVoorkeuren] = useState({
    stage: false,
    job: false,
    bachelorproef: false,
    studentenjob: false
  });
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: ''
  });
  // State voor nieuwe taal
  const [nieuweTaal, setNieuweTaal] = useState({name: "", ervaring: ""});

  const studieOpties = [
    "Bachelor Toegepaste Informatica",
    "Bachelor Multimedia & Creative Technologies",
    "Graduaat Programmeren",
    "Graduaat Systeem- & Netwerkbeheer",
    "Graduaat Internet of Things",
    "Graduaat Elektromechanische Systemen"
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
      console.log("AccountModule - Profiel data ontvangen:", profiel);
      
      // Zet de profiel data in de state
      setUserData({
        userId: profiel.userId,
        naam: profiel.naam || "",
        voornaam: profiel.voornaam || "",
        email: profiel.email || "",
        telefoon: profiel.telefoon || "",
        aboutMe: profiel.aboutMe || profiel.beschrijving || "",
        github_url: profiel.github || "",
        linkedin_url: profiel.linkedin || "",
        studie: profiel.studie || "",
        foto_url: profiel.foto_url || null,
        jobstudent: profiel.jobstudent || false,
        werkzoekend: profiel.werkzoekend || false,
        stage_gewenst: profiel.stage_gewenst || false,
      });
      
      // Verwerk softskills
      if (Array.isArray(profiel.softskills)) {
        setSoftskills(profiel.softskills);
      } else if (typeof profiel.softskills === 'string') {
        try {
          setSoftskills(JSON.parse(profiel.softskills));
        } catch (e) {
          setSoftskills([]);
        }
      } else {
        setSoftskills([]);
      }
      
      // Verwerk hardskills
      if (Array.isArray(profiel.hardskills)) {
        setHardskills(profiel.hardskills);
      } else if (typeof profiel.hardskills === 'string') {
        try {
          setHardskills(JSON.parse(profiel.hardskills));
        } catch (e) {
          setHardskills([]);
        }
      } else {
        setHardskills([]);
      }
      
      // Verwerk programmeertalen
      console.log("AccountModule - Controleren van programmeertalen in profiel:", profiel);
      
      // Controleer alle mogelijke veldnamen voor programmeertalen
      if (Array.isArray(profiel.codeertalen) && profiel.codeertalen.length > 0) {
        console.log("AccountModule - Codeertalen uit profiel (array):", profiel.codeertalen);
        setCodeertalen(profiel.codeertalen);
      } else if (Array.isArray(profiel.programmeertalen) && profiel.programmeertalen.length > 0) {
        console.log("AccountModule - Programmeertalen uit profiel (array):", profiel.programmeertalen);
        setCodeertalen(profiel.programmeertalen);
      } else if (typeof profiel.programmeertalen === 'string' && profiel.programmeertalen) {
        try {
          const parsedTalen = JSON.parse(profiel.programmeertalen);
          console.log("AccountModule - Programmeertalen geparsed uit string:", parsedTalen);
          setCodeertalen(Array.isArray(parsedTalen) ? parsedTalen : []);
        } catch (e) {
          console.error("AccountModule - Fout bij parsen programmeertalen:", e);
          setCodeertalen([]);
        }
      } else {
        console.log("AccountModule - Geen programmeertalen gevonden in profiel");
        setCodeertalen([]);
      }
      
      // Verwerk talen
      if (Array.isArray(profiel.talen)) {
        console.log("AccountModule - Talen uit profiel (array):", profiel.talen);
        setTalen(profiel.talen);
      } else if (typeof profiel.talen === 'string') {
        try {
          const parsedTalen = JSON.parse(profiel.talen);
          console.log("AccountModule - Talen geparsed uit string:", parsedTalen);
          setTalen(parsedTalen);
        } catch (e) {
          console.error("AccountModule - Fout bij parsen talen:", e);
          setTalen([]);
        }
      } else {
        setTalen([]);
      }
    }
  }, [profiel]);

  useEffect(() => {
    if (profiel) {
      setSocialLinks({
        linkedin: profiel.linkedin_url || '',
        github: profiel.github_url || ''
      });
    }
  }, [profiel]);

  // Zorg ervoor dat de voorkeuren correct worden ingesteld vanuit het profiel
  useEffect(() => {
    if (profiel) {
      console.log("AccountModule - Voorkeuren uit profiel:", {
        stage: profiel.stage_gewenst,
        job: profiel.werkzoekend,
        bachelorproef: profiel.bachelorproef_gewenst,
        studentenjob: profiel.jobstudent
      });
      
      setVoorkeuren({
        stage: profiel.stage_gewenst || false,
        job: profiel.werkzoekend || false,
        bachelorproef: profiel.bachelorproef_gewenst || false,
        studentenjob: profiel.jobstudent || false
      });
    }
  }, [profiel]);

  // Zorg ervoor dat de social links correct worden ingesteld vanuit het profiel
  useEffect(() => {
    if (profiel) {
      console.log("AccountModule - Social links uit profiel:", {
        github: profiel.github_url || profiel.github || '',
      });
      
      setSocialLinks({
        ...socialLinks,
        github: profiel.github_url || profiel.github || ''
      });
    }
  }, [profiel]);

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

  const handleVoorkeurChange = (e) => {
    const { name, checked } = e.target;
    setVoorkeuren({
      ...voorkeuren,
      [name]: checked
    });
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    console.log(`Social link changed: ${name} = ${value}`);
    setSocialLinks({
      ...socialLinks,
      [name]: value
    });
  };

  // Zorg ervoor dat de data correct wordt opgeslagen
  const opslaanWijzigingen = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("AccountModule - Formulier verzonden");
      
      // Log de huidige staat van codeertalen
      console.log("AccountModule - Huidige codeertalen:", codeertalen);
      
      // Maak een kopie van userData om mee te werken
      const profielData = {
        ...userData,
        github: socialLinks.github,
        
        // Voeg alle skills en talen toe om te behouden
        softskills: softskills,
        hardskills: hardskills,
        // Gebruik zowel programmeertalen als codeertalen om compatibiliteit te garanderen
        programmeertalen: codeertalen,
        codeertalen: codeertalen,
        talen: talen,
        
        // Voeg voorkeuren toe
        stage_gewenst: voorkeuren.stage,
        werkzoekend: voorkeuren.job,
        bachelorproef_gewenst: voorkeuren.bachelorproef,
        jobstudent: voorkeuren.studentenjob
      };
      
      console.log("AccountModule - Data die wordt verzonden:", profielData);
      console.log("AccountModule - Programmeertalen die worden verzonden:", profielData.programmeertalen);
      
      // Stuur de data naar de server
      const response = await axios.put(`${API_URL}/profiel/${userData.email}`, profielData);
      
      if (response.status === 200) {
        console.log("AccountModule - Profiel succesvol bijgewerkt");
        setSuccessMessage("Profiel succesvol bijgewerkt");
        
        // Werk het profiel bij in de context
        await fetchProfiel();
      } else {
        console.error("AccountModule - Fout bij bijwerken profiel:", response.data);
        setErrorMessage("Fout bij bijwerken profiel: " + (response.data.error || "Onbekende fout"));
      }
    } catch (error) {
      console.error("AccountModule - Fout bij verzenden formulier:", error);
      setErrorMessage("Fout bij verzenden formulier: " + (error.response?.data?.error || error.message || "Onbekende fout"));
    } finally {
      setSaving(false);
    }
  };

  // Functie om alleen programmeertalen bij te werken
  const updateProgrammeertalen = async () => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("AccountModule - Programmeertalen bijwerken");
      console.log("AccountModule - Huidige codeertalen:", codeertalen);
      
      // Stuur alleen de programmeertalen naar de server
      const response = await axios.post(`${API_URL}/profiel/update-programmeertalen/${userData.email}`, {
        programmeertalen: codeertalen
      });
      
      if (response.status === 200) {
        console.log("AccountModule - Programmeertalen succesvol bijgewerkt");
        setSuccessMessage("Programmeertalen succesvol bijgewerkt");
        
        // Werk het profiel bij in de context
        await fetchProfiel();
      } else {
        console.error("AccountModule - Fout bij bijwerken programmeertalen:", response.data);
        setErrorMessage("Fout bij bijwerken programmeertalen: " + (response.data.error || "Onbekende fout"));
      }
    } catch (error) {
      console.error("AccountModule - Fout bij verzenden programmeertalen:", error);
      setErrorMessage("Fout bij verzenden programmeertalen: " + (error.response?.data?.error || error.message || "Onbekende fout"));
    } finally {
      setSaving(false);
    }
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
              <button 
                className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
                onClick={() => setActiveTab('social')}
              >
                Social Media
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
                  <div className="voorkeuren-container">
                    <div className="form-group">
                      <label>Ik ben beschikbaar voor:</label>
                      <div className="voorkeuren-opties">
                        <div className="voorkeur-optie">
                          <input
                            type="checkbox"
                            id="stage"
                            name="stage"
                            checked={voorkeuren.stage}
                            onChange={handleVoorkeurChange}
                          />
                          <label htmlFor="stage">Stage</label>
                        </div>
                        
                        <div className="voorkeur-optie">
                          <input
                            type="checkbox"
                            id="job"
                            name="job"
                            checked={voorkeuren.job}
                            onChange={handleVoorkeurChange}
                          />
                          <label htmlFor="job">Job</label>
                        </div>
                        
                        <div className="voorkeur-optie">
                          <input
                            type="checkbox"
                            id="bachelorproef"
                            name="bachelorproef"
                            checked={voorkeuren.bachelorproef}
                            onChange={handleVoorkeurChange}
                          />
                          <label htmlFor="bachelorproef">Bachelorproef</label>
                        </div>
                        
                        <div className="voorkeur-optie">
                          <input
                            type="checkbox"
                            id="studentenjob"
                            name="studentenjob"
                            checked={voorkeuren.studentenjob}
                            onChange={handleVoorkeurChange}
                          />
                          <label htmlFor="studentenjob">Studentenjob</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Social Media tab */}
              {activeTab === 'social' && (
                <div className="tab-content">
                  <h3>Social Media</h3>
                  <div className="form-group">
                    <label htmlFor="github">GitHub URL</label>
                    <input
                      type="url"
                      id="github"
                      name="github"
                      value={socialLinks.github}
                      onChange={handleSocialLinkChange}
                      placeholder="https://github.com/jouw-gebruikersnaam"
                    />
                  </div>
                </div>
              )}
              
              {/* Programmeertalen tab */}
              {activeTab === 'codeertalen' && (
                <div className="tab-content">
                  <h3>Programmeertalen</h3>
                  <div className="skills-container">
                    <CodeerTaalSelector value={codeertalen} onChange={setCodeertalen} readOnly={false} />
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="opslaan-btn" onClick={updateProgrammeertalen} disabled={saving}>
                      {saving ? "Opslaan..." : <><FaSave /> Programmeertalen opslaan</>}
                    </button>
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
              <h3>Social Media</h3>
              <div className="social-links-view">
                {socialLinks.github && (
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaGithub className="social-icon" />
                    <span>GitHub Profiel</span>
                  </a>
                )}
                
                {!socialLinks.github && (
                  <p>Geen GitHub profiel toegevoegd</p>
                )}
              </div>
            </section>
            
            <section className="account-section">
              <h3>Voorkeuren</h3>
              <div className="voorkeuren-lijst">
                {voorkeuren.stage && (
                  <div className="voorkeur-tag">Stage</div>
                )}
                {voorkeuren.job && (
                  <div className="voorkeur-tag">Job</div>
                )}
                {voorkeuren.bachelorproef && (
                  <div className="voorkeur-tag">Bachelorproef</div>
                )}
                {voorkeuren.studentenjob && (
                  <div className="voorkeur-tag">Studentenjob</div>
                )}
                {!voorkeuren.stage && !voorkeuren.job && !voorkeuren.bachelorproef && !voorkeuren.studentenjob && (
                  <p>Geen voorkeuren geselecteerd</p>
                )}
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
                      {codeertalen.map((item, index) => (
                        <li key={`code-${index}`} className="skill-tag">
                          {item.name || item.taal || "Onbekend"} ({item.ervaring || "beginner"})
                        </li>
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
                      {talen.map((item, index) => (
                        <li key={`taal-${index}`} className="skill-tag">
                          {item.name || item.taal || "Onbekend"} ({item.niveau || "basis"})
                        </li>
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
