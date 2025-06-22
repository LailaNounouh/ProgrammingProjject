import React, { useEffect, useState } from "react";
import "./AdminStatistiek.css";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../config";

function AdminStatistiek() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/statistieken`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Statistieken ophalen mislukt`);
        return res.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        setError(`Kon statistieken niet ophalen: ${err.message}`);
      });
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="terug-knop-container">
        <button className="terug-button" onClick={() => navigate('/admin')}>
          ← Terug naar dashboard
        </button>
      </div>

      <main className="admin-main">
        <section className="statistieken-section">
          <h2>Overzicht van Statistieken</h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!stats ? (
            <p>Statistieken worden geladen...</p>
          ) : (
            <div className="stat-grid">
              <div className="stat-card">
                <h3>Gebruikers</h3>
                <div className="stat-item">
                  <span>Studenten</span>
                  <strong>{stats.studenten}</strong>
                </div>
                <div className="stat-item">
                  <span>Bedrijven</span>
                  <strong>{stats.bedrijven}</strong>
                </div>
                <div className="stat-item">
                  <span>Werkzoekenden</span>
                  <strong>{stats.werkzoekenden}</strong>
                </div>
                <div className="stat-total">
                  Totaal aantal gebruikers:{" "}
                  <strong>{stats.studenten + stats.bedrijven + stats.werkzoekenden}</strong>
                </div>
              </div>

              <div className="stat-card">
                <h3>Afspraken</h3>
                <div className="stat-item">
                  <span>Geregistreerd</span>
                  <strong>{stats.afspraken}</strong>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminStatistiek;
