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
      console.log("Fetching sectoren from:", `${baseUrl}/sectoren`);
      const response = await fetch(`${baseUrl}/sectoren`);

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Fout bij ophalen sectoren`);
      }

      const data = await response.json();
      console.log("Sectoren data received:", data);

      // Convert zichtbaar from 0/1 to boolean
      const normalizedData = data.map(sector => {
        console.log("Processing sector:", sector.sector_id, "type:", typeof sector.sector_id, "zichtbaar:", sector.zichtbaar);
        return {
          ...sector,
          zichtbaar: Boolean(sector.zichtbaar)
        };
      });

      setSectoren(normalizedData);
      setError("");
    } catch (err) {
      console.error("Fout bij ophalen sectoren:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(`Kon sectoren niet laden: ${err.message}`);
      setSectoren([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle sector visibility
  const toggleSectorVisibility = async (sectorId, currentVisibility) => {
    try {
      console.log("Toggling sector:", sectorId, "current visibility:", currentVisibility, "new visibility:", !currentVisibility);

      const url = `${baseUrl}/sectoren/${sectorId}`;
      const requestBody = {
        zichtbaar: !currentVisibility
      };

      console.log("Making PATCH request to:", url);
      console.log("Request body:", requestBody);
      console.log("baseUrl:", baseUrl);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Toggle response received:", response);
      console.log("Toggle response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Toggle error response:", errorData);
        throw new Error(`HTTP ${response.status}: ${errorData.error || "Fout bij wijzigen zichtbaarheid"}`);
      }

      const result = await response.json();
      console.log("Toggle success result:", result);

      // Update local state
      console.log("Updating local state for sector:", sectorId, "type:", typeof sectorId);
      setSectoren(sectoren.map(sector => {
        console.log("Comparing:", sector.sector_id, "===", sectorId, "result:", sector.sector_id == sectorId);
        return sector.sector_id == sectorId  // Use == instead of === for type-flexible comparison
          ? { ...sector, zichtbaar: !currentVisibility }
          : sector;
      }));

      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Fout bij wijzigen zichtbaarheid:", err);
      console.error("Error type:", err.constructor.name);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });

      if (err.message === "Failed to fetch") {
        setError("Netwerkfout: Kan geen verbinding maken met de server. Controleer of de server draait.");
      } else {
        setError(`Kon zichtbaarheid niet wijzigen: ${err.message}`);
      }
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

      console.log("Deleting sector:", sectorId, "type:", typeof sectorId);
      setSectoren(sectoren.filter(sector => {
        console.log("Filter comparing:", sector.sector_id, "!=", sectorId, "result:", sector.sector_id != sectorId);
        return sector.sector_id != sectorId;  // Use != instead of !== for type-flexible comparison
      }));

      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Fout bij verwijderen sector:", err);
      setError(`Kon sector niet verwijderen: ${err.message}`);
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
              <span>Zichtbaarheid</span>
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
                  <span className="sector-visibility">
                    <button
                      className={`visibility-toggle ${sector.zichtbaar ? 'visible' : 'hidden'}`}
                      onClick={() => toggleSectorVisibility(sector.sector_id, sector.zichtbaar)}
                    >
                      {sector.zichtbaar ? '👁️ Zichtbaar' : '🙈 Verborgen'}
                    </button>
                  </span>
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
