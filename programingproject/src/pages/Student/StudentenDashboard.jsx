import React, { useState, useEffect, useRef } from 'react';
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronRight,
  FaSearch,
  FaBell,
  FaCalendarCheck,
  FaPlus,
  FaTrash,
  FaClock,
  FaExclamationCircle,
  FaBuilding,
  FaBolt,
  FaTimes,
  FaCheck,
  FaUser,
  FaCog,
  FaGraduationCap
} from 'react-icons/fa';
import './StudentenDashboard.css';
import { useNavigate, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/AuthProvider';
import apiClient from '../../utils/apiClient';

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
  interessanteBedrijven,
  markNotificationAsRead,
  deleteNotification,
  refreshNotifications
}) {
  const navigate = useNavigate();

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

      <div className="studenten-dashboard-content">
        <div className="studenten-card-grid">
          <div className="studenten-dashboard-card studenten-afspraken-card">
            <div className="studenten-card-header">
              <div className="studenten-card-icon studenten-bg-purple">
                <FaCalendarCheck className="icon-fix" />
              </div>
              <h3>Mijn Afspraken</h3>
            </div>
            {studentAfspraken.length === 0 ? (
              <p className="card-description">Je hebt nog geen afspraken gepland</p>
            ) : (
              <div className="studenten-mini-afspraken-lijst">
                {studentAfspraken.map((afspraak, index) => (
                  <div key={`mini-afspraak-${afspraak.afspraak_id || index}`} className="studenten-mini-afspraak">
                    <div className="studenten-mini-afspraak-details">
                      <span className="studenten-mini-afspraak-bedrijfsnaam">
                        <FaBuilding /> {afspraak.bedrijfsnaam || 'Onbekend Bedrijf'}
                      </span>
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

          <div className="studenten-dashboard-card studenten-interessante-bedrijven-card">
            <div className="studenten-card-header">
              <div className="studenten-card-icon studenten-bg-green">
                <FaBuilding className="icon-fix" />
              </div>
              <h3 className="studenten-card-title">Interessante Bedrijven</h3>
            </div>

            {interessanteBedrijven.length === 0 ? (
              <p className="card-description">
                Geen bedrijven gevonden die matchen met jouw studierichting.
              </p>
            ) : (
              <div className="studenten-mini-bedrijven-lijst">
                {interessanteBedrijven.map((bedrijf, index) => (
                  <div
                    key={`mini-bedrijf-${bedrijf.bedrijf_id || index}`}
                    className="studenten-mini-bedrijf"
                  >
                    <Link to={`/student/bedrijven/${bedrijf.bedrijf_id}`} className="studenten-mini-bedrijf-link">
                      <div className="studenten-mini-bedrijf-naam">
                        {bedrijf.naam}
                      </div>
                      <div className="studenten-mini-bedrijf-details">
                        {bedrijf.sector_naam && (
                          <span className="studenten-mini-bedrijf-sector">
                            {bedrijf.sector_naam}
                          </span>
                        )}
                        {bedrijf.speeddates === 1 && (
                          <span className="studenten-mini-bedrijf-speeddate">
                            <FaBolt /> Speeddate beschikbaar
                          </span>
                        )}
                      </div>
                    </Link>
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
  const [interessanteBedrijven, setInteressanteBedrijven] = useState([]);
  const notificationRef = useRef(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const baseUrl = 'http://10.2.160.211:3000/api';

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

  // Fetch notifications on component mount and polling
  useEffect(() => {
    fetchNotifications();

    // Polling voor nieuwe meldingen elke 30 seconden
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [gebruiker]);

  useEffect(() => {
    if (gebruiker?.id) {
      setStudentNaam(gebruiker.naam);
      const savedReminders = localStorage.getItem(`reminders_${gebruiker.id}`);
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
      fetchStudentAfspraken(gebruiker.id);
      fetchInteressanteBedrijven(gebruiker.id);
    }
  }, [gebruiker]);

  const fetchStudentAfspraken = async (studentId) => {
    try {
      const response = await fetch(`${baseUrl}/afspraken/student/${studentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const gesorteerdeAfspraken = data.sort((a, b) => {
        return new Date(b.datum) - new Date(a.datum);
      });
      const enrichedAfspraken = gesorteerdeAfspraken.map(afspraak => ({
        ...afspraak,
        bedrijfsnaam: afspraak.bedrijfsnaam || afspraak.bedrijf_naam || 'Onbekend',
      }));
      setStudentAfspraken(enrichedAfspraken.slice(0, 5));
      const events = enrichedAfspraken.map(afspraak => ({
        id: afspraak.afspraak_id,
        title: `Afspraak met ${afspraak.bedrijfsnaam}`,
        description: afspraak.notities || 'Geen beschrijving',
        date: new Date(afspraak.datum),
        time: afspraak.tijd,
        type: 'afspraak',
      }));
      setUpcomingEvents(events);
    } catch (error) {
      setStudentAfspraken([]);
    }
  };

  const fetchInteressanteBedrijven = async (studentId) => {
    try {
      let studierichting = gebruiker?.studie || '';
      if (!studierichting) {
        try {
          const studentResponse = await fetch(`${baseUrl}/users/${studentId}`);
          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            studierichting = studentData.studie || '';
          } else {
            const altResponse = await fetch(`${baseUrl}/studenten/profiel/${studentId}`);
            if (altResponse.ok) {
              const altData = await altResponse.json();
              studierichting = altData.studie || '';
            }
          }
        } catch (error) {}
      }
      if (!studierichting) {
        studierichting = "Informatica";
      }
      const bedrijvenResponse = await fetch(`${baseUrl}/bedrijvenmodule`);
      if (!bedrijvenResponse.ok) {
        throw new Error(`HTTP error! status: ${bedrijvenResponse.status}`);
      }
      const bedrijvenData = await bedrijvenResponse.json();
      const matchendeBedrijven = bedrijvenData.filter(bedrijf => {
        if (!bedrijf.doelgroep_opleiding) return false;
        const doelgroepen = bedrijf.doelgroep_opleiding
          .split(',')
          .map(d => d.trim().toLowerCase())
          .filter(d => d.length > 0);
        const studentRichting = studierichting.toLowerCase();
        const match = doelgroepen.some(doelgroep =>
          studentRichting.includes(doelgroep) ||
          doelgroep.includes(studentRichting)
        );
        return match;
      });
      setInteressanteBedrijven(matchendeBedrijven.slice(0, 5));
    } catch (error) {
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
      onClick: () => navigate('/student/standen'),
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
        markNotificationAsRead={markNotificationAsRead}
        deleteNotification={deleteNotification}
        refreshNotifications={refreshNotifications}
      />
    </div>
  );
}

export default StudentenDashboard;