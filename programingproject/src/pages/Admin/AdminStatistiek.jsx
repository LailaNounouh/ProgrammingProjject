import React, { useEffect, useState } from "react";
import "./AdminStatistiek.css";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../config"; // Zorg dat dit pad klopt!

function AdminStatistiek() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/statistieken`)
      .then((res) => {
        if (!res.ok) throw new Error("Statistieken ophalen mislukt");
        return res.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Kon statistieken niet ophalen.");
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
                <p>Totaal aantal gebruikers: {stats.totaal_gebruikers}</p>
                <ul>
                  <li>Studenten: {stats.aantal_studenten}</li>
                  <li>Bedrijven: {stats.aantal_bedrijven}</li>
                  <li>Werkzoekenden: {stats.aantal_werkzoekenden}</li>
                </ul>
              </div>

              <div className="stat-card">
                <h3>Actieve standen</h3>
                <p>Er zijn momenteel {stats.actieve_standen} actieve standen op de plattegrond.</p>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminStatistiek;
