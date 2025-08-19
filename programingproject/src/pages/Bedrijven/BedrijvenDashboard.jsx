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
  FaExclamationCircle,
  FaTimes,
  FaCheck,
  FaUser,
  FaMoneyBill
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
  dashboardCards // Voeg dit toe
}) {
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'nieuwe_afspraak':
      case 'afspraak_goedgekeurd':
      case 'afspraak_afgewezen':
        return <FaCalendarAlt />;
      case 'afspraak_geannuleerd':
        return <FaTimes />;
      case 'betaling_ontvangen':
      case 'betaling_herinnering':
        return <FaMoneyBill />;
      case 'profiel_update':
        return <FaUser />;
      case 'systeem':
      default:
        return <FaBell />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'nieuwe_afspraak':
        return '#28a745'; // groen
      case 'afspraak_goedgekeurd':
        return '#007bff'; // blauw
      case 'afspraak_afgewezen':
      case 'afspraak_geannuleerd':
        return '#dc3545'; // rood
      case 'betaling_ontvangen':
        return '#28a745'; // groen
      case 'betaling_herinnering':
        return '#ffc107'; // geel
      case 'profiel_update':
        return '#6f42c1'; // paars
      default:
        return '#6c757d'; // grijs
    }
  };

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
                {notifications.filter(n => !n.gelezen).length > 0 && (
                  <span className="unread-count">
                    {notifications.filter(n => !n.gelezen).length} ongelezen
                  </span>
                )}
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
                              {notif.type.includes('afspraak') && notif.related_data.student_naam && (
                                <span>Student: {notif.related_data.student_naam}</span>
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
  <div 
    key={`event-${index}`} 
    className={`calendar-event ${event.highlight ? 'highlight-event' : ''}`}
  >

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
  const [betalingStatus, setBetalingStatus] = useState(null);
  const [afsprakenCount, setAfsprakenCount] = useState(0);
  const [aankomende_afspraken, setAankomende_afspraken] = useState([]);
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
        const resp = await apiClient.get(`/bedrijfprofiel/${gebruiker.id}`);
        const data = resp?.data ?? resp;
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

  // Fetch betaling status
  useEffect(() => {
    const fetchBetalingStatus = async () => {
      if (!gebruiker?.id || gebruiker?.type !== 'bedrijf') return;

      try {
        const resp = await apiClient.get(`/betaling/${gebruiker.id}`);
        const data = resp?.data ?? resp;
        setBetalingStatus(data);
      } catch (error) {
        console.error('Fout bij ophalen betaling status:', error);
      }
    };

    fetchBetalingStatus();
  }, [gebruiker]);

  // Fetch notifications functie (gebruik apiClient i.p.v. ongedefinieerde baseUrl)
  const fetchNotifications = async () => {
    if (!gebruiker?.id) return;

    try {
      const resp = await apiClient.get(`/afspraken/notifications/${gebruiker.id}/bedrijf`);
      const data = resp?.data ?? resp;
      setNotifications(Array.isArray(data) ? data : (data?.notifications || []));
    } catch (error) {
      console.error('Fout bij ophalen notifications:', error);
    }
  };

  // Refresh notifications functie
  const refreshNotifications = async () => {
    console.log('🔄 Manual refresh notifications triggered');
    await fetchNotifications();
  };

  // Fetch notifications on component mount and polling
  useEffect(() => {
    if (!gebruiker?.id) return;

    fetchNotifications();

    // Polling voor nieuwe meldingen elke 30 seconden
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [gebruiker]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/afspraken/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif.notification_id === notificationId
            ? { ...notif, gelezen: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Fout bij markeren notification:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(`/afspraken/notifications/${notificationId}`);
      setNotifications(prev =>
        prev.filter(notif => notif.notification_id !== notificationId)
      );
    } catch (error) {
      console.error('Fout bij verwijderen notification:', error);
    }
  };

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
    time: event.time?.split('-')[0]?.trim() || '09:00', // Fixed the time parsing
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

  // Fetch afspraken voor het bedrijf
  useEffect(() => {
    const fetchAfspraken = async () => {
      if (!gebruiker?.id || gebruiker?.type !== 'bedrijf') return;

      try {
        const resp = await apiClient.get(`/afspraken/bedrijf/${gebruiker.id}`);
        const data = resp?.data ?? resp;
        setAfspraken(data);
        setAfsprakenCount(Array.isArray(data) ? data.length : 0);
        
        // Filter aankomende afspraken (vandaag en later)
        const vandaag = new Date();
        vandaag.setHours(0, 0, 0, 0);
        
        const aankomend = (Array.isArray(data) ? data : []).filter(afspraak => {
          const afspraakDatum = new Date(afspraak.datum);
          return afspraakDatum >= vandaag;
        }).slice(0, 3); // Toon max 3 aankomende afspraken
        
        setAankomende_afspraken(aankomend);
      } catch (error) {
        console.error('Fout bij ophalen afspraken:', error);
      }
    };

    fetchAfspraken();
  }, [gebruiker]);

  // Helper functie voor betaling status
  const getBetalingStatusInfo = () => {
    if (!betalingStatus) return { color: '#gray', text: 'Laden...', niveau: '' };

    switch (betalingStatus.status) {
      case 'niet_betaald':
        return { 
          color: '#dc3545', 
          text: 'Betaling vereist', 
          niveau: betalingStatus.niveau,
          bedrag: `€${betalingStatus.openstaand_bedrag}` 
        };
      case 'gedeeltelijk_betaald':
        return { 
          color: '#ffc107', 
          text: 'Gedeeltelijk betaald', 
          niveau: betalingStatus.niveau,
          bedrag: `€${betalingStatus.openstaand_bedrag} openstaand` 
        };
      case 'volledig_betaald':
        return { 
          color: '#28a745', 
          text: 'Volledig betaald', 
          niveau: betalingStatus.niveau,
          bedrag: 'Geen openstaand bedrag' 
        };
      default:
        return { color: '#6c757d', text: 'Onbekend', niveau: '' };
    }
  };

  // Helper functie voor afspraken status
  const getAfsprakenStatusInfo = () => {
    const totaal = afspraken.length;
    const goedgekeurd = afspraken.filter(a => a.status === 'goedgekeurd').length;
    const in_afwachting = afspraken.filter(a => a.status === 'in_afwachting').length;
    const afgewezen = afspraken.filter(a => a.status === 'afgewezen').length;

    return { totaal, goedgekeurd, in_afwachting, afgewezen };
  };

  // Update dashboardCards met dynamische content
  const dashboardCards = [
    {
      title: "Staat van betaling",
      icon: <FaEuroSign className="icon-fix" />,
      onClick: () => navigate('/bedrijf/betaling'),
      iconClass: "bg-blue",
      isDynamic: true,
      content: () => {
        const statusInfo = getBetalingStatusInfo();
        return (
          <div className="card-dynamic-content">
            <div className="status-header">
              <span 
                className="status-badge"
                style={{ backgroundColor: statusInfo.color }}
              >
                {statusInfo.text}
              </span>
              <span className="niveau-badge">{statusInfo.niveau}</span>
            </div>
            <div className="amount-info">
              <div className="bedrag">{statusInfo.bedrag}</div>
              {betalingStatus && betalingStatus.status !== 'volledig_betaald' && (
                <div className="betaal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(betalingStatus.betaald_bedrag / betalingStatus.totaal_bedrag) * 100}%`,
                        backgroundColor: statusInfo.color
                      }}
                    ></div>
                  </div>
                  <small>
                    €{betalingStatus.betaald_bedrag} van €{betalingStatus.totaal_bedrag} betaald
                  </small>
                </div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      title: "Afspraakoverzicht",
      icon: <FaCalendarAlt className="icon-fix" />,
      onClick: () => navigate('/bedrijf/afspraken'),
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
                    <span className="student-naam">{afspraak.voornaam} {afspraak.studentnaam}</span>
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
      title: "Beschikbaarheid van standen",
      icon: <FaMapMarkerAlt className="icon-fix" />,
      description: "Controleer de beschikbaarheid van uw standplaatsen",
      onClick: () => navigate('/bedrijf/standen'),
      iconClass: "bg-orange",
      isSmall: true
    },
    {
      title: "Bedrijfsinstellingen",
      icon: <FaCog className="icon-fix" />,
      description: "Beheer uw bedrijfsinformatie en instellingen",
      onClick: () => navigate('/bedrijf/Settingsbedrijf'),
      iconClass: "bg-purple",
      isSmall: true
    }
  ];

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
        dashboardCards={dashboardCards} // Dit blijft
      />
    </div>
  );
}

export default BedrijvenDashboard;