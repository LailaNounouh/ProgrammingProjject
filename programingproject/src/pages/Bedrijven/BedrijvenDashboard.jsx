import React, { useState, useEffect, useRef } from 'react';
import {
  FaEuroSign,
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
  FaExclamationCircle
} from 'react-icons/fa';
import './BedrijvenDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import apiClient from '../../utils/apiClient';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function DashboardContent({
  bedrijfNaam,
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
  addEventReminder
}) {
  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <h1>Welkom terug, {bedrijfNaam}!</h1>
        <p>Hier vindt u een overzicht van uw activiteiten en status</p>
      </div>

      <div className="dashboard-toolbar">
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

      <div className="dashboard-content">
        <div className="card-grid">
          {filteredCards.map((card, index) => (
            <div key={index} className="dashboard-card" onClick={card.onClick}>
              <div className="card-header">
                <div className={`card-icon ${card.iconClass}`}>
                  {card.icon}
                </div>
                <h3 className="card-title">{card.title}</h3>
              </div>
              {card.description && <p className="card-description">{card.description}</p>}
              <div className="card-footer">
                <span>Direct naar {card.title.toLowerCase()}</span>
                <FaChevronRight className="chevron-icon" />
              </div>
            </div>
          ))}
        </div>

        <div className="calendar-section">
          <div className="calendar-container">
            <div className="calendar-header">
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
                <div key={index} className="reminder-item">
                  <div className="reminder-time">
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
                  <div className="event-time">
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
        <div className="modal-overlay">
          <div className="reminder-modal">
            <h3>Nieuwe herinnering</h3>
            <form onSubmit={handleReminderSubmit}>
              <div className="form-group">
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
              <div className="form-group">
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
              <div className="form-group">
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
              <div className="modal-actions">
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

function BedrijvenDashboard() {
  const navigate = useNavigate();
  const { gebruiker } = useAuth();
  const [betalingen, setBetalingen] = useState([]);
  const [afspraken, setAfspraken] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [bedrijfNaam, setBedrijfNaam] = useState('');
  const [bedrijfData, setBedrijfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    text: ''
  });
  const notificationRef = useRef(null);

  const upcomingEvents = [
    {
      date: new Date(2026, 2, 7), 
      title: "Deadline voor inschrijven en stand reserveren",
      description: "Laatste kans om uw stand te reserveren voor de Career Launch Day",
      time: "23:59",
      deadline: true,
      highlight: true
    },
    {
      date: new Date(2026, 2, 11),
      title: "Online briefing voor bedrijven",
      description: "Informatiesessie over het verloop van de Career Launch Day",
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
  ];

  // Fetch company data when component mounts
  useEffect(() => {
    const fetchBedrijfData = async () => {
      if (!gebruiker?.id || gebruiker?.type !== 'bedrijf') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiClient.get(`/bedrijfprofiel/${gebruiker.id}`);

        setBedrijfData(data);
        setBedrijfNaam(data.naam || gebruiker.naam || 'Bedrijf');
   try {
        const saved = localStorage.getItem(`reminders_${gebruiker.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setReminders(parsed);
          }
        }
      } catch (error) {
        console.error("Fout bij lezen van herinneringen:", error);
      }

    } catch (error) {
      console.error('Fout bij ophalen bedrijfsgegevens:', error);
      setBedrijfNaam(gebruiker.naam || 'Bedrijf');
    } finally {
      setLoading(false);
    }
  };

    fetchBedrijfData();
  }, [gebruiker]);

  useEffect(() => {
    setBetalingen([
      { id: 1, factuur: "F2023-0456", status: "Betaald", bedrag: 1200, datum: "20-04-2023" }
    ]);
    setAfspraken([
      { id: 1, student: "Lisa Janssens", type: "Afspraak", datum: "2025-06-17", tijd: "10:00" },
      { id: 2, student: "Tom Peeters", type: "Betaling vereist", bedrag: 800, factuur: "F2023-0457" }
    ]);
  }, []);

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

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!gebruiker?.id || gebruiker?.type !== 'bedrijf') {
        return;
      }

      try {
        const data = await apiClient.get(`/notifications/${gebruiker.id}`);
        setNotifications(data);
      } catch (error) {
        console.error('Fout bij ophalen meldingen:', error);
        // Set some default notifications for demo
        setNotifications([
          {
            id: 1,
            message: 'Welkom bij Career Launch Day!',
            time: new Date().toISOString()
          }
        ]);
      }
    };

    fetchNotifications();
  }, [gebruiker]);

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
  setNewReminder({
    date: event.date.toISOString().split('T')[0],
    time: event.time?.split('-')[0].trim() || '09:00',
    text: `Herinnering: ${event.title} - ${event.description}`
  });
  setShowReminderModal(true);
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
    title: "Staat van betaling",
    icon: <FaEuroSign className="icon-fix" />,
    description: "Bekijk uw huidige betaalstatus, openstaande bedragen\nen download eenvoudig uw facturen en betalingsbewijzen.",
    onClick: () => navigate('/bedrijf/betaling'),
    iconClass: "bg-blue"
  },
  {
    title: "Afspraakoverzicht",
    icon: <FaCalendarAlt className="icon-fix" />,
    description: "Overzicht van al uw geplande afspraken met klanten of\npartners. Plan nieuwe afspraken of wijzig bestaande.",
    onClick: () => navigate('/bedrijf/afspraken'),
    iconClass: "bg-green",
    showAfspraken: true
  },
  {
    title: "Beschikbaarheid van standen",
    icon: <FaMapMarkerAlt className="icon-fix" />,
    description: "Controleer de beschikbaarheid van uw standplaatsen,\nreserveer locaties en beheer uw bestaande boekingen.",
    onClick: () => navigate('/bedrijf/standen'),
    iconClass: "bg-orange"
  },
  {
    title: "Bedrijfsinstellingen",
    icon: <FaCog className="icon-fix" />,
    description: "Beheer uw bedrijfsinformatie, contactgegevens,\nvoorkeursinstellingen en toegangsrechten voor medewerkers.",
    onClick: () => navigate('/bedrijf/Settingsbedrijf'),
    iconClass: "bg-purple"
  }
];

  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="bedrijven-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Bedrijfsgegevens worden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bedrijven-dashboard">
      <DashboardContent
        bedrijfNaam={bedrijfNaam}
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
      />
    </div>
  );
}

export default BedrijvenDashboard;