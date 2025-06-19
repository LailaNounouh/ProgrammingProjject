import React from "react";
import "./AdminStatistiek.css";
import { useNavigate } from "react-router-dom"; // ✅ Toevoegen

function AdminStatistiek() {
  const navigate = useNavigate(); // ✅ Hook gebruiken

  const gebruikers = [
    { rol: "student" },
    { rol: "bedrijf" },
    { rol: "werkzoekende" },
    { rol: "student" },
    { rol: "bedrijf" },
    { rol: "werkzoekende" },
    { rol: "student" },
    { rol: "bedrijf" },
    { rol: "student" }
  ];

  const total = gebruikers.length;
  const aantalStudenten = gebruikers.filter(g => g.rol === "student").length;
  const aantalBedrijven = gebruikers.filter(g => g.rol === "bedrijf").length;
  const aantalWerkzoekenden = gebruikers.filter(g => g.rol === "werkzoekende").length;

  const actieveStanden = 12;

  return (
    <div className="admin-dashboard">
      {/* ✅ Terugknop */}
      <div className="terug-knop-container">
        <button className="terug-button" onClick={() => navigate('/admin')}>
          ← Terug naar dashboard
        </button>
      </div>

      <main className="admin-main">
        <section className="statistieken-section">
          <h2>Overzicht van Statistieken</h2>

          <div className="stat-card">
            <h3>Gebruikers</h3>
            <p>Totaal aantal gebruikers: {total}</p>
            <ul>
              <li>Studenten: {aantalStudenten}</li>
              <li>Bedrijven: {aantalBedrijven}</li>
              <li>Werkzoekenden: {aantalWerkzoekenden}</li>
            </ul>
          </div>

          <div className="stat-card">
            <h3>Actieve standen</h3>
            <p>Er zijn momenteel {actieveStanden} actieve standen op de plattegrond.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminStatistiek;
