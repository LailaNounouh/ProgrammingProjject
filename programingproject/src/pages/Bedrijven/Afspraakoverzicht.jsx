import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiGithub, FiLinkedin, FiCalendar, FiClock, FiBook, FiAward, FiRefreshCw } from 'react-icons/fi';
import './Afspraakoverzicht.css';

const AfspraakOverzicht = () => {
  const [afspraken, setAfspraken] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAfspraken();
  }, []);

  const fetchAfspraken = () => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        // testdata met 8 studenten
        const mockData = [
          {
            id: 1,
            student_naam: 'Lisa van der Berg',
            student_opleiding: 'HBO-ICT',
            student_specialisatie: 'Software Engineering',
            datum: '15 juni 2025',
            tijd: '09:30 - 10:15',
            github: 'https://github.com/lisavdberg',
            linkedin: 'https://linkedin.com/in/lisavdberg',
            status: 'in-afwachting',
            opmerking: 'Ervaring met Java en Spring Boot'
          },
          {
            id: 2,
            student_naam: 'Ahmed el-Masri',
            student_opleiding: 'HBO-ICT',
            student_specialisatie: 'Data Science',
            datum: '15 juni 2025',
            tijd: '11:00 - 11:45',
            github: 'https://github.com/ahmedelmasri',
            linkedin: 'https://linkedin.com/in/ahmedelmasri',
            status: 'goedgekeurd',
            opmerking: 'Machine learning specialisatie'
          },
          {
            id: 3,
            student_naam: 'Sophie de Vries',
            student_opleiding: 'HBO-ICT',
            student_specialisatie: 'Frontend Development',
            datum: '16 juni 2025',
            tijd: '14:00 - 14:45',
            github: 'https://github.com/sophiedev',
            linkedin: 'https://linkedin.com/in/sophiedev',
            status: 'in-afwachting',
            opmerking: 'Expertise in React en TypeScript'
          },
          {
            id: 4,
            student_naam: 'Thomas Janssen',
            student_opleiding: 'HBO-ICT',
            student_specialisatie: 'Cyber Security',
            datum: '17 juni 2025',
            tijd: '10:15 - 11:00',
            github: 'https://github.com/tomjanssen',
            linkedin: 'https://linkedin.com/in/tomjanssen',
            status: 'geweigerd',
            opmerking: 'Niet beschikbaar in gevraagde periode'
          },
          {
            id: 5,
            student_naam: 'Yara Hassan',
            student_opleiding: 'HBO-ICT',
            student_specialisatie: 'Cloud Engineering',
            datum: '18 juni 2025',
            tijd: '13:30 - 14:15',
            github: 'https://github.com/yarah',
            linkedin: 'https://linkedin.com/in/yarah',
            status: 'goedgekeurd',
            opmerking: 'AWS gecertificeerd'
          },
          {
            id: 6,
            student_naam: 'Mark Boer',
            student_opleiding: 'HBO-ICT',
            student_specialisatie: 'Fullstack Development',
            datum: '18 juni 2025',
            tijd: '15:00 - 15:45',
            github: 'https://github.com/markboer',
            linkedin: 'https://linkedin.com/in/markboer',
            status: 'in-afwachting',
            opmerking: 'Ervaring met MERN stack'
          },
          {
            id: 7,
            student_naam: 'Eva van Dijk',
            student_opleiding: 'HBO-ICT',
            student_specialisatie: 'UX/UI Design',
            datum: '19 juni 2025',
            tijd: '10:00 - 10:45',
            github: 'https://github.com/evavandijk',
            linkedin: 'https://linkedin.com/in/evavandijk',
            status: 'goedgekeurd',
            opmerking: 'Sterke portfolio met case studies'
          }
        ];
        setAfspraken(mockData);
      } catch (error) {
        console.error('Fout bij ophalen afspraken:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const updateStatus = (id, newStatus) => {
    setAfspraken(prev =>
      prev.map(afspraak =>
        afspraak.id === id ? { ...afspraak, status: newStatus } : afspraak
      )
    );
  };

  return (
    <div className="afspraken-container">
      <div className="afspraken-header">
        <button onClick={() => navigate('/bedrijf')} className="terug-button">
          <FiArrowLeft /> Terug naar Dashboard
        </button>
        <div className="header-content">
          <h1>Afsprakenbeheer</h1>
          <p className="subtitle">Overzicht van sollicitatiegesprekken met studenten</p>
        </div>
        <button onClick={fetchAfspraken} className="refresh-button">
          <FiRefreshCw /> Vernieuwen
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Afspraken worden geladen...</p>
        </div>
      ) : afspraken.length === 0 ? (
        <div className="empty-state">
          <FiCalendar className="empty-icon" size={48} />
          <h3>Geen afspraken gepland</h3>
          <p>Er staan momenteel geen gesprekken met studenten gepland.</p>
          <button onClick={fetchAfspraken} className="refresh-btn">
            <FiRefreshCw /> Vernieuwen
          </button>
        </div>
      ) : (
        <div className="afspraken-grid">
          {afspraken.map((afspraak) => (
            <div key={afspraak.id} className={`afspraak-card ${afspraak.status}`}>
              <div className="card-header">
                <div className="student-info">
                  <h3>{afspraak.student_naam}</h3>
                  <span className="specialization">{afspraak.student_specialisatie}</span>
                </div>
                <span className={`status-badge ${afspraak.status}`}>
                  {afspraak.status.replace('-', ' ')}
                </span>
              </div>

              <div className="card-body">
                <div className="detail-row">
                  <FiBook className="icon" />
                  <span>{afspraak.student_opleiding}</span>
                </div>
                <div className="detail-row">
                  <FiCalendar className="icon" />
                  <span>{afspraak.datum}</span>
                </div>
                <div className="detail-row">
                  <FiClock className="icon" />
                  <span>{afspraak.tijd}</span>
                </div>
                {afspraak.opmerking && (
                  <div className="comment-section">
                    <FiAward className="icon" />
                    <p>{afspraak.opmerking}</p>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <div className="actions">
                  {afspraak.status === 'in-afwachting' && (
                    <>
                      <button 
                        onClick={() => updateStatus(afspraak.id, 'goedgekeurd')}
                        className="btn accept-btn"
                      >
                        Accepteren
                      </button>
                      <button 
                        onClick={() => updateStatus(afspraak.id, 'geweigerd')}
                        className="btn reject-btn"
                      >
                        Afwijzen
                      </button>
                    </>
                  )}
                </div>
                <div className="social-links">
                  <a href={afspraak.github} target="_blank" rel="noopener noreferrer">
                    <FiGithub /> Profiel
                  </a>
                  <a href={afspraak.linkedin} target="_blank" rel="noopener noreferrer">
                    <FiLinkedin /> Profiel
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AfspraakOverzicht;