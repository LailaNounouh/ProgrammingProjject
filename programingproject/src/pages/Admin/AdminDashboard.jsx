import React from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-welcome-banner">
        <h1>Welkom terug, Admin!</h1>
        <p>Beheer hier gebruikers, bedrijven, standen en statistieken.</p>
</div>

      <div className="admin-dashboard-content">
        {/* Kaarten */}
        <div className="dashboard-cards">
          {/* Deelnemende bedrijven */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/Admin/Bedrijf")}
          >
            <div>
              <div className="icon-container">
                <div className="icon-wrapper icon-blauw">🏢</div>
                <h3>Deelnemende bedrijven</h3>
              </div>
              <hr className="card-divider" />
              <p className="card-description">
                Bekijk en beheer alle deelnemende bedrijvens
              </p>
            </div>
            <div className="card-footer">
              <span className="card-link">Ga naar bedrijven</span>
              <span className="card-arrow">→</span>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/Admin/standen")}
          >
            <div>
              <div className="icon-container">
                <div className="icon-wrapper icon-rood">📍</div>
                <h3>Beheer van standen</h3>
              </div>
              <hr className="card-divider" />
              <p className="card-description">
                Beheer alle standen op de plattegrond
              </p>
            </div>
            <div className="card-footer">
              <span className="card-link">Ga naar standenbeheer</span>
              <span className="card-arrow">→</span>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/Admin/gebruikers")}
          >
            <div>
              <div className="icon-container">
                <div className="icon-wrapper icon-paars">👥</div>
                <h3>Beheer van gebruikers</h3>
              </div>
              <hr className="card-divider" />
              <p className="card-description">
                Beheer accounts en rollen van gebruikers
              </p>
            </div>
            <div className="card-footer">
              <span className="card-link">Ga naar gebruikersbeheer</span>
              <span className="card-arrow">→</span>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/statistiek")}
          >
            <div>
              <div className="icon-container">
                <div className="icon-wrapper icon-geel">📊</div>
                <h3>Statistieken</h3>
              </div>
              <hr className="card-divider" />
              <p className="card-description">
                Bekijk statistieken en inzichten
              </p>
            </div>
            <div className="card-footer">
              <span className="card-link">Bekijk statistieken</span>
              <span className="card-arrow">→</span>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/sectoren")}
          >
            <div>
              <div className="icon-container">
                <div className="icon-wrapper icon-groen">🏷️</div>
                <h3>Beheer van sectoren</h3>
              </div>
              <hr className="card-divider" />
              <p className="card-description">
                Beheer zichtbaarheid en lijst van sectoren
              </p>
            </div>
            <div className="card-footer">
              <span className="card-link">Ga naar sectorenbeheer</span>
              <span className="card-arrow">→</span>
            </div>
          </div>
          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/aanwezigheid")}
          >
            <div>
              <div className="icon-container">
                <div className="icon-wrapper icon-turquoise">🧾</div>
                <h3>Aanwezigheden</h3>
              </div>
              <hr className="card-divider" />
              <p className="card-description">
                Bekijk en beheer de check-ins van deelnemers
              </p>
            </div>
            <div className="card-footer">
              <span className="card-link">Ga naar aanwezigheden</span>
              <span className="card-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
