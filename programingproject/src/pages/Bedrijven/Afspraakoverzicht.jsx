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
  const { gebruiker } = useAuth(); // aangepast van bedrijf naar gebruiker
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
      const response = await fetch(`${baseUrl}/afspraken`);
      if (!response.ok) throw new Error('Fout bij ophalen afspraken');
      const afsprakenData = await response.json();

      const gefilterdeAfspraken = afsprakenData.filter(
        (afspraak) =>
          afspraak.bedrijfsnaam &&
          afspraak.bedrijfsnaam.toLowerCase() === ingelogdGebruikerNaam.toLowerCase()
      );

      if (gefilterdeAfspraken.length === 0) {
        setAfspraken([]);
        setIsLoading(false);
        return;
      }

      const studentIds = [...new Set(gefilterdeAfspraken.map((a) => a.student_id))];

      const studentenResponse = await fetch(
        `${baseUrl}/users?ids=${studentIds.join(',')}`
      );
      if (!studentenResponse.ok) throw new Error('Fout bij ophalen studenten');
      const studentenData = await studentenResponse.json();

      const idNaarNaam = {};
      studentenData.forEach((student) => {
        idNaarNaam[student.id] = student.naam;
      });

      const afsprakenMetNamen = gefilterdeAfspraken.map((afspraak) => ({
        ...afspraak,
        student_naam: idNaarNaam[afspraak.student_id] || 'Onbekende student',
      }));

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
