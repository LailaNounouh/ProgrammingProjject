import React, { useState, useRef } from 'react';
import { 
  FaHome, 
  FaEuroSign, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaCog, 
  FaSearch, 
  FaBell 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css';

export const Sidebar = ({ showMobileMenu, setShowMobileMenu }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const notificationRef = useRef(null);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FaHome />,
      onClick: () => navigate('/bedrijf'),
      color: 'yellow'
    },
    {
      title: 'Staat van betaling',
      icon: <FaEuroSign />,
      onClick: () => navigate('/bedrijf/betaling'),
      color: 'blue'
    },
    {
      title: 'Afspraakoverzicht',
      icon: <FaCalendarAlt />,
      onClick: () => navigate('/bedrijf/afspraken'),
      color: 'green'
    },
    {
      title: 'Beschikbaarheid van standen',
      icon: <FaMapMarkerAlt />,
      onClick: () => navigate('/bedrijf/standen'),
      color: 'orange'
    },
    {
      title: 'Bedrijfsinstellingen',
      icon: <FaCog />,
      onClick: () => navigate('/bedrijf/instellingen'),
      color: 'purple'
    }
  ];

  return (
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
        {menuItems.map((item, index) => (
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
  );
};

Sidebar.propTypes = {
  showMobileMenu: PropTypes.bool,
  setShowMobileMenu: PropTypes.func
};