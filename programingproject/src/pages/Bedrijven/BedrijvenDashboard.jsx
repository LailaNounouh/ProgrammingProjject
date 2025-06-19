import React, { useState, useEffect, useRef } from 'react';
import { FaEuroSign, FaCalendarAlt, FaMapMarkerAlt, FaCog, FaChevronRight, FaSearch, FaBell } from 'react-icons/fa';
import './BedrijvenDashboard.css';
import { useNavigate } from 'react-router-dom';

function BedrijvenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [betalingen, setBetalingen] = useState([]);
  const [afspraken, setAfspraken] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [bedrijfNaam, setBedrijfNaam] = useState(''); // ✅ toegevoegd
  const notificationRef = useRef(null);

  useEffect(() => {
    // ✅ Haal bedrijfsnaam op uit localStorage
    const user = JSON.parse(localStorage.getItem('ingelogdeGebruiker'));
    if (user && user.type === 'bedrijf') {
      setBedrijfNaam(user.naam);
    }
  }, []);

<<<<<<< Updated upstream
  useEffect(() => {
    setBetalingen([{ id: 1, factuur: "F2023-0456", status: "Betaald", bedrag: 1200, datum: "20-04-2023" }]);
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

  const notifications = [
    { id: 1, message: "Student Lisa Janssens heeft een afspraak gemaakt voor 17 juni om 10:00.", time: "1 uur geleden" },
    { id: 2, message: "Factuur F2023-0457 moet nog betaald worden (Tom Peeters).", time: "2 uur geleden" }
  ];

  const dashboardCards = [
    {
      title: "Staat van betaling",
      icon: <FaEuroSign className="icon-fix" />,
      description: "Bekijk uw betalingsstatus en facturen",
=======
  const dashboardItems = [
    {
      title: 'Dashboard',
      icon: <FaHome />,
      description: 'Terug naar het hoofdmenu',
      action: 'Direct naar dashboard',
      onClick: () => navigate('/bedrijf/dashboard'),
      color: 'yellow'
    },
    {
      title: 'Staat van betaling',
      icon: <FaEuroSign />,
      description: 'Bekijk uw betalingsstatus and facturen',
      action: 'Direct naar staat van betaling',
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <h1>Welkom terug, {bedrijfNaam}!</h1> {/* ✅ Dynamisch */}
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
          <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <ul>
                {notifications.map((notif) => (
                  <li key={notif.id}>
                    <p>{notif.message}</p>
                    <small>{notif.time}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
=======
  return (
    <>
      <div className="dashboard-container">
        <button className="menu-toggle" onClick={() => setShowMobileMenu(true)}>
          <FaBars />
        </button>
        <div className="main-content-wrapper">
          <aside className={`sidebar ${showMobileMenu ? 'active' : ''}`}>
            <div className="sidebar-header">
              <h3>Dashboard</h3>
              <div className="sidebar-notification-toggle" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="notification-bell"
                  title="Meldingen"
                >
                  <FaBell />
                </button>
              </div>
            </div>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notification-item">Geen nieuwe meldingen</div>
              </div>
            )}
            <div className="sidebar-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Zoeken..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ul>
              {dashboardItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setShowMobileMenu(false);
                  }}
                >
                  <span className={`icon ${item.color}`}>{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </aside>
          <div className="main-content-area">
            <div className="welcome-banner">
              <div className="welcome-content">
                <h1>Welkom terug, {bedrijfNaam}!</h1>
                <p>Hier vindt u een overzicht van uw activiteiten en status</p>
              </div>
            </div>
            <div className="dashboard-cards-container">
              {dashboardItems
                .filter(item => item.title !== 'Dashboard')
                .map((item, index) => (
                  <div
                    key={index}
                    className="dashboard-card"
                    onClick={item.onClick}
                  >
                    <div className={`card-header ${item.color}`}>
                      {item.icon}
                      <h3>{item.title}</h3>
                    </div>
                    <div className="card-body">
                      <p>{item.description}</p>
                      <div className="card-action">
                        <span>{item.action}</span>
                        <FaChevronRight />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {showMobileMenu && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setShowMobileMenu(false)}
          ></div>
        )}
>>>>>>> Stashed changes
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

  return (
    <div className="bedrijven-dashboard">
      {renderDashboard()}
    </div>
  );
}

export default BedrijvenDashboard;
