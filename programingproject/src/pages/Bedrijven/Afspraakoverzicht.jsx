import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiGithub,
  FiLinkedin,
  FiCheck,
  FiX,
  FiMail,
  FiUser
} from 'react-icons/fi';
import './Afspraakoverzicht.css';
import { baseUrl } from '../../config';
import { useAuth } from '../../context/AuthProvider';

const AfspraakOverzicht = () => {
  const { gebruiker } = useAuth();
  const [afspraken, setAfspraken] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const ingelogdGebruikerNaam = gebruiker?.naam || '';

  useEffect(() => {
    if (ingelogdGebruikerNaam) {
      fetchAfsprakenMetStudentNamen();
    } else {
      setAfspraken([]);
      setIsLoading(false);
    }
  }, [ingelogdGebruikerNaam]);

  // Handle appointment acceptance
  const handleAcceptAfspraak = async (afspraakId) => {
    try {
      const response = await fetch(`${baseUrl}/afspraken/${afspraakId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'goedgekeurd' }),
      });

      if (response.ok) {
        // Update local state
        setAfspraken(prev => prev.map(afspraak =>
          afspraak.afspraak_id === afspraakId
            ? { ...afspraak, status: 'goedgekeurd' }
            : afspraak
        ));
        alert('Afspraak succesvol goedgekeurd!');
      } else {
        throw new Error('Fout bij goedkeuren afspraak');
      }
    } catch (error) {
      console.error('Fout bij goedkeuren afspraak:', error);
      alert('Er is een fout opgetreden bij het goedkeuren van de afspraak.');
    }
  };

  // Handle appointment rejection
  const handleRejectAfspraak = async (afspraakId) => {
    try {
      const response = await fetch(`${baseUrl}/afspraken/${afspraakId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'geweigerd' }),
      });

      if (response.ok) {
        // Update local state
        setAfspraken(prev => prev.map(afspraak =>
          afspraak.afspraak_id === afspraakId
            ? { ...afspraak, status: 'geweigerd' }
            : afspraak
        ));
        alert('Afspraak geweigerd.');
      } else {
        throw new Error('Fout bij weigeren afspraak');
      }
    } catch (error) {
      console.error('Fout bij weigeren afspraak:', error);
      alert('Er is een fout opgetreden bij het weigeren van de afspraak.');
    }
  };

  const fetchAfsprakenMetStudentNamen = async () => {
    setIsLoading(true);
    try {
      // Get all appointments
      const response = await fetch(`${baseUrl}/afspraken`);
      if (!response.ok) throw new Error('Fout bij ophalen afspraken');
      const alleAfspraken = await response.json();
      
      // Filter for this company's appointments
      const bedrijfsAfspraken = alleAfspraken.filter(
        afspraak => String(afspraak.bedrijf_id) === String(gebruiker.id)
      );
      
      console.log('Gefilterde afspraken voor bedrijf:', bedrijfsAfspraken);
      
      if (bedrijfsAfspraken.length === 0) {
        setAfspraken([]);
        setIsLoading(false);
        return;
      }
      
      // Get unique student IDs from the appointments
      const studentIds = [...new Set(bedrijfsAfspraken.map(a => a.student_id))];
      console.log('Unieke student IDs in afspraken:', studentIds);
      
      // Try several different endpoints to get student information
      let studentInfo = {};
      
      // Try the /users endpoint first
      try {
        const usersResponse = await fetch(`${baseUrl}/users`);
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          console.log('Gebruikers data:', users);
          
          // Extract student info from users
          users.forEach(user => {
            if (studentIds.includes(user.id)) {
              studentInfo[user.id] = {
                naam: user.naam,
                email: user.email
              };
            }
          });
        }
      } catch (error) {
        console.log('Fout bij ophalen gebruikers:', error);
      }
      
      // If we couldn't get information for all students, try the /studenten endpoint
      if (Object.keys(studentInfo).length < studentIds.length) {
        try {
          const studentenResponse = await fetch(`${baseUrl}/studenten`);
          if (studentenResponse.ok) {
            const studenten = await studentenResponse.json();
            console.log('Studenten data:', studenten);
            
            studenten.forEach(student => {
              const studentId = student.student_id || student.id;
              if (studentIds.includes(studentId) && !studentInfo[studentId]) {
                studentInfo[studentId] = {
                  naam: student.naam,
                  email: student.email,
                  github_link: student.github_link || '',
                  linkedin_link: student.linkedin_link || '',
                  studie: student.studie || ''
                };
              }
            });
          }
        } catch (error) {
          console.log('Fout bij ophalen studenten:', error);
        }
      }
      
      // Map the appointments with student names and social links
      const afsprakenMetNamen = bedrijfsAfspraken.map(afspraak => {
        const student = studentInfo[afspraak.student_id];
        return {
          ...afspraak,
          student_naam: student ? student.naam : `Student ${afspraak.student_id}`,
          student_email: student ? student.email : '',
          student_github: student ? student.github_link : '',
          student_linkedin: student ? student.linkedin_link : '',
          student_studie: student ? student.studie : '',
          status: afspraak.status || 'in_afwachting' // Default status
        };
      });
      
      setAfspraken(afsprakenMetNamen);
    } catch (error) {
      console.error('Fout bij ophalen afspraken:', error);
      setAfspraken([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="afspraken-container">
      <div className="afspraken-header">
        <button
          onClick={() => navigate('/bedrijf')}
          className="terug-button"
          aria-label="Terug naar dashboard"
        >
          <FiArrowLeft aria-hidden="true" /> Terug naar Dashboard
        </button>
        <div className="header-content">
          <h1>Afsprakenoverzicht</h1>
          <p className="subtitle">Beheer uw geplande sollicitatiegesprekken met studenten</p>
          {afspraken.length > 0 && (
            <div className="stats-summary">
              <span className="stat-item">
                📊 {afspraken.length} {afspraken.length === 1 ? 'afspraak' : 'afspraken'}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={fetchAfsprakenMetStudentNamen}
          className="refresh-button"
          aria-label="Afspraken vernieuwen"
        >
          <FiRefreshCw aria-hidden="true" /> Vernieuwen
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Afspraken worden geladen...</p>
        </div>
      ) : afspraken.length === 0 ? (
        <div className="empty-state">
          <h3>Geen afspraken gevonden</h3>
          <p>Er zijn momenteel geen geplande sollicitatiegesprekken. Studenten kunnen afspraken maken via het platform.</p>
          <button
            onClick={fetchAfsprakenMetStudentNamen}
            className="refresh-btn"
          >
            <FiRefreshCw /> Vernieuwen
          </button>
        </div>
      ) : (
        <section className="afspraken-grid">
          {afspraken.map((afspraak) => (
            <article key={afspraak.afspraak_id} className={`afspraak-card ${afspraak.status}`}>
              <header className="card-header">
                <div className="student-info">
                  <h3>
                    <FiUser /> {afspraak.student_naam}
                  </h3>
                  {afspraak.student_studie && (
                    <p className="specialization">{afspraak.student_studie}</p>
                  )}
                  {afspraak.context && <p className="context">{afspraak.context}</p>}
                </div>
                <div className="status-badge-container">
                  <span className={`status-badge ${afspraak.status}`}>
                    {afspraak.status === 'goedgekeurd' && '✅ Goedgekeurd'}
                    {afspraak.status === 'geweigerd' && '❌ Geweigerd'}
                    {afspraak.status === 'in_afwachting' && '⏳ In afwachting'}
                  </span>
                </div>
              </header>

              <div className="card-body">
                <p>
                  <FiCalendar />
                  <strong>Datum:</strong> {new Date(afspraak.datum).toLocaleDateString('nl-BE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p>
                  <FiClock />
                  <strong>Tijdslot:</strong> {afspraak.tijdslot}
                </p>
                {afspraak.student_email && (
                  <p>
                    <FiMail /> <strong>Email:</strong>
                    <a href={`mailto:${afspraak.student_email}`} className="email-link">
                      {afspraak.student_email}
                    </a>
                  </p>
                )}
              </div>

              <div className="card-footer">
                {/* Social Links */}
                <div className="social-links">
                  {afspraak.student_github && (
                    <a
                      href={afspraak.student_github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link github"
                    >
                      <FiGithub /> GitHub
                    </a>
                  )}
                  {afspraak.student_linkedin && (
                    <a
                      href={afspraak.student_linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link linkedin"
                    >
                      <FiLinkedin /> LinkedIn
                    </a>
                  )}
                </div>

                {/* Action Buttons - Only show if status is pending */}
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
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default AfspraakOverzicht;
