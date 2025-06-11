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
    
    <main>
  {activeTab === 'dashboard' && (
    <div className="dashboard-content">
      <div className="welcome-banner">
        <h1>Welkom terug, NovaTech!</h1>
        <p>Hier vindt u een overzicht van uw activiteiten en status</p>
      </div>

      <div className="card-grid">
        {/* Betalingskaart */}
        <div className="dashboard-card" onClick={() => setActiveTab('betalingen')}>
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

        {/* Afsprakenkaart */}
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
        <div className="dashboard-card" onClick={() => setActiveTab('instellingen')}>
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
    </div>
  )}
  {}
</main>

</div>
  );
}

export default BedrijvenDashboard;
