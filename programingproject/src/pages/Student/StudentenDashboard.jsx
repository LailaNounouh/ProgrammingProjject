import React, { useState, useEffect, useRef } from 'react';
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCog,
  FaChevronRight,
  FaSearch,
  FaBell,
  FaCalendarCheck,
  FaPlus,
  FaTrash,
  FaClock,
  FaExclamationCircle,
  FaBook,
  FaUserTie,
  FaBuilding,
  FaTimes,
  FaGraduationCap
} from 'react-icons/fa';
import './StudentenDashboard.css';
import { useNavigate, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/AuthProvider';

function DashboardContent({
  studentNaam,
  searchTerm,
  setSearchTerm,
  notifications,
  showNotifications,
  setShowNotifications,
  notificationRef,
  filteredCards,
  upcomingEvents,
  calendarDate,
  setCalendarDate,
  reminders,
  addReminder,
  deleteReminder,
  showReminderModal,
  setShowReminderModal,
  newReminder,
  setNewReminder,
  handleReminderSubmit,
  addEventReminder,
  studentAfspraken,
  verwijderAfspraak,
  isDeleting,
  interessanteBedrijven
}) {
  const navigate = useNavigate();
  
  return (
    <div className="studenten-dashboard-container">
      <div className="studenten-welcome-banner">
        <h1>Welkom terug, {studentNaam}!</h1>
        <p>Hier vind je een overzicht van je activiteiten en status</p>
      </div>

      <div className="studenten-dashboard-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Zoeken..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="notification-wrapper" ref={notificationRef}>
          <div
            className="notification-bell"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <ul>
                {notifications.length === 0 ? (
                  <li><p>Geen nieuwe meldingen</p></li>
                ) : (
                  notifications.map((notif) => (
                    <li key={notif.id}>
                      <p>{notif.message}</p>
                      <small>{new Date(notif.time).toLocaleString('nl-BE')}</small>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="studenten-dashboard-content">
        <div className="studenten-card-grid">
          {/* Afspraken kaart */}
          <div className="studenten-dashboard-card studenten-afspraken-card">
            <div className="studenten-card-header">
              <div className="studenten-card-icon studenten-bg-purple">
                <FaCalendarCheck className="icon-fix" />
              </div>
              <h3 className="studenten-card-title">Mijn Afspraken</h3>
            </div>
            
            {studentAfspraken.length === 0 ? (
              <p className="card-description">Je hebt nog geen afspraken gepland</p>
            ) : (
              <div className="studenten-mini-afspraken-lijst">
                {studentAfspraken.map((afspraak, index) => (
                  <div key={`mini-afspraak-${afspraak.afspraak_id || index}`} className="studenten-mini-afspraak">
                    <div className="studenten-mini-afspraak-bedrijf">
                      {afspraak.bedrijfsnaam}
                    </div>
                    <div className="studenten-mini-afspraak-details">
                      <span className="studenten-mini-afspraak-datum">
                        <FaCalendarAlt /> {new Date(afspraak.datum || '2026-03-13').toLocaleDateString('nl-NL')}
                      </span>
                      <span className="studenten-mini-afspraak-tijd">
                        <FaClock /> {afspraak.tijdslot || '10:00 - 10:30'}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          verwijderAfspraak(afspraak.afspraak_id);
                        }} 
                        className="delete-afspraak-btn"
                        disabled={isDeleting}
                        aria-label="Verwijder afspraak"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="card-footer" onClick={() => navigate('/student/afspraken')}>
              <span>Bekijk alle afspraken</span>
              <FaChevronRight className="chevron-icon" />
            </div>
          </div>
          
          {/* Interessante Bedrijven kaart */}
          <div className="studenten-dashboard-card studenten-interessante-bedrijven-card">
            <div className="studenten-card-header">
              <div className="studenten-card-icon studenten-bg-green">
                <FaGraduationCap className="icon-fix" />
              </div>
              <h3 className="studenten-card-title">Interessante Bedrijven</h3>
            </div>
            
            {interessanteBedrijven.length === 0 ? (
              <p className="card-description">Geen bedrijven gevonden voor jouw studierichting</p>
            ) : (
              <div className="studenten-mini-bedrijven-lijst">
                {interessanteBedrijven.map((bedrijf, index) => (
                  <div key={`mini-bedrijf-${bedrijf.bedrijf_id || index}`} className="studenten-mini-bedrijf">
                    <div className="studenten-mini-bedrijf-naam">
                      {bedrijf.naam}
                    </div>
                    <div className="studenten-mini-bedrijf-details">
                      <span className="studenten-mini-bedrijf-sector">
                        {bedrijf.sector_naam || 'Geen sector'}
                      </span>
                      {bedrijf.speeddates === 1 && (
                        <span className="studenten-mini-bedrijf-speeddate">
                          Speeddate beschikbaar
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="card-footer" onClick={() => navigate('/student/bedrijven')}>
              <span>Bekijk alle bedrijven</span>
              <FaChevronRight className="chevron-icon" />
            </div>
          </div>
          
          {filteredCards.map((card, index) => (
            <div key={index} className="studenten-dashboard-card" onClick={card.onClick}>
              <div className="studenten-card-header">
                <div className={`studenten-card-icon studenten-${card.iconClass}`}>
                  {card.icon}
                </div>
                <h3 className="studenten-card-title">{card.title}</h3>
              </div>
              {card.description && <p className="card-description">{card.description}</p>}
              <div className="card-footer">
                <span>Direct naar {card.title.toLowerCase()}</span>
                <FaChevronRight className="chevron-icon" />
              </div>
            </div>
          ))}
        </div>

        <div className="studenten-calendar-section">
          <div className="studenten-calendar-container">
            <div className="studenten-calendar-header">
              <h2>Kalender</h2>
              <button 
                className="add-reminder-btn"
                onClick={() => setShowReminderModal(true)}
              >
                <FaPlus /> Herinnering toevoegen
              </button>
            </div>
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              locale="nl-NL"
              tileContent={({ date, view }) => {
                const dayReminders = reminders.filter(r => 
                  new Date(r.date).toDateString() === date.toDateString()
                );
                const dayEvents = upcomingEvents.filter(event => 
                  event.date.toDateString() === date.toDateString()
                );
                
                return view === 'month' && (dayReminders.length > 0 || dayEvents.length > 0) ? (
                  <div className="calendar-marker-container">
                    {dayReminders.length > 0 && <div className="reminder-dot"></div>}
                    {dayEvents.length > 0 && <div className="event-dot"></div>}
                  </div>
                ) : null;
              }}
            />
            
            <div className="upcoming-events-container">
              <h3>Aankomende evenementen</h3>
              {upcomingEvents.length === 0 ? (
                <p className="no-events">Geen aankomende evenementen</p>
              ) : (
                <div className="events-list">
                  {upcomingEvents.map((event, index) => (
                    <div key={`event-${index}`} className="calendar-event">
                      <div className="event-time">
                        <FaCalendarCheck /> {event.date.toLocaleDateString('nl-NL')} • {event.time || 'Hele dag'}
                      </div>
                      <div className="event-text">
                        <strong>{event.title}</strong>
                        <p>{event.description}</p>
                        {event.deadline && (
                          <span className="deadline-badge">
                            <FaExclamationCircle /> DEADLINE
                          </span>
                        )}
                      </div>
                      <button 
                        className="add-reminder-event-btn"
                        onClick={() => addEventReminder(event)}
                      >
                        <FaPlus /> Herinnering
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="day-events">
              <h3>
                {calendarDate.toLocaleDateString('nl-NL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              {reminders.filter(r => 
                new Date(r.date).toDateString() === calendarDate.toDateString()
              ).map((reminder, index) => (
                <div key={index} className="studenten-reminder-item">
                  <div className="studenten-reminder-time">
                    <FaClock /> {reminder.time}
                  </div>
                  <div className="reminder-text">
                    {reminder.text}
                    <button 
                      onClick={() => deleteReminder(index)}
                      className="delete-reminder"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              
              {upcomingEvents.filter(event => 
                event.date.toDateString() === calendarDate.toDateString()
              ).map((event, index) => (
                <div key={`event-${index}`} className={`calendar-event ${event.highlight ? 'highlight-event' : ''}`}>
                  <div className="studenten-event-time">
                    <FaCalendarCheck /> {event.time || 'Hele dag'}
                  </div>
                  <div className="event-text">
                    <strong>{event.title}</strong>
                    <p>{event.description}</p>
                    {event.deadline && (
                      <span className="deadline-badge">
                        <FaExclamationCircle /> DEADLINE
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showReminderModal && (
        <div className="studenten-modal-overlay">
          <div className="studenten-reminder-modal">
            <h3>Nieuwe herinnering</h3>
            <form onSubmit={handleReminderSubmit}>
              <div className="studenten-form-group">
                <label>Datum</label>
                <input 
                  type="date" 
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({
                    ...newReminder,
                    date: e.target.value
                  })}
                  required
                />
              </div>
              <div className="studenten-form-group">
                <label>Tijd</label>
                <input 
                  type="time" 
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({
                    ...newReminder,
                    time: e.target.value
                  })}
                  required
                />
              </div>
              <div className="studenten-form-group">
                <label>Herinnering</label>
                <textarea
                  value={newReminder.text}
                  onChange={(e) => setNewReminder({
                    ...newReminder,
                    text: e.target.value
                  })}
                  required
                />
              </div>
              <div className="studenten-modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowReminderModal(false)}
                >
                  Annuleren
                </button>
                <button type="submit" className="save-btn">
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentenDashboard() {
  const { gebruiker } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [studentNaam, setStudentNaam] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    text: ''
  });
  const [studentAfspraken, setStudentAfspraken] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');
  const [error, setError] = useState('');
  const [interessanteBedrijven, setInteressanteBedrijven] = useState([]);
  const notificationRef = useRef(null);
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      date: new Date(2026, 2, 7), 
      title: "Deadline voor inschrijven Career Launch Day",
      description: "Laatste kans om je in te schrijven voor de Career Launch Day",
      time: "23:59",
      deadline: true,
      highlight: true
    },
    {
      date: new Date(2026, 2, 11),
      title: "Voorbereidingssessie voor studenten",
      description: "Informatiesessie over hoe je je het beste kan voorbereiden op de Career Launch Day",
      time: "14:00",
      highlight: true
    },
    {
      date: new Date(2026, 2, 13),
      title: "Career Launch Day",
      description: "Het belangrijkste recruitment event van het jaar",
      time: "09:00 - 17:00",
      highlight: true
    }
  ]);
  
  // Base URL voor API calls
  const baseUrl = 'http://10.2.160.211:3000/api';

  useEffect(() => {
    if (gebruiker?.naam) {
      setStudentNaam(gebruiker.naam);
      const savedReminders = localStorage.getItem(`reminders_${gebruiker.id}`);
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
      
      // Haal afspraken op voor deze student
      fetchStudentAfspraken(gebruiker.id);
      
      // Haal interessante bedrijven op voor deze student
      fetchInteressanteBedrijven(gebruiker.id);
    }
  }, [gebruiker]);

  // Functie om afspraken op te halen
  const fetchStudentAfspraken = async (studentId) => {
    try {
      const response = await fetch(`${baseUrl}/afspraken/student/${studentId}`);
      if (!response.ok) {
        // Geen foutmelding meer tonen, gewoon lege array gebruiken
        setStudentAfspraken([]);
        return;
      }
      const data = await response.json();
      
      // Sorteer afspraken op datum (nieuwste eerst)
      const sortedAfspraken = data.sort((a, b) => 
        new Date(a.datum) - new Date(b.datum)
      );
      
      setStudentAfspraken(sortedAfspraken);
      
      // Voeg afspraken toe aan upcomingEvents voor de kalender
      const afspraakEvents = sortedAfspraken.map(afspraak => ({
        date: new Date('2026-03-13'), // Vaste datum voor Career Launch Day
        title: `Afspraak met ${afspraak.bedrijfsnaam}`,
        description: `Sollicitatiegesprek`,
        time: afspraak.tijdslot || '10:00 - 10:30',
        highlight: true
      }));
      
      // Voeg afspraak events toe aan upcomingEvents
      setUpcomingEvents(prev => [...prev, ...afspraakEvents]);
      
    } catch (error) {
      console.error('Fout bij ophalen afspraken:', error);
      // Geen foutmelding meer tonen, gewoon lege array gebruiken
      setStudentAfspraken([]);
    }
  };

  // Functie om interessante bedrijven op te halen
  const fetchInteressanteBedrijven = async (studentId) => {
    try {
      // Haal eerst de studierichting van de student op
      let studierichting = "Bachelor Toegepaste Informatica"; // Standaard waarde
      
      try {
        const studentResponse = await fetch(`${baseUrl}/studenten/${studentId}`);
        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          if (studentData.studie) {
            studierichting = studentData.studie;
          }
        }
      } catch (error) {
        console.log("Kon studentgegevens niet ophalen, gebruik standaard studierichting");
      }
      
      // Haal alle bedrijven op
      const bedrijvenResponse = await fetch(`${baseUrl}/bedrijvenmodule`);
      if (!bedrijvenResponse.ok) {
        // Als API call faalt, gebruik lege array
        setInteressanteBedrijven([]);
        return;
      }
      
      const bedrijvenData = await bedrijvenResponse.json();
      
      // Filter bedrijven op basis van studierichting
      const gefilterdeBedrijven = bedrijvenData.filter(bedrijf => {
        if (!bedrijf.doelgroep_opleiding) return false;
        
        // Controleer of doelgroep_opleiding een string is en converteer naar array indien nodig
        let doelgroepen = [];
        if (typeof bedrijf.doelgroep_opleiding === 'string') {
          // Split de doelgroep_opleiding string op komma's of andere scheidingstekens
          doelgroepen = bedrijf.doelgroep_opleiding.split(/,|;/).map(d => d.trim().toLowerCase());
        } else if (Array.isArray(bedrijf.doelgroep_opleiding)) {
          // Als het al een array is, gebruik deze direct
          doelgroepen = bedrijf.doelgroep_opleiding.map(d => d.toLowerCase());
        }
        
        // Check of de studierichting van de student voorkomt in de doelgroepen
        return doelgroepen.some(doelgroep => 
          studierichting.toLowerCase().includes(doelgroep.toLowerCase()) || 
          doelgroep.toLowerCase().includes(studierichting.toLowerCase())
        );
      });
      
      // Beperk tot maximaal 5 bedrijven
      setInteressanteBedrijven(gefilterdeBedrijven.slice(0, 5));
      
    } catch (error) {
      console.error('Fout bij ophalen interessante bedrijven:', error);
      setInteressanteBedrijven([]);
    }
  };

  const verwijderAfspraak = async (afspraakId) => {
    if (!window.confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) {
      return;
    }
    
    setIsDeleting(true);
    setDeleteStatus('');
    
    try {
      const response = await fetch(`${baseUrl}/afspraken/${afspraakId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setStudentAfspraken(studentAfspraken.filter(afspraak => afspraak.afspraak_id !== afspraakId));
        setDeleteStatus('Afspraak succesvol verwijderd');
        
        setTimeout(() => {
          setDeleteStatus('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setDeleteStatus(`Fout bij verwijderen: ${errorData.message || 'Onbekende fout'}`);
      }
    } catch (error) {
      console.error('Fout bij verwijderen afspraak:', error);
      setDeleteStatus('Fout bij verbinding met de server');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addReminder = (reminder) => {
    const newReminders = [...reminders, reminder];
    setReminders(newReminders);
    
    if (gebruiker?.id) {
      localStorage.setItem(`reminders_${gebruiker.id}`, JSON.stringify(newReminders));
    }
    
    setShowReminderModal(false);
    setNewReminder({
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      text: ''
    });
  };

  const addEventReminder = (event) => {
    const reminder = {
      date: event.date.toISOString().split('T')[0],
      time: event.time?.split('-')[0].trim() || '09:00',
      text: `Herinnering: ${event.title} - ${event.description}`
    };
    
    addReminder(reminder);
  };

  const deleteReminder = (index) => {
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    setReminders(newReminders);
    
    if (gebruiker?.id) {
      localStorage.setItem(`reminders_${gebruiker.id}`, JSON.stringify(newReminders));
    }
  };

  const handleReminderSubmit = (e) => {
    e.preventDefault();
    addReminder(newReminder);
  };

  const dashboardCards = [
    {
      title: "Standen",
      icon: <FaMapMarkerAlt className="icon-fix" />,
      description: "Bekijk deelnemende bedrijven en hun stands",
      onClick: () => navigate('/student/cv'),
      iconClass: "bg-purple"
    },
    {
      title: "Account",
      icon: <FaUserGraduate className="icon-fix" />,
      description: "Beheer je accountinstellingen",
      onClick: () => navigate('/student/account'),
      iconClass: "bg-blue"
    },
  ];

  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="studenten-dashboard">
      {deleteStatus && <div className="status-message">{deleteStatus}</div>}
      
      <DashboardContent
        studentNaam={studentNaam}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notificationRef={notificationRef}
        filteredCards={filteredCards}
        upcomingEvents={upcomingEvents}
        calendarDate={calendarDate}
        setCalendarDate={setCalendarDate}
        reminders={reminders}
        addReminder={addReminder}
        deleteReminder={deleteReminder}
        showReminderModal={showReminderModal}
        setShowReminderModal={setShowReminderModal}
        newReminder={newReminder}
        setNewReminder={setNewReminder}
        handleReminderSubmit={handleReminderSubmit}
        addEventReminder={addEventReminder}
        studentAfspraken={studentAfspraken}
        verwijderAfspraak={verwijderAfspraak}
        isDeleting={isDeleting}
        interessanteBedrijven={interessanteBedrijven}
      />
    </div>
  );
}

export default StudentenDashboard;
