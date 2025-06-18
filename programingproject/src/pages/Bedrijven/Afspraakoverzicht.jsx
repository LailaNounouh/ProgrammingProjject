import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiGithub,
  FiLinkedin,
  FiCalendar,
  FiClock,
  FiBook,
  FiRefreshCw,
} from 'react-icons/fi';
import './Afspraakoverzicht.css';

const opleidingenOpties = [
  'Business IT Technology',
  'Business IT Development',
  'Mobile Enterprise Apps Business IT',
  'Network Engineering',
  'Software Engineering',
  'Intelligent Robotics',
];

const AfspraakOverzicht = () => {
  const [afspraken, setAfspraken] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    opleiding: '',
    vaardigheid: '',
    taal: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAfspraken();
  }, []);

  const fetchAfspraken = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const mockData = [
          {
            id: 1,
            student_naam: 'Lisa van der Berg',
            student_opleiding: 'Software Engineering',
            student_vaardigheden: 'Software Engineering',
            datum: '15 juni 2025',
            tijd: '09:30 - 10:15',
            github: 'https://github.com/lisavdberg',
            linkedin: 'https://linkedin.com/in/lisavdberg',
            status: 'in-afwachting',
            taal: 'Nederlands',
          },
          {
            id: 2,
            student_naam: 'Ahmed el-Masri',
            student_opleiding: 'Software Engineering',
            student_vaardigheden: 'Data Science',
            datum: '15 juni 2025',
            tijd: '11:00 - 11:45',
            github: 'https://github.com/ahmedelmasri',
            linkedin: 'https://linkedin.com/in/ahmedelmasri',
            status: 'goedgekeurd',
            taal: 'Engels',
          },
          {
            id: 3,
            student_naam: 'Sophie de Vries',
            student_opleiding: 'Software Engineering',
            student_vaardigheden: 'Frontend Development',
            datum: '16 juni 2025',
            tijd: '14:00 - 14:45',
            github: 'https://github.com/sophiedev',
            linkedin: 'https://linkedin.com/in/sophiedev',
            status: 'in-afwachting',
            taal: 'Nederlands',
          },
          {
            id: 4,
            student_naam: 'Thomas Janssen',
            student_opleiding: 'Network Engineering',
            student_vaardigheden: 'Cyber Security',
            datum: '17 juni 2025',
            tijd: '10:15 - 11:00',
            github: 'https://github.com/tomjanssen',
            linkedin: 'https://linkedin.com/in/tomjanssen',
            status: 'geweigerd',
            taal: 'Frans',
          },
          {
            id: 5,
            student_naam: 'Yara Hassan',
            student_opleiding: 'Business IT Technology',
            student_vaardigheden: 'Cloud Engineering',
            datum: '18 juni 2025',
            tijd: '13:30 - 14:15',
            github: 'https://github.com/yarah',
            linkedin: 'https://linkedin.com/in/yarah',
            status: 'goedgekeurd',
            taal: 'Engels',
          },
          {
            id: 6,
            student_naam: 'Mark Boer',
            student_opleiding: 'Business IT Technology',
            student_vaardigheden: 'Fullstack Development',
            datum: '18 juni 2025',
            tijd: '15:00 - 15:45',
            github: 'https://github.com/markboer',
            linkedin: 'https://linkedin.com/in/markboer',
            status: 'in-afwachting',
            taal: 'Nederlands',
          },
          {
            id: 7,
            student_naam: 'Eva van Dijk',
            student_opleiding: 'Network Engineering',
            student_vaardigheden: 'UX/UI Design',
            datum: '19 juni 2025',
            tijd: '10:00 - 10:45',
            github: 'https://github.com/evavandijk',
            linkedin: 'https://linkedin.com/in/evavandijk',
            status: 'goedgekeurd',
            taal: 'Engels',
          },
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
    setAfspraken((prev) =>
      prev.map((afspraak) =>
        afspraak.id === id ? { ...afspraak, status: newStatus } : afspraak
      )
    );
  };

  const filteredAfspraken = afspraken.filter((afspraak) => {
    const opleidingMatch =
      !filters.opleiding || afspraak.student_opleiding === filters.opleiding;

    const vaardigheidMatch =
      !filters.vaardigheid ||
      afspraak.student_vaardigheden
        .toLowerCase()
        .includes(filters.vaardigheid.toLowerCase());

    const taalMatch =
      !filters.taal ||
      afspraak.taal.toLowerCase().includes(filters.taal.toLowerCase());

    return opleidingMatch && vaardigheidMatch && taalMatch;
  });

  // Helper om status netter te tonen, bijv 'in-afwachting' => 'In Afwachting'
  const formatStatus = (status) =>
    status
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

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
          onClick={fetchAfspraken}
          className="refresh-button"
          aria-label="Afspraken vernieuwen"
        >
          <FiRefreshCw aria-hidden="true" /> Vernieuwen
        </button>
      </div>

      <form
        className="filters"
        style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        aria-label="Filters voor afspraken"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="filter-opleiding" className="sr-only">
          Filter op opleiding
        </label>
        <select
          id="filter-opleiding"
          value={filters.opleiding}
          onChange={(e) => setFilters({ ...filters, opleiding: e.target.value })}
          aria-describedby="filter-opleiding"
        >
          <option value="">Alle opleidingen</option>
          {opleidingenOpties.map((optie, idx) => (
            <option key={idx} value={optie}>
              {optie}
            </option>
          ))}
        </select>

        <label htmlFor="filter-vaardigheid" className="sr-only">
          Filter op vaardigheden
        </label>
        <input
          id="filter-vaardigheid"
          type="text"
          placeholder="Filter op vaardigheden"
          value={filters.vaardigheid}
          onChange={(e) => setFilters({ ...filters, vaardigheid: e.target.value })}
        />

        <label htmlFor="filter-taal" className="sr-only">
          Filter op taal
        </label>
        <input
          id="filter-taal"
          type="text"
          placeholder="Filter op taal"
          value={filters.taal}
          onChange={(e) => setFilters({ ...filters, taal: e.target.value })}
        />
      </form>

      {isLoading ? (
        <div className="loading-state" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
          <p>Afspraken worden geladen...</p>
        </div>
      ) : filteredAfspraken.length === 0 ? (
        <div className="empty-state" role="alert">
          <FiCalendar className="empty-icon" size={48} aria-hidden="true" />
          <h3>Geen afspraken gevonden</h3>
          <p>Pas de filters aan of vernieuw de lijst.</p>
          <button onClick={fetchAfspraken} className="refresh-btn">
            <FiRefreshCw aria-hidden="true" /> Vernieuwen
          </button>
        </div>
      ) : (
        <section className="afspraken-grid" aria-label="Lijst van afspraken">
          {filteredAfspraken.map((afspraak) => (
            <article
              key={afspraak.id}
              className={`afspraak-card status-${afspraak.status}`}
              aria-live="polite"
              aria-atomic="true"
            >
              <header className="card-header">
                <div className="student-info">
                  <h3>{afspraak.student_naam}</h3>
                </div>
                <span className={`status-badge status-${afspraak.status}`}>
                  {formatStatus(afspraak.status)}
                </span>
              </header>

              <div className="card-body">
                <p>
                  <FiBook aria-hidden="true" /> Opleiding: {afspraak.student_opleiding}
                </p>
                <p>
                  <FiCalendar aria-hidden="true" /> Datum: {afspraak.datum}
                </p>
                <p>
                  <FiClock aria-hidden="true" /> Tijd: {afspraak.tijd}
                </p>
                <p>
                  <strong>Taal:</strong> {afspraak.taal}
                </p>
              </div>

              <footer className="card-footer">
                <div className="actions">
                  {(afspraak.status !== 'goedgekeurd' && afspraak.status !== 'geweigerd') && (
                    <>
                      <button
                        onClick={() => updateStatus(afspraak.id, 'goedgekeurd')}
                        className="btn accept-btn"
                        aria-label={`Accepteer afspraak met ${afspraak.student_naam}`}
                      >
                        Accepteren
                      </button>
                      <button
                        onClick={() => updateStatus(afspraak.id, 'geweigerd')}
                        className="btn reject-btn"
                        aria-label={`Weiger afspraak met ${afspraak.student_naam}`}
                      >
                        Afwijzen
                      </button>
                    </>
                  )}
                </div>
                <div className="social-links">
                  <a
                    href={afspraak.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub profiel van ${afspraak.student_naam}`}
                  >
                    <FiGithub aria-hidden="true" /> GitHub
                  </a>
                  <a
                    href={afspraak.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn profiel van ${afspraak.student_naam}`}
                  >
                    <FiLinkedin aria-hidden="true" /> LinkedIn
                  </a>
                </div>
              </footer>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default AfspraakOverzicht;
