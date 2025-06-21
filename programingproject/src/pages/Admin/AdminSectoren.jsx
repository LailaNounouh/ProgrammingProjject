import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../config";
import "./AdminSectoren.css";

const AdminSectoren = () => {
  const navigate = useNavigate();
  const [sectoren, setSectoren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSectorName, setNewSectorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch sectoren from API
  useEffect(() => {
    fetchSectoren();
  }, []);

  const fetchSectoren = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/sectoren`);

      if (!response.ok) {
        throw new Error("Fout bij ophalen sectoren");
      }

      const data = await response.json();

      // Convert zichtbaar from 0/1 to boolean
      const normalizedData = data.map(sector => ({
        ...sector,
        zichtbaar: Boolean(sector.zichtbaar)
      }));

      setSectoren(normalizedData);
      setError("");
    } catch (err) {
      console.error("Fout bij ophalen sectoren:", err);
      setError("Kon sectoren niet laden");
      setSectoren([]);
    } finally {
      setLoading(false);
    }
  };



  // Add new sector
  const handleAddSector = async (e) => {
    e.preventDefault();

    if (!newSectorName.trim()) {
      setError("Sectornaam is verplicht");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${baseUrl}/sectoren`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naam: newSectorName.trim(),
          zichtbaar: true
        }),
      });

      if (!response.ok) {
        throw new Error("Fout bij toevoegen sector");
      }

      const newSector = await response.json();
      setSectoren([...sectoren, newSector]);
      setNewSectorName("");
      setShowAddModal(false);
      setError("");
    } catch (err) {
      console.error("Fout bij toevoegen sector:", err);
      setError("Kon sector niet toevoegen");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete sector
  const handleDeleteSector = async (sectorId, sectorName) => {
    if (!confirm(`Weet je zeker dat je de sector "${sectorName}" wilt verwijderen?`)) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/sectoren/${sectorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fout bij verwijderen sector");
      }

      setSectoren(sectoren.filter(sector => sector.sector_id !== sectorId));
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Fout bij verwijderen sector:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Sectoren laden...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="terug-knop-container">
        <button className="terug-button" onClick={() => navigate("/admin")}>
          ← Terug naar dashboard
        </button>
      </div>

      <main className="admin-main">
        <section className="sectoren-section">
          <div className="section-header">
            <h2>Beheer van Sectoren</h2>
            <button
              className="add-button"
              onClick={() => setShowAddModal(true)}
            >
              + Nieuwe Sector
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="sectoren-list">
            <div className="list-header">
              <span>Sectornaam</span>
              <span>Acties</span>
            </div>

            {sectoren.length === 0 ? (
              <div className="no-data">
                Geen sectoren gevonden. Voeg een nieuwe sector toe.
              </div>
            ) : (
              sectoren.map((sector) => (
                <div key={sector.sector_id} className="sector-item">
                  <span className="sector-name">{sector.naam}</span>
                  <span className="sector-actions">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteSector(sector.sector_id, sector.naam)}
                    >
                      🗑️ Verwijder
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Add Sector Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Nieuwe Sector Toevoegen</h3>
              <form onSubmit={handleAddSector}>
                <div className="form-group">
                  <label htmlFor="sectorName">Sectornaam:</label>
                  <input
                    type="text"
                    id="sectorName"
                    value={newSectorName}
                    onChange={(e) => setNewSectorName(e.target.value)}
                    placeholder="Bijv. IT & Software"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Toevoegen...' : 'Toevoegen'}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewSectorName("");
                      setError("");
                    }}
                  >
                    Annuleren
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSectoren;
