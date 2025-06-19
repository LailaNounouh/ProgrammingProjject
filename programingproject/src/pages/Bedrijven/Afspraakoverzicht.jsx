import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiRefreshCw,
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
                  email: student.email
                };
              }
            });
          }
        } catch (error) {
          console.log('Fout bij ophalen studenten:', error);
        }
      }
      
      // Map the appointments with student names
      const afsprakenMetNamen = bedrijfsAfspraken.map(afspraak => {
        const student = studentInfo[afspraak.student_id];
        return {
          ...afspraak,
          student_naam: student ? student.naam : `Student ${afspraak.student_id}`,
          student_email: student ? student.email : ''
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
          <h1>Afsprakenbeheer</h1>
          <p className="subtitle">Overzicht van sollicitatiegesprekken met studenten</p>
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
          <h3>U heeft momenteel nog geen afspraken.</h3>
          <p>Vernieuw de pagina later opnieuw.</p>
        </div>
      ) : (
        <section className="afspraken-grid">
          {afspraken.map((afspraak) => (
            <article key={afspraak.afspraak_id} className="afspraak-card">
              <header className="card-header">
                {afspraak.logo_url && (
                  <img
                    src={afspraak.logo_url}
                    alt={`${afspraak.bedrijfsnaam} logo`}
                    className="bedrijf-logo"
                  />
                )}
                <h3>{afspraak.student_naam}</h3>
                {afspraak.context && <p className="context">{afspraak.context}</p>}
              </header>

              <div className="card-body">
                <p>
                  <FiCalendar /> Datum: {afspraak.datum}
                </p>
                <p>
                  <FiClock /> Tijd: {afspraak.tijdslot}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default AfspraakOverzicht;
