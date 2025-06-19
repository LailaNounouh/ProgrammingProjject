import React, { useState, useEffect } from "react";
import "./AdminSectoren.css";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../config";

function AdminSectoren() {
  const navigate = useNavigate();
  const [sectoren, setSectoren] = useState([]);
  const [nieuweSector, setNieuweSector] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/sectoren`)
      .then((res) => res.json())
      .then((data) => setSectoren(data))
      .catch((err) => {
        console.error(err);
        setError("Kon sectoren niet ophalen.");
      });
  }, []);

  const voegSectorToe = () => {
    if (nieuweSector.trim() === "") return;

    fetch(`${baseUrl}/sectoren`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ naam: nieuweSector, zichtbaar: true }),
    })
      .then((res) => res.json())
      .then((toegevoegdeSector) => {
        setSectoren([...sectoren, toegevoegdeSector]);
        setNieuweSector("");
      })
      .catch((err) => {
        console.error(err);
        setError("Kon sector niet toevoegen.");
      });
  };

  const verwijderSector = (id) => {
    fetch(`${baseUrl}/sectoren/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Verwijderen mislukt");
        setSectoren(sectoren.filter((s) => s.sector_id !== id));
      })
      .catch((err) => {
        console.error(err);
        setError("Kon sector niet verwijderen.");
      });
  };

  const toggleZichtbaarheid = (id, huidigZichtbaar) => {
    fetch(`${baseUrl}/sectoren/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zichtbaar: !huidigZichtbaar }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Zichtbaarheid aanpassen mislukt");
        return res.json();
      })
      .then(() => {
        setSectoren(
          sectoren.map((s) =>
            s.sector_id === id ? { ...s, zichtbaar: !huidigZichtbaar } : s
          )
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Kon zichtbaarheid niet aanpassen.");
      });
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

          {error && <p style={{ color: "red" }}>{error}</p>}

          <ul>
            {sectoren.map((sector) => (
              <li key={sector.sector_id} className="sector-item">
                <span className="sector-naam">{sector.naam}</span>
                <span className="sector-status">
                  ({sector.zichtbaar ? "zichtbaar" : "verborgen"})
                </span>
                <div className="sector-acties">
                  <button
                    className="sector-toggle"
                    onClick={() =>
                      toggleZichtbaarheid(sector.sector_id, sector.zichtbaar)
                    }
                  >
                    {sector.zichtbaar ? "Verberg" : "Toon"}
                  </button>
                  <button
                    className="sector-verwijder"
                    onClick={() => verwijderSector(sector.sector_id)}
                  >
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
