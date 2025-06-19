import React from 'react';
import {
  FaEuroSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCog,
  FaHome // Nieuw home icoon toegevoegd
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css'; 

export const Sidebar = ({ showMobileMenu, setShowMobileMenu }) => {
  const navigate = useNavigate();

  const menuItems = [
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
      {/* Home link toegevoegd */}
      <div 
        className="sidebar-home"
        onClick={() => {
          navigate('/bedrijf/dashboard');
          setShowMobileMenu(false);
        }}
      >
        <FaHome className="home-icon" />
        <span>Dashboard</span>
      </div>
      
      <h3>Snelmenu</h3>
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
  setShowMobileMenu: PropTypes.func,
};