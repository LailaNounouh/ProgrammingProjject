import React, { useState, useEffect, useRef } from 'react';
import {
  FaUser,
  FaCalendarAlt,
  FaBuilding,
  FaCog,
  FaChevronRight,
  FaSearch,
  FaBell,
  FaCalendarCheck,
  FaPlus,
  FaTrash,
  FaClock,
  FaExclamationCircle,
  FaTimes,
  FaCheck,
  FaMoneyBill,
  FaGraduationCap
} from 'react-icons/fa';
import './StudentenDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import apiClient from '../../utils/apiClient';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function DashboardContent({
  studentNaam,
  searchTerm,
  setSearchTerm,
  notifications,
  showNotifications,
  setShowNotifications,
  notificationRef,
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
  markNotificationAsRead,
  deleteNotification,
  refreshNotifications,
  dashboardCards
}) {
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'nieuwe_afspraak':
      case 'afspraak_goedgekeurd':
      case 'afspraak_afgewezen':
      case 'afspraak_aangevraagd':
        return <FaCalendarAlt />;
      case 'afspraak_geannuleerd':
        return <FaTimes />;
      case 'bedrijf_geinteresseerd':
        return <FaBuilding />;
      case 'profiel_update':
        return <FaUser />;
      case 'career_launch_update':
        return <FaGraduationCap />;
      case 'systeem':
      default:
        return <FaBell />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'afspraak_goedgekeurd':
      case 'bedrijf_geinteresseerd':
        return '#28a745'; // groen
      case 'afspraak_aangevraagd':
      case 'career_launch_update':
        return '#007bff'; // blauw
      case 'afspraak_afgewezen':
      case 'afspraak_geannuleerd':
        return '#dc3545'; // rood
      case 'profiel_update':
        return '#6f42c1'; // paars
      case 'nieuwe_afspraak':
        return '#17a2b8'; // cyan
      default:
        return '#6c757d'; // grijs
    }
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <h1>Welkom terug, {studentNaam}!</h1>
        <p>Hier vindt u een overzicht van uw activiteiten en afspraken</p>
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
            {notifications.filter(n => !n.gelezen).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => !n.gelezen).length}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Meldingen</h4>
                <div className="notification-header-actions">
                  <button 
                    className="refresh-notifications-btn"
                    onClick={refreshNotifications}
                    title="Ververs meldingen"
                  >
                    🔄
                  </button>
                  {notifications.filter(n => !n.gelezen).length > 0 && (
                    <span className="unread-count">
                      {notifications.filter(n => !n.gelezen).length} ongelezen
                    </span>
                  )}
                </div>
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <p>Geen meldingen</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notif) => (
                    <div 
                      key={notif.notification_id} 
                      className={`notification-item ${!notif.gelezen ? 'unread' : 'read'}`}
                    >
                      <div className="notification-content">
                        <div 
                          className="notification-icon"
                          style={{ color: getNotificationColor(notif.type) }}
                        >
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="notification-text">
                          <p className="notification-message">{notif.bericht}</p>
                          <small className="notification-time">
                            {new Date(notif.created_at).toLocaleString('nl-BE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                          {notif.related_data && (
                            <div className="notification-details">
                              {notif.type.includes('afspraak') && notif.related_data.bedrijf_naam && (
                                <span>Bedrijf: {notif.related_data.bedrijf_naam}</span>
                              )}
                              {notif.related_data.tijdslot && (
                                <span>Tijdslot: {notif.related_data.tijdslot}</span>
                              )}
                              {notif.related_data.datum && (
                                <span>Datum: {new Date(notif.related_data.datum).toLocaleDateString('nl-BE')}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="notification-actions">
                        {!notif.gelezen && (
                          <button
                            className="mark-read-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationAsRead(notif.notification_id);
                            }}
                            title="Markeer als gelezen"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          className="delete-notification-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.notification_id);
                          }}
                          title="Verwijder melding"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 10 && (
                <div className="notification-footer">
                  <button className="view-all-btn">
                    Alle meldingen bekijken ({notifications.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card-grid">
          {dashboardCards.filter(card =>
            card.title.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((card, index) => (
            <div 
              key={index} 
              className={`dashboard-card ${card.isSmall ? 'small-card' : ''} ${card.isDynamic ? 'dynamic-card' : ''}`} 
              onClick={card.onClick}
            >
              <div className="card-header">
                <div className={`card-icon ${card.iconClass}`}>
                  {card.icon}
                </div>
                <h3 className="card-title">{card.title}</h3>
              </div>
              
              {card.isDynamic && card.content ? (
                card.content()
              ) : (
                <>
                  {card.description && <p className="card-description">{card.description}</p>}
                  <div className="card-footer">
                    <span>Direct naar {card.title.toLowerCase()}</span>
                    <FaChevronRight className="chevron-icon" />
                  </div>
                </>
              )}
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
  const navigate = useNavigate();
  const { gebruiker } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [studentNaam, setStudentNaam] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [afspraken, setAfspraken] = useState([]);
  const [aankomende_afspraken, setAankomende_afspraken] = useState([]);
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
      title: "Deadline voor afspraken maken",
      description: "Laatste kans om afspraken in te plannen voor de Career Launch Day",
      time: "23:59",
      deadline: true,
      highlight: true
    },
    {
      date: new Date(2026, 2, 11),
      title: "Online voorbereiding voor studenten",
      description: "Tips en tricks voor een succesvol gesprek met bedrijven",
      time: "14:00",
      highlight: true
    },
    {
      date: new Date(2026, 2, 13),
      title: "Career Launch Day",
      description: "Ontmoet je toekomstige werkgever!",
      time: "09:00 - 17:00",
      highlight: true
    }
  ];

  // Fetch student data when component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!gebruiker?.id || gebruiker?.type !== 'student') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiClient.get(`/profiel/id/${gebruiker.id}`);
        setStudentData(data);
        setStudentNaam(`${data.voornaam} ${data.naam}` || gebruiker.naam || 'Student');
        
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
        console.error('Fout bij ophalen studentgegevens:', error);
        setStudentNaam(gebruiker.naam || 'Student');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [gebruiker]);

  // Fetch notifications function
  const fetchNotifications = async () => {
    if (!gebruiker?.id || gebruiker?.type !== 'student') {
      return;
    }

    try {
      console.log('🔄 Fetching notifications for student:', gebruiker.id);
      const data = await apiClient.get(`/notifications/student/${gebruiker.id}`);
      console.log('✅ Student notifications received:', data);
      setNotifications(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error('Fout bij ophalen student meldingen:', error);
      setNotifications([]);
    }
  };

  // Refresh notifications function
  const refreshNotifications = async () => {
    console.log('🔄 Manual refresh student notifications triggered');
    await fetchNotifications();
  };

  // Fetch notifications on component mount and polling
  useEffect(() => {
    fetchNotifications();

    // Polling voor nieuwe meldingen elke 30 seconden
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [gebruiker]);

  // Fetch afspraken voor de student
  useEffect(() => {
    const fetchAfspraken = async () => {
      if (!gebruiker?.id || gebruiker?.type !== 'student') return;

      try {
        const data = await apiClient.get(`/afspraken/student/${gebruiker.id}`);
        setAfspraken(data);
        
        // Filter aankomende afspraken (vandaag en later)
        const vandaag = new Date();
        vandaag.setHours(0, 0, 0, 0);
        
        const aankomend = data.filter(afspraak => {
          const afspraakDatum = new Date(afspraak.datum);
          return afspraakDatum >= vandaag;
        }).slice(0, 3); // Toon max 3 aankomende afspraken
        
        setAankomende_afspraken(aankomend);
      } catch (error) {
        console.error('Fout bij ophalen student afspraken:', error);
      }
    };

    fetchAfspraken();
  }, [gebruiker]);

  // Notification handlers
  const markNotificationAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.notification_id === notificationId 
            ? { ...notif, gelezen: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Fout bij markeren als gelezen:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
      
      setNotifications(prev => 
        prev.filter(notif => notif.notification_id !== notificationId)
      );
    } catch (error) {
      console.error('Fout bij verwijderen melding:', error);
    }
  };

  // Helper functies voor dashboard cards
  const getAfsprakenStatusInfo = () => {
    const totaal = afspraken.length;
    const goedgekeurd = afspraken.filter(a => a.status === 'goedgekeurd').length;
    const in_afwachting = afspraken.filter(a => a.status === 'in_afwachting').length;
    const afgewezen = afspraken.filter(a => a.status === 'afgewezen').length;

    return { totaal, goedgekeurd, in_afwachting, afgewezen };
  };

  const getProfielCompletenessInfo = () => {
    if (!studentData) return { percentage: 0, missing: [] };

    const requiredFields = [
      { field: 'voornaam', label: 'Voornaam' },
      { field: 'naam', label: 'Achternaam' },
      { field: 'email', label: 'Email' },
      { field: 'telefoon', label: 'Telefoon' },
      { field: 'studie', label: 'Studie' },
      { field: 'aboutMe', label: 'Over mij' },
      { field: 'linkedin_url', label: 'LinkedIn' },
      { field: 'github_url', label: 'GitHub' }
    ];

    const completed = requiredFields.filter(field => 
      studentData[field.field] && studentData[field.field].toString().trim() !== ''
    ).length;

    const percentage = Math.round((completed / requiredFields.length) * 100);
    const missing = requiredFields.filter(field => 
      !studentData[field.field] || studentData[field.field].toString().trim() === ''
    );

    return { percentage, missing, total: requiredFields.length, completed };
  };

  // Update dashboardCards met dynamische content voor studenten
  const dashboardCards = [
    {
      title: "Mijn Profiel",
      icon: <FaUser className="icon-fix" />,
      onClick: () => navigate('/student/profiel'),
      iconClass: "bg-blue",
      isDynamic: true,
      content: () => {
        const profielInfo = getProfielCompletenessInfo();
        return (
          <div className="card-dynamic-content">
            <div className="profiel-completeness">
              <div className="completeness-header">
                <span className="completeness-percentage">{profielInfo.percentage}%</span>
                <span className="completeness-label">Compleet</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${profielInfo.percentage}%`,
                    backgroundColor: profielInfo.percentage >= 80 ? '#28a745' : 
                                   profielInfo.percentage >= 60 ? '#ffc107' : '#dc3545'
                  }}
                ></div>
              </div>
              <div className="profiel-stats">
                <small>
                  {profielInfo.completed} van {profielInfo.total} velden ingevuld
                </small>
                {profielInfo.missing.length > 0 && (
                  <div className="missing-fields">
                    <small>Ontbreekt: {profielInfo.missing.slice(0, 3).map(f => f.label).join(', ')}</small>
                    {profielInfo.missing.length > 3 && (
                      <small>...en {profielInfo.missing.length - 3} meer</small>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      title: "Mijn Afspraken",
      icon: <FaCalendarAlt className="icon-fix" />,
      onClick: () => navigate('/student/afspraken'),
      iconClass: "bg-green",
      isDynamic: true,
      content: () => {
        const statusInfo = getAfsprakenStatusInfo();
        return (
          <div className="card-dynamic-content">
            <div className="afspraken-summary">
              <div className="totaal-afspraken">
                <span className="big-number">{statusInfo.totaal}</span>
                <span className="label">Totale afspraken</span>
              </div>
              <div className="afspraken-stats">
                <div className="stat-item">
                  <span className="stat-number goedgekeurd">{statusInfo.goedgekeurd}</span>
                  <span className="stat-label">Goedgekeurd</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number in-afwachting">{statusInfo.in_afwachting}</span>
                  <span className="stat-label">In afwachting</span>
                </div>
                {statusInfo.afgewezen > 0 && (
                  <div className="stat-item">
                    <span className="stat-number afgewezen">{statusInfo.afgewezen}</span>
                    <span className="stat-label">Afgewezen</span>
                  </div>
                )}
              </div>
            </div>
            {aankomende_afspraken.length > 0 && (
              <div className="aankomende-afspraken">
                <h5>Aankomende afspraken:</h5>
                {aankomende_afspraken.map((afspraak, index) => (
                  <div key={index} className="mini-afspraak">
                    <span className="bedrijf-naam">{afspraak.bedrijfsnaam}</span>
                    <span className="afspraak-tijd">
                      {new Date(afspraak.datum).toLocaleDateString('nl-BE')} - {afspraak.tijdslot}
                    </span>
                    <span className={`status-mini ${afspraak.status}`}>
                      {afspraak.status === 'goedgekeurd' ? '✓' : 
                       afspraak.status === 'in_afwachting' ? '⏳' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: "Bedrijven Ontdekken",
      icon: <FaBuilding className="icon-fix" />,
      description: "Bekijk alle deelnemende bedrijven en maak afspraken",
      onClick: () => navigate('/student/bedrijven'),
      iconClass: "bg-orange",
      isSmall: true
    },
    {
      title: "Instellingen",
      icon: <FaCog className="icon-fix" />,
      description: "Beheer uw accountinstellingen en voorkeuren",
      onClick: () => navigate('/student/instellingen'),
      iconClass: "bg-purple",
      isSmall: true
    }
  ];

  // Reminder handlers (blijven hetzelfde)
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
      time: event.time?.split('-')[0]?.trim() || '09:00',
      text: `Herinnering: ${event.title} - ${event.description}`,
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

  // Click outside handler
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

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="studenten-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Studentgegevens worden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="studenten-dashboard">
      <DashboardContent
        studentNaam={studentNaam}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notificationRef={notificationRef}
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
        markNotificationAsRead={markNotificationAsRead}
        deleteNotification={deleteNotification}
        refreshNotifications={refreshNotifications}
        dashboardCards={dashboardCards}
      />
    </div>
  );
}

export default StudentenDashboard;