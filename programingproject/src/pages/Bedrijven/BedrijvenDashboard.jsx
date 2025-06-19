import React, { useState, useEffect, useRef } from 'react';
import {
  FaEuroSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCog,
  FaChevronRight,
  FaSearch,
  FaBell,
  FaBars
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './BedrijvenDashboard.css';

function BedrijvenDashboard() {
  const navigate = useNavigate();
  const [bedrijfNaam, setBedrijfNaam] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('ingelogdeGebruiker'));
    if (user?.type === 'bedrijf') {
      setBedrijfNaam(user.naam);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dashboardItems = [
    {
      title: 'Staat van betaling',
      icon: <FaEuroSign />,
      description: 'Bekijk uw betalingsstatus en facturen',
      action: 'Direct naar staat van betaling',
      onClick: () => {
        navigate('/bedrijf/betaling');
        setShowMobileMenu(false);
      },
      color: 'blue'
    },
    {
      title: 'Afspraakoverzicht',
      icon: <FaCalendarAlt />,
      description: 'Bekijk geplande afspraken',
      action: 'Direct naar afspraakoverzicht',
      onClick: () => {
        navigate('/bedrijf/afspraken');
        setShowMobileMenu(false);
      },
      color: 'green'
    },
    {
      title: 'Beschikbaarheid van standen',
      icon: <FaMapMarkerAlt />,
      description: 'Beheer uw standlocaties en reserveringen',
      action: 'Direct naar beschikbaarheid van standen',
      onClick: () => {
        navigate('/bedrijf/standen');
        setShowMobileMenu(false);
      },
      color: 'orange'
    },
    {
      title: 'Bedrijfsinstellingen',
      icon: <FaCog />,
      description: 'Beheer uw bedrijfsgegevens en voorkeuren',
      action: 'Direct naar bedrijfsinstellingen',
      onClick: () => {
        navigate('/bedrijf/instellingen');
        setShowMobileMenu(false);
      },
      color: 'purple'
    }
  ];

  return (
    <div className="dashboard-container">
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
              <li key={index} onClick={item.onClick}>
                <span className={`icon ${item.color}`}>{item.icon}</span>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-content-area">
          <button 
            className="mobile-menu-button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <FaBars />
          </button>

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
        </main>
      </div>

      {showMobileMenu && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
}

export default BedrijvenDashboard;
