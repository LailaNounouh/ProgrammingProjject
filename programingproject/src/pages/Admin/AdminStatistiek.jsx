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
        console.log("Statistieken response status:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}: Statistieken ophalen mislukt`);
        return res.json();
      })
      .then((data) => {
        console.log("Statistieken data received:", data);
        setStats(data);
      })
      .catch((err) => {
        console.error("Statistieken error:", err);
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
            <>
              <div className="stat-card">
                <h3>Gebruikers</h3>
                <ul>
                  <li>Studenten: {stats.studenten}</li>
                  <li>Bedrijven: {stats.bedrijven}</li>
                  <li>Werkzoekenden: {stats.werkzoekenden}</li>
                </ul>
                <p>Totaal aantal gebruikers: {stats.studenten + stats.bedrijven + stats.werkzoekenden}</p>
              </div>

              <div className="stat-card">
                <h3>Afspraken</h3>
                <p>Er zijn momenteel {stats.afspraken} afspraken geregistreerd.</p>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminStatistiek;
