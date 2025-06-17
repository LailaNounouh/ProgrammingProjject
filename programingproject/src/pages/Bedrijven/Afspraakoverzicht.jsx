import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiGithub,
  FiLinkedin,
  FiCalendar,
  FiClock,
  FiBook,
  FiAward,
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

  // Mock data ophalen met loading simulatie
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
            opmerking: 'Ervaring met Java en Spring Boot',
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
            opmerking: 'Machine learning specialisatie',
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
            opmerking: 'Expertise in React en TypeScript',
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
            opmerking: 'Niet beschikbaar in gevraagde periode',
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
            opmerking: 'AWS gecertificeerd',
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
            opmerking: 'Ervaring met MERN stack',
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
            opmerking: 'Sterke portfolio met case studies',
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

  // Status bijwerken van een afspraak
  const updateStatus = (id, newStatus) => {
    setAfspraken((prev) =>
      prev.map((afspraak) =>
        afspraak.id === id ? { ...afspraak, status: newStatus } : afspraak
      )
    );
  };

const filteredAfspraken = afspraken.filter((afspraak) => {
  // opleiding filter exact match op student_opleiding
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
  return (
    <div className="afspraken-container">
      {/* Header met terug knop en titel */}
      <div className="afspraken-header">
        <button onClick={() => navigate('/bedrijf')} className="terug-button">
          <FiArrowLeft /> Terug naar Dashboard
        </button>
        <div className="header-content">
          <h1>Afsprakenbeheer</h1>
          <p className="subtitle">Overzicht van sollicitatiegesprekken met studenten</p>
        </div>
        <button onClick={fetchAfspraken} className="refresh-button" aria-label="Vernieuwen">
          <FiRefreshCw /> Vernieuwen
        </button>
      </div>

      {/* Filters */}
      <div
        className="filters"
        style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
      >
        <select
        
          value={filters.opleiding}
          onChange={(e) => setFilters({ ...filters, opleiding: e.target.value })}
          aria-label="Filter op opleiding"
        ><option value="">Geen filter</option>
          {opleidingenOpties.map((optie, idx) => (
            <option key={idx} value={optie}>
              {optie === '' ? 'Filter op opleiding' : optie}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter op vaardigheden"
          value={filters.vaardigheid}
          onChange={(e) => setFilters({ ...filters, vaardigheid: e.target.value })}
          aria-label="Filter op vaardigheden"
        />

        <input
          type="text"
          placeholder="Filter op taal"
          value={filters.taal}
          onChange={(e) => setFilters({ ...filters, taal: e.target.value })}
          aria-label="Filter op taal"
        />
      </div>

      {/* Laden / lege staat / afspraken lijst */}
      {isLoading ? (
        <div className="loading-state" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p>Afspraken worden geladen...</p>
        </div>
      ) : filteredAfspraken.length === 0 ? (
        <div className="empty-state" role="alert">
          <FiCalendar className="empty-icon" size={48} />
          <h3>Geen afspraken gevonden</h3>
          <p>Pas de filters aan of vernieuw de lijst.</p>
          <button onClick={fetchAfspraken} className="refresh-btn">
            <FiRefreshCw /> Vernieuwen
          </button>
        </div>
      ) : (
        <div className="afspraken-grid">
          {filteredAfspraken.map((afspraak) => (
            <article key={afspraak.id} className={`afspraak-card ${afspraak.status}`}>
              {/* Header van de kaart */}
              <header className="card-header">
                <div className="student-info">
                  <h3>{afspraak.student_naam}</h3>
                  <span className="specialization">{afspraak.student_specialisatie}</span>
                </div>
                <span className={`status-badge ${afspraak.status}`}>
                  {afspraak.status.replace('-', ' ')}
                </span>
              </header>

              {/* Body met details */}
              <section className="card-body">
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
                <div className="detail-row">
                  <FiAward className="icon" />
                  <span>Taal: {afspraak.taal}</span>
                </div>
                {afspraak.opmerking && (
                  <div className="comment-section">
                    <FiAward className="icon" />
                    <p>{afspraak.opmerking}</p>
                  </div>
                )}
              </section>

              {/* Footer met acties en social links */}
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
                  <a href={afspraak.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub profiel van ${afspraak.student_naam}`}>
                    <FiGithub /> Profiel
                  </a>
                  <a href={afspraak.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn profiel van ${afspraak.student_naam}`}>
                    <FiLinkedin /> Profiel
                  </a>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AfspraakOverzicht;
