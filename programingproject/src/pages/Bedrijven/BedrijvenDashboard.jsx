import React, { useState, useEffect } from 'react';
import { FaEuroSign, FaCalendarAlt, FaMapMarkerAlt, FaCog, FaChevronRight, FaSearch, FaBell } from 'react-icons/fa';
import './BedrijvenDashboard.css';

function BedrijvenDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [betalingen, setBetalingen] = useState([]);
  const [afspraken, setAfspraken] = useState([]);

  useEffect(() => {
    setBetalingen([
      { id: 1, factuur: "F2023-0456", status: "Betaald", bedrag: 1200, datum: "20-04-2023" }
    ]);
    setAfspraken([]);
  }, []);

  return (
    <div className="bedrijven-dashboard">
      {<header className="dashboard-header">
  <div className="header-left">
    <h1>Ingelogd bedrijf</h1>
    <p>NovaTech - IT Services</p>
  </div>
  <div className="header-right">
    <div className="search-box">
      <FaSearch className="search-icon" />
      <input type="text" placeholder="Zoeken..." />
    </div>
    <div className="notification-bell">
      <FaBell />
      <span className="notification-badge">3</span>
    </div>
    <div className="user-avatar">NT</div>
  </div>
</header>
}
    </div>
  );
}

export default BedrijvenDashboard;
