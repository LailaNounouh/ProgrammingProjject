import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

export default function AccountModule() {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    student_id: null,
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
  const [fotoPreview, setFotoPreview] = useState(null);
  
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
    haalStudentOp();
  }, []);

  const haalStudentOp = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/studenten/profiel`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if(response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error(`Server gaf foutcode ${response.status}`);
      }
      
      const student = await response.json();
      
      setUserData({
        student_id: student.student_id,
        email: student.email || "",
        naam: student.naam || "",
        studie: student.studie || "",
        foto_url: student.foto_url ? `${process.env.REACT_APP_API_URL}/${student.foto_url}` : null,
        linkedin_url: student.linkedin_url || "",
        github_url: student.github_url || "",
        jobstudent: student.jobstudent === 1 || student.jobstudent === true,
        werkzoekend: student.werkzoekend === 1 || student.werkzoekend === true,
        stage_gewenst: student.stage_gewenst === 1 || student.stage_gewenst === true,
        telefoon: student.telefoon || "",
        aboutMe: student.aboutMe || "",
      });
      
    } catch (error) {
      console.error("Fout bij ophalen student:", error);
      setErrorMessage("Er was een probleem bij het ophalen van je profiel. Probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  };

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
    
    const fileURL = URL.createObjectURL(file);
    setFotoPreview(fileURL);
    
    setUserData({
      ...userData,
      foto_url: file
    });
    
    setErrorMessage("");
  };

  const opslaanWijzigingen = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      const token = localStorage.getItem('token');
      const studentData = {
        naam: userData.naam,
        email: userData.email,
        studie: userData.studie,
        telefoon: userData.telefoon,
        linkedin_url: userData.linkedin_url,
        github_url: userData.github_url,
        aboutMe: userData.aboutMe,
        jobstudent: userData.jobstudent,
        werkzoekend: userData.werkzoekend,
        stage_gewenst: userData.stage_gewenst
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/studenten/profiel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        if(response.status === 401) {
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `Server gaf foutcode ${response.status}`);
      }
      
      if (userData.foto_url instanceof File) {
        const fotoData = new FormData();
        fotoData.append('profielfoto', userData.foto_url);
        
        const fotoResponse = await fetch(`${process.env.REACT_APP_API_URL}/studenten/profiel/foto`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: fotoData
        });
        
        if (!fotoResponse.ok) {
          console.error('Fout bij uploaden foto', await fotoResponse.json());
          setSuccessMessage("Profiel opgeslagen, maar er was een probleem met het uploaden van de foto.");
          setEditMode(false);
          setFotoPreview(null);
          haalStudentOp();
          return;
        }
      }
      
      setSuccessMessage("Je profiel is succesvol opgeslagen!");
      setEditMode(false);
      setFotoPreview(null);
      
      haalStudentOp();
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (error) {
      console.error("Fout bij opslaan profiel:", error);
      setErrorMessage(`Er was een probleem bij het opslaan van je profiel: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setErrorMessage("");
    setFotoPreview(null);
    haalStudentOp();
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
        {errorMessage && errorMessage.includes("niet gevonden") && (
          <div className="error-badge">
            <FaExclamationTriangle /> Profiel niet compleet
          </div>
        )}
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
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="naam">Naam</label>
                <input
                  type="text"
                  id="naam"
                  name="naam"
                  value={userData.naam}
                  onChange={handleInputChange}
                  required
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
                  {(fotoPreview || (userData.foto_url && typeof userData.foto_url === 'string')) && (
                    <div className="profielfoto-preview">
                      <img 
                        src={fotoPreview || userData.foto_url} 
                        alt="Profielfoto preview" 
                      />
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
          </div>
        )}
      </div>
    </div>
  );
}