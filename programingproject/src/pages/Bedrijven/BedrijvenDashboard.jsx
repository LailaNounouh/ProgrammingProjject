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

function BedrijvenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [betalingen, setBetalingen] = useState([]);
  const [afspraken, setAfspraken] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    setBetalingen([
      { id: 1, factuur: "F2023-0456", status: "Betaald", bedrag: 1200, datum: "20-04-2023" }
    ]);
    setAfspraken([
      { id: 1, student: "Lisa Janssens", type: "Afspraak", datum: "2025-06-17", tijd: "10:00" },
      { id: 2, student: "Tom Peeters", type: "Betaling vereist", bedrag: 800, factuur: "F2023-0457" }
    ]);
  }, []);

  // Sluit popup als je buiten de notificatiebel klikt
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  
  const notifications = [
    {
      id: 1,
      message: "Student Lisa Janssens heeft een afspraak gemaakt voor 17 juni om 10:00.",
      time: "1 uur geleden"
    },
    {
      id: 2,
      message: "Factuur F2023-0457 moet nog betaald worden (Tom Peeters).",
      time: "2 uur geleden"
    }
  ];
  const dashboardCards = [
  {
    title: "Staat van betaling",
    icon: <FaEuroSign />,
    description: "Bekijk uw betalingsstatus en facturen",
    onClick: () => navigate('/bedrijf/betaling'),
    iconClass: "bg-blue"
  },
  {
    title: "Opleidingsmatch",
    icon: <FaCalendarAlt />,
    onClick: () => setActiveTab('afspraken'),
    iconClass: "bg-green",
    showAfspraken: true 
  },
  {
    title: "Beschikbaarheid van standen",
    icon: <FaMapMarkerAlt />,
    description: "Beheer uw standlocaties en reserveringen",
    onClick: () => setActiveTab('standen'),
    iconClass: "bg-orange"
  },
  {
    title: "Bedrijfsinstellingen",
    icon: <FaCog />,
    description: "Beheer uw bedrijfsgegevens en voorkeuren",
    onClick: () => navigate('/bedrijf/Settingsbedrijf'),
    iconClass: "bg-purple"
  }
];
/*filter om kaarten te kunnen zien */
const filteredCards = dashboardCards.filter(card =>
  card.title.toLowerCase().includes(searchTerm.toLowerCase())
);


  const renderDashboard = () => (
    <>
      <div className="welcome-banner">
        <h1>Welkom terug, NovaTech!</h1>
        <p>Hier vindt u een overzicht van uw activiteiten and status</p>
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
        <div className="toolbar-actions">
          <div
            className="notification-bell"
            onClick={() => setShowNotifications((prev) => !prev)}
            tabIndex={0}
            role="button"
            aria-label="Toon notificaties"
            ref={notificationRef}
          >
            <FaBell />
            <span className="notification-badge">{notifications.length}</span>
            {showNotifications && (
              <div className="notification-popup">
                <h4>Meldingen</h4>
                <ul>
                  {notifications.map((notif) => (
                    <li key={notif.id}>
                      <span>{notif.message}</span>
                      <span className="notif-time">{notif.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="user-avatar">NT</div>
        </div>
      </div>

      <div className="card-grid">
        {/* Betalingskaart */}
        <div className="dashboard-card" onClick={() => navigate('/bedrijf/betaling')}>
          <div className="card-header">
            <div className="card-icon bg-blue">
              <FaEuroSign />
            </div>
            <h3>Staat van betaling</h3>
          </div>
          <p>Bekijk uw betalingsstatus en facturen</p>
          <div className="card-footer">
            <span>Direct naar betalingen</span>
            <FaChevronRight />
          </div>
        </div>

        {/* Opleidingsmatch kaart */}
        <div className="dashboard-card" onClick={() => setActiveTab('afspraken')}>
          <div className="card-header">
            <div className="card-icon bg-green">
              <FaCalendarAlt />
            </div>
            <h3>Opleidingsmatch</h3>
          </div>
          <div className="afspraken-status">
            <p>Overzicht Afspraken</p>
            {afspraken.length > 0 ? (
              <div className="upcoming-appointments">
                {afspraken.slice(0, 2).map(afspraak => (
                  <div key={afspraak.id} className="appointment-item">
                    {/* Afspraak details */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-appointments">Geen komende afspraken</p>
            )}
          </div>
          <div className="card-footer">
            <span>Bekijk alle</span>
            <FaChevronRight />
          </div>
        </div>

        {/* Standenkaart */}
        <div className="dashboard-card" onClick={() => setActiveTab('standen')}>
          <div className="card-header">
            <div className="card-icon bg-orange">
              <FaMapMarkerAlt />
            </div>
            <h3>Beschikbaarheid van standen</h3>
          </div>
          <p>Beheer uw standlocaties en reserveringen</p>
          <div className="card-footer">
            <span>Direct naar standen</span>
            <FaChevronRight />
          </div>
        </div>

        {/* Instellingenkaart */}
        <div className="dashboard-card" onClick={() => navigate('/bedrijf/Settingsbedrijf')}>
          <div className="card-header">
            <div className="card-icon bg-purple">
              <FaCog />
            </div>
            <h3>Bedrijfsinstellingen</h3>
          </div>
          <p>Beheer uw bedrijfsgegevens en voorkeuren</p>
          <div className="card-footer">
            <span>Direct naar instellingen</span>
            <FaChevronRight />
          </div> 
        </div>
      </div>
    </>
  );

  return (
    <div className="bedrijven-dashboard">
      <main>
        <div className="dashboard-content">
          {activeTab === 'dashboard' && renderDashboard()}
        </div>
      </main>
    </div>
  );
}

export default BedrijvenDashboard;
