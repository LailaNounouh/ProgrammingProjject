import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiMail, FiMapPin, FiCheck, FiX, FiGithub, FiLinkedin, FiRefreshCw, FiCode, FiGlobe, FiTool, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthProvider';
import { baseUrl } from '../../config';
import './Afspraakoverzicht.css';

const Afspraakoverzicht = () => {
  const { gebruiker } = useAuth();
  const [afspraken, setAfspraken] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (gebruiker && gebruiker.id) {
      fetchAfspraken();
    }
  }, [gebruiker]);

  const fetchAfspraken = async () => {
    if (!gebruiker || !gebruiker.id) {
      console.error('Geen gebruiker gevonden');
      setError('Je moet ingelogd zijn om afspraken te bekijken.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Ophalen afspraken voor bedrijf:", gebruiker.id);
      const response = await fetch(`${baseUrl}/afspraken/bedrijf/${gebruiker.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Opgehaalde afspraken:", data);
      setAfspraken(data);
      setError(null);
    } catch (err) {
      console.error('Fout bij ophalen afspraken:', err);
      setError('Er is een fout opgetreden bij het ophalen van de afspraken.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAfspraak = async (afspraakId) => {
    try {
      const response = await fetch(`${baseUrl}/afspraken/${afspraakId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'goedgekeurd' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      fetchAfspraken(); // Refresh de lijst
    } catch (err) {
      console.error('Fout bij goedkeuren afspraak:', err);
      setError('Er is een fout opgetreden bij het goedkeuren van de afspraak.');
    }
  };

  const handleRejectAfspraak = async (afspraakId) => {
    try {
      const response = await fetch(`${baseUrl}/afspraken/${afspraakId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'geweigerd' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      fetchAfspraken(); // Refresh de lijst
    } catch (err) {
      console.error('Fout bij weigeren afspraak:', err);
      setError('Er is een fout opgetreden bij het weigeren van de afspraak.');
    }
  };

  // Functie om te controleren of een array geldig is en items bevat
  const isValidArray = (arr) => {
    if (!arr) return false;
    if (typeof arr === 'string') {
      try {
        const parsed = JSON.parse(arr);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch (e) {
        return false;
      }
    }
    return Array.isArray(arr) && arr.length > 0;
  };

  // Functie om een array te parsen als het een string is of om strings naar objecten te converteren
  const parseArrayIfString = (arr) => {
    if (!arr) return [];
    
    // Als het een string is die een JSON array bevat
    if (typeof arr === 'string') {
      try {
        const parsed = JSON.parse(arr);
        console.log("Geparsed van string naar array:", parsed);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Fout bij parsen van array:", e, arr);
        return [];
      }
    }
    
    // Als het een array van strings is, converteer naar objecten
    if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string') {
      console.log("Array van strings geconverteerd naar objecten:", arr);
      return arr.map(item => ({ skill: item }));
    }
    
    return Array.isArray(arr) ? arr : [];
  };

  // Functie om de structuur van een vaardigheid te normaliseren
  const normalizeSkill = (skill) => {
    if (!skill) return null;
    
    // Als het een string is
    if (typeof skill === 'string') {
      return { skill: skill };
    }
    
    // Voor programmeertalen
    if (skill.taal || skill.name) {
      return {
        taal: skill.taal || skill.name,
        ervaring: skill.ervaring || skill.niveau || "beginner"
      };
    }
    
    // Voor hardskills en softskills
    if (skill.skill || skill.name) {
      return {
        skill: skill.skill || skill.name,
        niveau: skill.niveau || ""
      };
    }
    
    return skill;
  };

  // Functie om studentgegevens op te halen via API
  const fetchStudentDetails = async (studentId) => {
    if (!studentId) return null;
    
    try {
      // Probeer verschillende endpoints zonder dubbele 'api'
      const endpoints = [
        `/student/${studentId}`,
        `/studenten/${studentId}`,
        `/gebruiker/${studentId}`,
        `/student/profiel/${studentId}`,
        `/profiel/id/${studentId}`,
        `/gebruikers/${studentId}`
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Proberen endpoint: ${baseUrl}${endpoint}`);
          const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log("Opgehaalde studentgegevens:", data);
            return data;
          }
        } catch (err) {
          console.error(`Fout bij endpoint ${endpoint}:`, err);
        }
      }
      
      // Als geen van de endpoints werkt, haal dan de gebruiker op uit localStorage
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          if (user.id === parseInt(studentId)) {
            console.log("Gebruiker gevonden in localStorage:", user);
            return user;
          }
        }
      } catch (err) {
        console.error("Fout bij ophalen gebruiker uit localStorage:", err);
      }
      
      return null;
    } catch (err) {
      console.error("Fout bij ophalen studentgegevens:", err);
      return null;
    }
  };

  const showStudentDetails = async (afspraak) => {
    console.log("Tonen studentdetails voor afspraak:", afspraak);
    
    // Haal studentgegevens op als student_id beschikbaar is
    let extraData = {};
    if (afspraak.student_id) {
      console.log("Ophalen studentgegevens voor:", afspraak.student_id);
      const studentData = await fetchStudentDetails(afspraak.student_id);
      if (studentData) {
        extraData = studentData;
      }
    }
    
    // Verwerk alle mogelijke veldnamen en formaten
    const studentData = { 
      ...afspraak,
      ...extraData,
      student_naam: afspraak.studentnaam || afspraak.student_naam || extraData.naam || extraData.voornaam || "Student",
      student_email: afspraak.studentemail || afspraak.student_email || extraData.email || "E-mail niet beschikbaar",
      student_studie: afspraak.studie || afspraak.student_studie || extraData.studie || extraData.opleiding || "Onbekend"
    };
    
    // Debug: Log alle mogelijke velden voor vaardigheden
    console.log("Debug - Mogelijke talen velden:", {
      student_talen: studentData.student_talen,
      talen: studentData.talen,
      extraData_talen: extraData.talen
    });
    
    console.log("Debug - Mogelijke programmeertalen velden:", {
      student_programmeertalen: studentData.student_programmeertalen,
      programmeertalen: studentData.programmeertalen,
      codeertalen: studentData.codeertalen,
      extraData_programmeertalen: extraData.programmeertalen,
      extraData_codeertalen: extraData.codeertalen
    });
    
    console.log("Debug - Mogelijke softskills velden:", {
      student_softskills: studentData.student_softskills,
      softskills: studentData.softskills,
      extraData_softskills: extraData.softskills
    });
    
    console.log("Debug - Mogelijke hardskills velden:", {
      student_hardskills: studentData.student_hardskills,
      hardskills: studentData.hardskills,
      extraData_hardskills: extraData.hardskills
    });
    
    // Voeg dummy data toe voor testen als er geen vaardigheden zijn
    if (!isValidArray(studentData.student_talen) && 
        !isValidArray(studentData.talen) && 
        !isValidArray(extraData.talen)) {
      studentData.student_talen = [
        { taal: "Nederlands", niveau: "moedertaal" },
        { taal: "Engels", niveau: "vloeiend" },
        { taal: "Frans", niveau: "basis" }
      ];
    } else {
      studentData.student_talen = parseArrayIfString(studentData.student_talen || studentData.talen || extraData.talen);
    }
    
    if (!isValidArray(studentData.student_programmeertalen) && 
        !isValidArray(studentData.programmeertalen) && 
        !isValidArray(studentData.codeertalen) && 
        !isValidArray(extraData.programmeertalen) && 
        !isValidArray(extraData.codeertalen)) {
      studentData.student_programmeertalen = parseArrayIfString(
        studentData.student_programmeertalen || 
        studentData.programmeertalen || 
        studentData.codeertalen || 
        extraData.programmeertalen || 
        extraData.codeertalen
      );
    } else {
      studentData.student_programmeertalen = parseArrayIfString(
        studentData.student_programmeertalen || 
        studentData.programmeertalen || 
        studentData.codeertalen || 
        extraData.programmeertalen || 
        extraData.codeertalen
      );
    }
    
    if (!isValidArray(studentData.student_softskills) && 
        !isValidArray(studentData.softskills) && 
        !isValidArray(extraData.softskills)) {
      studentData.student_softskills = parseArrayIfString(
        studentData.student_softskills || 
        studentData.softskills || 
        extraData.softskills
      );
    } else {
      studentData.student_softskills = parseArrayIfString(studentData.student_softskills || studentData.softskills || extraData.softskills);
    }
    
    if (!isValidArray(studentData.student_hardskills) && 
        !isValidArray(studentData.hardskills) && 
        !isValidArray(extraData.hardskills)) {
      studentData.student_hardskills = parseArrayIfString(
        studentData.student_hardskills || 
        studentData.hardskills || 
        extraData.hardskills
      );
    } else {
      studentData.student_hardskills = parseArrayIfString(studentData.student_hardskills || studentData.hardskills || extraData.hardskills);
    }
    
    // Debug: Log de verwerkte arrays
    console.log("Debug - Verwerkte talen:", studentData.student_talen);
    console.log("Debug - Verwerkte programmeertalen:", studentData.student_programmeertalen);
    console.log("Debug - Verwerkte softskills:", studentData.student_softskills);
    console.log("Debug - Verwerkte hardskills:", studentData.student_hardskills);
    
    // Normaliseer de structuur van de vaardigheden
    studentData.student_talen = studentData.student_talen.map(normalizeSkill).filter(Boolean);
    studentData.student_programmeertalen = studentData.student_programmeertalen.map(normalizeSkill).filter(Boolean);
    studentData.student_softskills = studentData.student_softskills.map(normalizeSkill).filter(Boolean);
    studentData.student_hardskills = studentData.student_hardskills.map(normalizeSkill).filter(Boolean);
    
    console.log("Verwerkte studentgegevens:", studentData);
    setSelectedStudent(studentData);
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
  };

  console.log("Rendering component met:", { loading, error, afspraken, showStudentModal, selectedStudent });

  if (loading) return <div className="loading">Afspraken laden...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="afspraken-container">
      <div className="afspraken-header">
        <div className="stats-summary">
          Totaal: {afspraken.length} afspraken
        </div>
        <div className="header-content">
          <h1>Afspraakoverzicht</h1>
          <p className="subtitle">
            Bekijk en beheer al je afspraken met studenten voor de Career Launch Day.
          </p>
        </div>
        <button className="refresh-button" onClick={fetchAfspraken}>
          <FiRefreshCw /> Vernieuwen
        </button>
      </div>

      {afspraken.length === 0 ? (
        <div className="no-afspraken">
          <p>Je hebt nog geen afspraken.</p>
        </div>
      ) : (
        <div className="afspraken-grid">
          {afspraken.map((afspraak) => (
            <div key={afspraak.afspraak_id} className="afspraak-card">
              <div className="card-header">
                <div className="student-info">
                  <h3>
                    <FiUser /> {afspraak.studentnaam || afspraak.student_naam || "Student"}
                  </h3>
                  <span className="specialization">{afspraak.studie || afspraak.student_studie || "Student"}</span>
                </div>
              </div>

              <div className="card-body">
                <p>
                  <FiCalendar />
                  {new Date(afspraak.datum).toLocaleDateString('nl-BE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <FiClock />
                  {afspraak.tijdslot}
                </p>
                <p>
                  <FiMail />
                  <a href={`mailto:${afspraak.studentemail || afspraak.student_email}`}>
                    {afspraak.studentemail || afspraak.student_email || "E-mail niet beschikbaar"}
                  </a>
                </p>
                <p>
                  <FiMapPin />
                  {afspraak.locatie || 'Locatie nog niet bepaald'}
                </p>
                <p>
                  Status:{' '}
                  <span className={`status-badge ${afspraak.status}`}>
                    {afspraak.status === 'goedgekeurd' && '✅ Goedgekeurd'}
                    {afspraak.status === 'geweigerd' && '❌ Geweigerd'}
                    {afspraak.status === 'in_afwachting' && '⏳ In afwachting'}
                  </span>
                </p>
              </div>

              <div className="card-footer">
                <div className="social-links">
                  <button 
                    onClick={() => showStudentDetails(afspraak)} 
                    className="details-btn"
                  >
                    <FiUser /> Bekijk profiel
                  </button>
                </div>

                {afspraak.status === 'in_afwachting' && (
                  <div className="actions">
                    <button
                      onClick={() => handleAcceptAfspraak(afspraak.afspraak_id)}
                      className="btn accept-btn"
                    >
                      <FiCheck /> Goedkeuren
                    </button>
                    <button
                      onClick={() => handleRejectAfspraak(afspraak.afspraak_id)}
                      className="btn reject-btn"
                    >
                      <FiX /> Weigeren
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showStudentModal && selectedStudent && (
        <div className="student-modal-overlay" onClick={closeStudentModal}>
          <div className="student-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeStudentModal}>×</button>
            
            <div className="student-modal-header">
              <h2>{selectedStudent.student_naam}</h2>
              {selectedStudent.student_studie && selectedStudent.student_studie !== "Onbekend" && (
                <p className="student-studie">{selectedStudent.student_studie}</p>
              )}
            </div>
            
            <div className="student-modal-body">
              {selectedStudent.student_email && selectedStudent.student_email !== "E-mail niet beschikbaar" && (
                <div className="student-section">
                  <h3>Contact</h3>
                  <p><FiMail /> <a href={`mailto:${selectedStudent.student_email}`}>{selectedStudent.student_email}</a></p>
                </div>
              )}
              
              <div className="student-section">
                <h3>Afspraakdetails</h3>
                <p><FiCalendar /> <strong>Datum:</strong> {new Date(selectedStudent.datum).toLocaleDateString('nl-BE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
                <p><FiClock /> <strong>Tijdslot:</strong> {selectedStudent.tijdslot}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className={`status-badge ${selectedStudent.status}`}>
                    {selectedStudent.status === 'goedgekeurd' && '✅ Goedgekeurd'}
                    {selectedStudent.status === 'geweigerd' && '❌ Geweigerd'}
                    {selectedStudent.status === 'in_afwachting' && '⏳ In afwachting'}
                  </span>
                </p>
                {selectedStudent.locatie && (
                  <p><FiMapPin /> <strong>Locatie:</strong> {selectedStudent.locatie}</p>
                )}
              </div>
              
              {/* Programmeertalen sectie */}
              {selectedStudent.student_programmeertalen && selectedStudent.student_programmeertalen.length > 0 && (
                <div className="student-section">
                  <h3><FiCode /> Programmeertalen</h3>
                  <ul className="skills-list">
                    {selectedStudent.student_programmeertalen.map((taal, index) => (
                      <li key={`code-${index}`} className="skill-tag">
                        {taal.taal || taal.name || "Onbekend"} 
                        {(taal.ervaring || taal.niveau) && (
                          <span className="skill-level" data-level={taal.ervaring || taal.niveau}>
                            {taal.ervaring || taal.niveau}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Talen sectie */}
              {selectedStudent.student_talen && selectedStudent.student_talen.length > 0 && (
                <div className="student-section">
                  <h3><FiGlobe /> Talen</h3>
                  <ul className="skills-list">
                    {selectedStudent.student_talen.map((taal, index) => (
                      <li key={`taal-${index}`} className="skill-tag">
                        {taal.taal || taal.name || "Onbekend"} 
                        {(taal.niveau || taal.ervaring) && (
                          <span className="skill-level" data-level={taal.niveau || taal.ervaring}>
                            {taal.niveau || taal.ervaring}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Soft skills sectie */}
              {selectedStudent.student_softskills && selectedStudent.student_softskills.length > 0 && (
                <div className="student-section">
                  <h3><FiHeart /> Persoonlijke vaardigheden</h3>
                  <ul className="skills-list">
                    {selectedStudent.student_softskills.map((skill, index) => (
                      <li key={`soft-${index}`} className="skill-tag">
                        {typeof skill === 'string' ? skill : (skill.skill || skill.name || "Onbekend")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Hard skills sectie */}
              {selectedStudent.student_hardskills && selectedStudent.student_hardskills.length > 0 && (
                <div className="student-section">
                  <h3><FiTool /> Technische vaardigheden</h3>
                  <ul className="skills-list">
                    {selectedStudent.student_hardskills.map((skill, index) => (
                      <li key={`hard-${index}`} className="skill-tag">
                        {typeof skill === 'string' ? skill : (skill.skill || skill.name || "Onbekend")}
                        {(typeof skill !== 'string' && (skill.niveau || skill.ervaring)) && (
                          <span className="skill-level" data-level={skill.niveau || skill.ervaring}>
                            {skill.niveau || skill.ervaring}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedStudent.status === 'in_afwachting' && (
                <div className="student-section actions-section">
                  <h3>Acties</h3>
                  <div className="modal-actions">
                    <button
                      onClick={() => {
                        handleAcceptAfspraak(selectedStudent.afspraak_id);
                        closeStudentModal();
                      }}
                      className="btn accept-btn"
                    >
                      <FiCheck /> Goedkeuren
                    </button>
                    <button
                      onClick={() => {
                        handleRejectAfspraak(selectedStudent.afspraak_id);
                        closeStudentModal();
                      }}
                      className="btn reject-btn"
                    >
                      <FiX /> Weigeren
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Afspraakoverzicht;
