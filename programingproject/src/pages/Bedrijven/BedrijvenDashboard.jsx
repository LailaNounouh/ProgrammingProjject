import React, { useState, useEffect, useRef } from 'react';
import {
  FaHome,
  FaEuroSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCog,
  FaChevronRight,
  FaSearch,
  FaBell,
  FaBars
} from 'react-icons/fa';
import './BedrijvenDashboard.css';
import { useNavigate } from 'react-router-dom';

function BedrijvenDashboard() {
  const navigate = useNavigate();
  const [bedrijfNaam, setBedrijfNaam] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('ingelogdeGebruiker'));
    if (user && user.type === 'bedrijf') {
      setBedrijfNaam(user.naam);
    }
  }, []);

  // Dashboard menu items
  const dashboardItems = [
    {
      title: 'Dashboard',
      icon: <FaHome />,
      description: 'Terug naar het hoofdmenu',
      action: 'Direct naar dashboard',
      onClick: () => navigate('/bedrijf/dashboard'),
      color: 'primary-blue'
    },
    {
      title: 'Staat van betaling',
      icon: <FaEuroSign />,
      description: 'Bekijk uw betalingsstatus en facturen',
      action: 'Direct naar staat van betaling',
      onClick: () => navigate('/bedrijf/betaling'),
      color: 'blue'
    },
    {
      title: 'Afspraakoverzicht',
      icon: <FaCalendarAlt />,
      description: 'Bekijk geplande afspraken',
      action: 'Direct naar afspraakoverzicht',
      onClick: () => navigate('/bedrijf/afspraken'),
      color: 'green'
    },
    {
      title: 'Beschikbaarheid van standen',
      icon: <FaMapMarkerAlt />,
      description: 'Beheer uw standlocaties en reserveringen',
      action: 'Direct naar beschikbaarheid van standen',
      onClick: () => navigate('/bedrijf/standen'),
      color: 'orange'
    },
    {
      title: 'Bedrijfsinstellingen',
      icon: <FaCog />,
      description: 'Beheer uw bedrijfsgegevens en voorkeuren',
      action: 'Direct naar bedrijfsinstellingen',
      onClick: () => navigate('/bedrijf/instellingen'),
      color: 'purple'
    }
  ];

  return (
    <>
      {/* --- MAIN DASHBOARD CONTAINER --- */}
      <div className="dashboard-container">
        {/* --- WRAPPER VOOR SIDEBAR EN HOOFDINHOUD --- */}
        <div className="main-content-wrapper">
          {/* --- SIDEBAR (SNELMENU) --- */}
         <aside className={`sidebar ${showMobileMenu ? 'active' : ''}`}>
  <h3>Snelmenu</h3>

  {/* Zoekbalk direct onder Snelmenu */}
  <div className="sidebar-search">
    <FaSearch className="search-icon" />
    <input
      type="text"
      placeholder="Zoeken..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Meldingenbel direct onder zoekbalk */}
  <div className="sidebar-notifications" ref={notificationRef}>
    <div
      className="notification-bell"
      onClick={() => setShowNotifications(!showNotifications)}
    >
      <FaBell />
      <span>Meldingen</span>
    </div>
    {showNotifications && (
      <div className="notifications-dropdown">
        <div className="notification-item">Geen nieuwe meldingen</div>
      </div>
    )}
  </div>

  {/* Menu-items */}
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


          {/* --- HOOFDINHOUD (MAIN CONTENT) --- */}
          <div className="main-content-area">
            <div className="welcome-banner">
              <div className="welcome-content">
                <h1>Welkom terug, {bedrijfNaam}!</h1>
                <p>Hier vindt u een overzicht van uw activiteiten en status</p>
              </div>
            </div>
            <div className="dashboard-cards-container">
              {dashboardItems.map((item, index) => (
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

        {/* --- OVERLAY VOOR MOBIEL MENU --- */}
        {showMobileMenu && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setShowMobileMenu(false)}
          ></div>
        )}
      </div>
    </>
  );
}

export default BedrijvenDashboard;