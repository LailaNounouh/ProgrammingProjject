import React, { useState, useEffect, useRef } from 'react';
import {
  FaEuroSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCog,
  FaChevronRight,
  FaSearch,
  FaBell
} from 'react-icons/fa';
import './BedrijvenDashboard.css';
import { useNavigate } from 'react-router-dom';

// ✅ Nieuwe herbruikbare subcomponent
function DashboardContent({
  bedrijfNaam,
  searchTerm,
  setSearchTerm,
  notifications,
  showNotifications,
  setShowNotifications,
  notificationRef,
  filteredCards
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
            {card.showAfspraken && (
              <p className="card-description">Bekijk geplande afspraken</p>
            )}
            <div className="card-footer">
              <span>Direct naar {card.title.toLowerCase()}</span>
              <FaChevronRight className="chevron-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BedrijvenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [betalingen, setBetalingen] = useState([]);
  const [afspraken, setAfspraken] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [bedrijfNaam, setBedrijfNaam] = useState('');
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  // ✅ Haal bedrijfsnaam veilig uit localStorage
  useEffect(() => {
    const userString = localStorage.getItem('ingelogdeGebruiker');
    const user = userString ? JSON.parse(userString) : null;

    if (user?.type === 'bedrijf') {
      setBedrijfNaam(user.naam);
    }
  }, []);

  // Voor demo
  useEffect(() => {
    setBetalingen([
      { id: 1, factuur: "F2023-0456", status: "Betaald", bedrag: 1200, datum: "20-04-2023" }
    ]);
    setAfspraken([
      { id: 1, student: "Lisa Janssens", type: "Afspraak", datum: "2025-06-17", tijd: "10:00" },
      { id: 2, student: "Tom Peeters", type: "Betaling vereist", bedrag: 800, factuur: "F2023-0457" }
    ]);
  }, []);

  // ✅ Klik buiten dropdown sluit notificaties
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

  // ✅ Meldingen ophalen op nette manier
  useEffect(() => {
    const userString = localStorage.getItem('ingelogdeGebruiker');
    const user = userString ? JSON.parse(userString) : null;
    const bedrijfId = user?.id;

    if (user?.type === 'bedrijf' && bedrijfId) {
      fetch(`/api/notifications/${bedrijfId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Netwerkfout bij ophalen meldingen');
          }
          return res.json();
        })
        .then(data => setNotifications(data))
        .catch(err => console.error('Fout bij ophalen meldingen:', err));
    }
  }, []);

  const dashboardCards = [
    {
      title: "Staat van betaling",
      icon: <FaEuroSign className="icon-fix" />,
      description: "Bekijk uw betalingsstatus en facturen",
      onClick: () => navigate('/bedrijf/betaling'),
      iconClass: "bg-blue"
    },
    {
      title: "Afspraakoverzicht",
      icon: <FaCalendarAlt className="icon-fix" />,
      onClick: () => navigate('/bedrijf/afspraken'),
      iconClass: "bg-green",
      showAfspraken: true
    },
    {
      title: "Beschikbaarheid van standen",
      icon: <FaMapMarkerAlt className="icon-fix" />,
      description: "Beheer uw standlocaties en reserveringen",
      onClick: () => setActiveTab('standen'),
      iconClass: "bg-orange"
    },
    {
      title: "Bedrijfsinstellingen",
      icon: <FaCog className="icon-fix" />,
      description: "Beheer uw bedrijfsgegevens en voorkeuren",
      onClick: () => navigate('/bedrijf/Settingsbedrijf'),
      iconClass: "bg-purple"
    }
  ];

  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      />
    </div>
  );
}

export default BedrijvenDashboard;
