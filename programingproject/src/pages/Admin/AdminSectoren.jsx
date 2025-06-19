import React, { useState } from "react";
import "./AdminSectoren.css";
import { useNavigate } from "react-router-dom";

function AdminSectoren() {
  const navigate = useNavigate();

  const [sectoren, setSectoren] = useState([
    { naam: "IT", zichtbaar: true },
    { naam: "Marketing", zichtbaar: true },
    { naam: "Logistiek", zichtbaar: false },
  ]);

  const [nieuweSector, setNieuweSector] = useState("");

  const toggleZichtbaarheid = (index) => {
    const nieuweSectoren = [...sectoren];
    nieuweSectoren[index].zichtbaar = !nieuweSectoren[index].zichtbaar;
    setSectoren(nieuweSectoren);
  };

  const voegSectorToe = () => {
    if (nieuweSector.trim() === "") return;
    setSectoren([...sectoren, { naam: nieuweSector, zichtbaar: true }]);
    setNieuweSector("");
  };

  const verwijderSector = (index) => {
    const nieuweSectoren = [...sectoren];
    nieuweSectoren.splice(index, 1);
    setSectoren(nieuweSectoren);
  };

  return (
    <div className="admin-dashboard">
      <div className="terug-knop-container">
        <button className="terug-button" onClick={() => navigate("/admin")}>
          ← Terug naar dashboard
        </button>
      </div>

      <main className="admin-main">
        <section className="sectoren-section">
          <h2>Sectoren beheren</h2>
          <ul>
            {sectoren.map((sector, index) => (
              <li key={index} className="sector-item">
                <span className="sector-naam">{sector.naam}</span>
                <span className="sector-status">
                  ({sector.zichtbaar ? "zichtbaar" : "verborgen"})
                </span>
                <div className="sector-acties">
                  <button className="sector-toggle" onClick={() => toggleZichtbaarheid(index)}>
                    {sector.zichtbaar ? "Verberg" : "Toon"}
                  </button>
                  <button className="sector-verwijder" onClick={() => verwijderSector(index)}>
                    Verwijder
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="sector-toevoegen">
            <input
              type="text"
              placeholder="Nieuwe sector"
              value={nieuweSector}
              onChange={(e) => setNieuweSector(e.target.value)}
            />
            <button onClick={voegSectorToe}>Voeg toe</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminSectoren;
