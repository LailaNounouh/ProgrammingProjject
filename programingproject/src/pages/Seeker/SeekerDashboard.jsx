import React, { useState, useEffect, useRef } from 'react';
import {
  FaUser,
  FaSearch,
  FaBell,
  FaUserTie,
  FaMapMarkerAlt,
  FaChevronRight
} from 'react-icons/fa';
import './SeekerDashboard.css';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/AuthProvider';

function SeekerDashboard() {
  const { gebruiker } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [seekerNaam, setSeekerNaam] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const notificationRef = useRef(null);

  useEffect(() => {
    if (gebruiker?.naam) {
      setSeekerNaam(gebruiker.naam);
    }
  }, [gebruiker]);

  // Dashboardkaarten (nu alleen de eerste drie)
  const dashboardCards = [
    {
      title: "Profiel",
      icon: <FaUser className="icon-fix" />,
      description: "Beheer je profiel en CV",
      onClick: () => navigate('/werkzoekende/account'),
      iconClass: "bg-blue"
    },
    {
      title: "Bedrijven",
      icon: <FaUserTie className="icon-fix" />,
      description: "Bekijk deelnemende bedrijven",
      onClick: () => navigate('/werkzoekende/bedrijven'),
      iconClass: "bg-orange"
    },
    {
      title: "Standen",
      icon: <FaMapMarkerAlt className="icon-fix" />,
      description: "Bekijk bedrijfsstanden en locaties",
      onClick: () => navigate('/werkzoekende/standen'),
      iconClass: "bg-purple"
    }
  ];

  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="seeker-dashboard-container">
      <div className="seeker-welcome-banner">
        <h1>Welkom terug, {seekerNaam}!</h1>
        <p>Hier vind je een overzicht van je zoektocht naar werk</p>
      </div>

      <div className="seeker-dashboard-toolbar">
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
        </div>
      </div>

      <div className="seeker-dashboard-content">
        <div className="seeker-card-grid">
          {filteredCards.map((card, index) => (
            <div key={index} className="seeker-dashboard-card" onClick={card.onClick}>
              <div className="seeker-card-header">
                <div className={`seeker-card-icon ${card.iconClass}`}>
                  {card.icon}
                </div>
                <h3 className="seeker-card-title">{card.title}</h3>
              </div>
              {card.description && <p className="card-description">{card.description}</p>}
              <div className="card-footer">
                <span>Direct naar {card.title.toLowerCase()}</span>
                <FaChevronRight className="chevron-icon" />
              </div>
            </div>
          ))}
        </div>

        {/* Kalender aan de rechterkant */}
        <div className="seeker-calendar-section">
          <div className="seeker-calendar-container">
            <h2>Kalender</h2>
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              locale="nl-NL"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeekerDashboard;




