import React, { useState, useEffect } from 'react';
import { FaEdit, FaTimes, FaGithub, FaLinkedin } from 'react-icons/fa';
import './AccountModule.css';

const AccountModule = () => {
  const baseUrl = 'http://localhost:3000/api'; // Controleer of dit de juiste URL is
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Gebruiker email uit localStorage of sessie
  const [email, setEmail] = useState('');
  
  // Basisgegevens
  const [naam, setNaam] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [studie, setStudie] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');

  // Skills
  const [softskills, setSoftskills] = useState(['Communicatie', 'Teamwork']);
  const [hardskills, setHardskills] = useState(['Microsoft Office', 'Projectmanagement']);
  const [codeertalen, setCodeertalen] = useState([
    { taal: "JavaScript", ervaring: "Beginner" },
    { taal: "HTML/CSS", ervaring: "Gemiddeld" }
  ]);
  const [talen, setTalen] = useState([
    { taal: "Nederlands", niveau: "Moedertaal" },
    { taal: "Engels", niveau: "Goed" }
  ]);

  // Checkboxes
  const [jobstudent, setJobstudent] = useState(false);
  const [werkzoekend, setWerkzoekend] = useState(false);
  const [stageGewenst, setStageGewenst] = useState(false);

  // Debug component
  const DebugInfo = ({ title, data }) => {
    const [showDebug, setShowDebug] = useState(false);
    
    return (
      <div className="debug-container">
        <button 
          type="button" 
          onClick={() => setShowDebug(!showDebug)}
          className="debug-toggle"
        >
          {showDebug ? 'Verberg' : 'Toon'} {title} Debug Info
        </button>
        
        {showDebug && (
          <div className="debug-info">
            <strong>{title}:</strong>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  };

  // Haal gebruiker email op bij het laden van de component
  useEffect(() => {
    // Haal email op uit localStorage of sessie
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
      console.log("Email opgehaald uit storage:", userEmail);
    } else {
      setError("Geen e-mailadres gevonden. Log opnieuw in.");
      setLoading(false);
    }
  }, []);

  // Haal gebruikersgegevens op wanneer email beschikbaar is
  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        console.error("Geen email beschikbaar om gebruikersdata op te halen");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      console.log("Ophalen gebruikersdata voor email:", email);
      
      try {
        // Probeer eerst de gebruiker op te halen met email parameter
        const fullUrl = `${baseUrl}/profiel?email=${encodeURIComponent(email)}`;
        console.log("Volledige API URL:", fullUrl);
        
        const response = await fetch(fullUrl);
        console.log("API response status:", response.status);
        
        if (!response.ok) {
          console.warn(`Fout bij ophalen profielgegevens met email: ${response.status}`);
          
          // Als dat niet lukt, probeer dan met id parameter
          const idUrl = `${baseUrl}/profiel/${email}`;
          console.log("Probeer alternatieve URL:", idUrl);
          
          const idResponse = await fetch(idUrl);
          console.log("Alternatieve API response status:", idResponse.status);
          
          if (!idResponse.ok) {
            throw new Error(`Fout bij ophalen profielgegevens: ${idResponse.status}`);
          }
          
          const idResponseText = await idResponse.text();
          console.log("Ruwe response data van alternatieve URL:", idResponseText);
          
          if (!idResponseText || idResponseText.trim() === '') {
            throw new Error('Lege response van server');
          }
          
          try {
            const userData = JSON.parse(idResponseText);
            console.log("Geparseerde gebruikersdata van alternatieve URL:", userData);
            processUserData(userData);
          } catch (e) {
            console.error("Fout bij parsen JSON van alternatieve URL:", e);
            throw new Error('Ongeldige JSON response van server');
          }
          
          return;
        }
        
        const responseText = await response.text();
        console.log("Ruwe response data:", responseText);
        
        if (!responseText || responseText.trim() === '') {
          throw new Error('Lege response van server');
        }
        
        try {
          const userData = JSON.parse(responseText);
          console.log("Geparseerde gebruikersdata:", userData);
          processUserData(userData);
        } catch (e) {
          console.error("Fout bij parsen JSON:", e);
          throw new Error('Ongeldige JSON response van server');
        }
      } catch (error) {
        console.error("Fout bij ophalen gebruikersdata:", error);
        setError(`Er is een fout opgetreden bij het ophalen van je gegevens: ${error.message}`);
        
        // Gebruik standaardwaarden bij een fout
        setNaam('Gebruiker');
        // Behoud de bestaande standaardwaarden voor skills
      } finally {
        setLoading(false);
      }
    };
    
    // Helper functie om gebruikersdata te verwerken
    const processUserData = (userData) => {
      if (!userData) {
        console.error("Geen gebruikersdata ontvangen");
        return;
      }
      
      console.log("Verwerken van gebruikersdata:", userData);
      
      // Basisgegevens
      setNaam(userData.naam || '');
      setTelefoon(userData.telefoon || '');
      setAboutMe(userData.aboutMe || userData.about_me || '');
      setGithub(userData.github_url || userData.github || '');
      setLinkedin(userData.linkedin_url || userData.linkedin || '');
      setStudie(userData.studie || '');
      setFotoUrl(userData.foto_url || userData.profile_picture || '');
      
      // Verwerk arrays veilig
      setSoftskills(parseArrayData(userData.softskills, ['Communicatie', 'Teamwork']));
      setHardskills(parseArrayData(userData.hardskills, ['Microsoft Office', 'Projectmanagement']));
      
      // Probeer verschillende mogelijke veldnamen voor programmeertalen
      const programmeertalenData = 
        userData.programmeertalen || 
        userData.codeertalen || 
        userData.programming_languages;
      
      setCodeertalen(parseArrayData(programmeertalenData, [
        { taal: "JavaScript", ervaring: "Beginner" },
        { taal: "HTML/CSS", ervaring: "Gemiddeld" }
      ]));
      
      // Probeer verschillende mogelijke veldnamen voor talen
      const talenData = 
        userData.talen || 
        userData.languages;
      
      setTalen(parseArrayData(talenData, [
        { taal: "Nederlands", niveau: "Moedertaal" },
        { taal: "Engels", niveau: "Goed" }
      ]));
      
      // Verwerk boolean waarden
      setJobstudent(userData.jobstudent === 1 || userData.jobstudent === true);
      setWerkzoekend(userData.werkzoekend === 1 || userData.werkzoekend === true);
      setStageGewenst(
        userData.stage_gewenst === 1 || 
        userData.stage_gewenst === true || 
        userData.stageGewenst === true
      );
    };

    if (email) {
      fetchUserData();
    }
  }, [email]);

  // Helper functie om array data veilig te parsen
  const parseArrayData = (data, defaultValue) => {
    if (Array.isArray(data)) {
      return data.length > 0 ? data : defaultValue;
    }
    
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultValue;
      } catch (e) {
        console.error("Fout bij parsen array data:", e);
        return defaultValue;
      }
    }
    
    return defaultValue;
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('naam', naam);
      formData.append('telefoon', telefoon);
      formData.append('aboutMe', aboutMe);
      formData.append('github', github);
      formData.append('linkedin', linkedin);
      formData.append('studie', studie);
      
      // Voeg skills toe
      formData.append('softskills', JSON.stringify(softskills));
      formData.append('hardskills', JSON.stringify(hardskills));
      formData.append('codeertaal', JSON.stringify(codeertalen));
      formData.append('talen', JSON.stringify(talen));
      
      // Voeg boolean waarden toe
      formData.append('jobstudent', jobstudent);
      formData.append('werkzoekend', werkzoekend);
      formData.append('stage_gewenst', stageGewenst);
      
      // Voeg foto toe als die is gewijzigd
      if (fotoFile) {
        formData.append('profilePicture', fotoFile);
      }

      const response = await fetch(`${baseUrl}/profiel`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fout bij opslaan profiel');
      }

      setSuccessMessage('Profiel succesvol bijgewerkt!');
      setIsEditing(false);
      
      // Vernieuw de pagina na 2 seconden om de wijzigingen te tonen
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Fout bij opslaan profiel:', error);
      setError(error.message || 'Er is een fout opgetreden bij het opslaan van je profiel.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditing) {
    return (
      <div className="account-module">
        <div className="loading-spinner"></div>
        <p>Profielgegevens laden...</p>
      </div>
    );
  }

  return (
    <div className="account-module">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="account-header">
        <h2>Mijn Profiel</h2>
        {!isEditing ? (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <FaEdit /> Bewerken
          </button>
        ) : (
          <button className="cancel-button" onClick={() => setIsEditing(false)}>
            <FaTimes /> Annuleren
          </button>
        )}
      </div>

      {/* Debug informatie */}
      <DebugInfo title="Email" data={email} />
      <DebugInfo title="Naam" data={naam} />
      <DebugInfo title="Softskills" data={softskills} />
      <DebugInfo title="Hardskills" data={hardskills} />
      <DebugInfo title="Programmeertalen" data={codeertalen} />
      <DebugInfo title="Talen" data={talen} />

      {!isEditing ? (
        // VIEW MODE
        <div className="account-details">
          <section className="account-section profile-header">
            <div className="profile-image-container">
              {fotoUrl ? (
                <img src={fotoUrl} alt={`Profielfoto van ${naam}`} className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  {naam ? naam.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>{naam || 'Naam niet ingesteld'}</h2>
              <p className="study-info">{studie || 'Studie niet ingesteld'}</p>
              
              <div className="profile-links">
                {github && (
                  <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="profile-link">
                    <FaGithub /> GitHub
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="profile-link">
                    <FaLinkedin /> LinkedIn
                  </a>
                )}
              </div>
              
              <div className="profile-badges">
                {jobstudent && <span className="profile-badge jobstudent">Jobstudent</span>}
                {werkzoekend && <span className="profile-badge werkzoekend">Werkzoekend</span>}
                {stageGewenst && <span className="profile-badge stage">Stage</span>}
              </div>
            </div>
          </section>
          
          <section className="account-section">
            <h3>Over mij</h3>
            <p className="about-me">{aboutMe || 'Geen informatie toegevoegd.'}</p>
          </section>
          
          <section className="account-section">
            <h3>Contactgegevens</h3>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Email:</strong> {email}
              </div>
              {telefoon && (
                <div className="contact-item">
                  <strong>Telefoon:</strong> {telefoon}
                </div>
              )}
            </div>
          </section>
          
          <section className="account-section">
            <h3>Vaardigheden</h3>
            <div className="skills-overview">
              <div className="skills-container">
                <h4>Soft Skills</h4>
                {softskills.length > 0 ? (
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
                {hardskills.length > 0 ? (
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
                {codeertalen && codeertalen.length > 0 ? (
                  <ul className="skills-list">
                    {codeertalen.map((item, index) => (
                      <li key={`code-${index}`} className="skill-tag">
                        {item.taal || item.name || "Onbekende taal"} 
                        {item.ervaring && <span className="skill-level">{item.ervaring}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Geen programmeertalen toegevoegd</p>
                )}
              </div>
              
              <div className="skills-container">
                <h4>Talen</h4>
                {talen && talen.length > 0 ? (
                  <ul className="skills-list">
                    {talen.map((item, index) => (
                      <li key={`taal-${index}`} className="skill-tag">
                        {item.taal || item.name || "Onbekende taal"}
                        {item.niveau && <span className="skill-level">{item.niveau}</span>}
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
      ) : (
        // EDIT MODE
        <form onSubmit={handleSubmit} className="account-form">
          {/* Hier komt het formulier voor het bewerken van het profiel */}
          {/* Dit moet je nog implementeren */}
        </form>
      )}
    </div>
  );
};

export default AccountModule;
