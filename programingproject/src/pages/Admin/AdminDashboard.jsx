import React from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';


function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Welkom terug, Admin!</h1>
        <p>Beheer hier gebruikers, bedrijven, standen en statistieken.</p>
      </div>

      <div className="admin-dashboard-content">


        {/* Kaarten */}
        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => navigate('/bedrijven')}>
            <div className="card-icon">🏢</div>
            <h3>Deelnemende bedrijven</h3>
            <p>Bekijk en beheer alle deelnemende bedrijvens</p>
            <span className="card-link">Ga naar bedrijven →</span>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/standen')}>
            <div className="card-icon">📍</div>
            <h3>Beheer van standen</h3>
            <p>Beheer alle standen op de plattegrond</p>
            <span className="card-link">Ga naar standenbeheer →</span>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/gebruikers')}>
            <div className="card-icon">👥</div>
            <h3>Beheer van gebruikers</h3>
            <p>Beheer accounts en rollen van gebruikers</p>
            <span className="card-link">Ga naar gebruikersbeheer →</span>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/statistieken')}>
            <div className="card-icon">📊</div>
            <h3>Statistieken</h3>
            <p>Bekijk statistieken en inzichten</p>
            <span className="card-link">Bekijk statistieken →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;