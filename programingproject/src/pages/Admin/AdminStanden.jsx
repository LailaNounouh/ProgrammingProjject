import React, { useState, useEffect } from 'react';
import './AdminStanden.css';
import { useNavigate } from "react-router-dom";

function BeheerStanden() {
  const [bedrijven, setBedrijven] = useState([]);
  const [plattegrondData, setPlattegrondData] = useState({ plaatsen: { aula: [], tafel: [] }, stats: {} });
  const [loading, setLoading] = useState(true);
  const [selectedBedrijf, setSelectedBedrijf] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPlaats, setSelectedPlaats] = useState('');
  const [speedDateEnabled, setSpeedDateEnabled] = useState(false);
  const [speedDatePrice, setSpeedDatePrice] = useState('');
  const navigate = useNavigate();

  // Haal bedrijven en plattegrond data op bij component mount
  useEffect(() => {
    fetchBedrijvenMetStanden();
    fetchPlattegrondData();
  }, []);

    const fetchBedrijvenMetStanden = async () => {
    try {
      const response = await fetch("/api/admin/bedrijven-standen/");
      const data = await response.json();
      setBedrijven(data);
    } catch (error) {
      console.error('Fout bij ophalen bedrijven:', error);
    }
  };

  const fetchPlattegrondData = async () => {
    try {
      const response = await fetch('/api/admin/beschikbare-standen');
      const data = await response.json();
      setPlattegrondData(data);
      setLoading(false);
    } catch (error) {
      console.error('Fout bij ophalen plattegrond data:', error);
      setLoading(false);
    }
  };

  const handleAssignStand = async () => {
    if (!selectedBedrijf) {
      alert('Selecteer een bedrijf');
      return;
    }

    try {
      const response = await fetch(`/api/admin/bedrijven/${selectedBedrijf.bedrijf_id}/stand`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plaats_id: selectedPlaats || null,
          speeddate_enabled: speedDateEnabled,
          speeddate_price: speedDatePrice ? parseFloat(speedDatePrice) : null
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Stand toewijzing succesvol bijgewerkt!');
        setShowAssignModal(false);
        resetForm();
        fetchBedrijvenMetStanden();
        fetchPlattegrondData();
      } else {
        alert(result.error || 'Er ging iets mis bij het toewijzen van de stand');
      }
    } catch (error) {
      console.error('Fout bij toewijzen stand:', error);
      alert('Er ging iets mis bij het toewijzen van de stand');
    }
  };

  const handleRemoveStand = async (bedrijf) => {
    if (!confirm(`Weet je zeker dat je de stand toewijzing voor ${bedrijf.company_name} wilt verwijderen?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/bedrijven/${bedrijf.bedrijf_id}/stand`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plaats_id: null,
          speeddate_enabled: false,
          speeddate_price: null
        }),
      });

      if (response.ok) {
        alert('Stand toewijzing verwijderd!');
        fetchBedrijvenMetStanden();
        fetchPlattegrondData();
      } else {
        alert('Er ging iets mis bij het verwijderen van de stand toewijzing');
      }
    } catch (error) {
      console.error('Fout bij verwijderen stand:', error);
      alert('Er ging iets mis bij het verwijderen van de stand toewijzing');
    }
  };

  const handleResetAllStands = async () => {
    if (!confirm('Weet je zeker dat je alle stand toewijzingen wilt resetten? Dit kan niet ongedaan worden gemaakt.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/reset-standen', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Alle stand toewijzingen zijn gereset!');
        fetchBedrijvenMetStanden();
        fetchPlattegrondData();
      } else {
        alert('Er ging iets mis bij het resetten van de standen');
      }
    } catch (error) {
      console.error('Fout bij resetten standen:', error);
      alert('Er ging iets mis bij het resetten van de standen');
    }
  };

  const openAssignModal = (bedrijf) => {
    setSelectedBedrijf(bedrijf);
    setSelectedPlaats(bedrijf.plaats_id || '');
    setSpeedDateEnabled(bedrijf.speeddate_enabled || false);
    setSpeedDatePrice(bedrijf.speeddate_price || '');
    setShowAssignModal(true);
  };

  const resetForm = () => {
    setSelectedBedrijf(null);
    setSelectedPlaats('');
    setSpeedDateEnabled(false);
    setSpeedDatePrice('');
  };

  const getLocationDisplay = (bedrijf) => {
    if (!bedrijf.plaats_id) return 'Niet toegewezen';
    return `${bedrijf.location_type === 'aula' ? 'Aula' : 'Tafel'} ${bedrijf.location_number}`;
  };

  const getAvailablePlaatsen = () => {
    const allPlaatsen = [...plattegrondData.plaatsen.aula, ...plattegrondData.plaatsen.tafel];
    return allPlaatsen.filter(plaats => 
      !plaats.bedrijf_id || 
      (selectedBedrijf && plaats.bedrijf_id === selectedBedrijf.bedrijf_id)
    );
  };

  if (loading) {
    return <div className="loading">Laden...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="terug-knop-container">
        <button className="terug-button" onClick={() => navigate("/admin")}>
          ← Terug naar dashboard
        </button>
      </div>
      
      <main className="admin-main">
        <section className="standen-section">
          <h2>Beheer van Standen</h2>
          
          <div className="standen-controls">
            <button 
              className="reset-button danger"
              onClick={handleResetAllStands}
            >
              Reset Alle Standen
            </button>
          </div>

          {/* Overzicht van locatie types en bezetting */}
          <div className="location-overview">
            <h3>Overzicht Locaties</h3>
            <div className="location-grid">
              <div className="location-card">
                <h4>Aula's</h4>
                <p>{plattegrondData.stats.aula?.occupied || 0} / {plattegrondData.stats.aula?.total || 0} bezet</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${plattegrondData.stats.aula?.total ? 
                        (plattegrondData.stats.aula.occupied / plattegrondData.stats.aula.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="location-card">
                <h4>Tafels</h4>
                <p>{plattegrondData.stats.tafel?.occupied || 0} / {plattegrondData.stats.tafel?.total || 0} bezet</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${plattegrondData.stats.tafel?.total ? 
                        (plattegrondData.stats.tafel.occupied / plattegrondData.stats.tafel.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Plattegrond Visualisatie */}
          <div className="plattegrond-visual">
            <h3>Plattegrond Overzicht</h3>
            
            <div className="plattegrond-section">
              <h4>Aula's</h4>
              <div className="aula-grid">
                {plattegrondData.plaatsen.aula.map((plaats) => (
                  <div 
                    key={plaats.plaats_id} 
                    className={`plaats-item aula ${plaats.bedrijf_id ? 'occupied' : 'available'}`}
                    title={plaats.company_name || 'Beschikbaar'}
                  >
                    <span className="plaats-nummer">Aula {plaats.nummer}</span>
                    <span className="plaats-bedrijf">
                      {plaats.company_name || 'Vrij'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="plattegrond-section">
              <h4>Tafels</h4>
              <div className="tafel-grid">
                {plattegrondData.plaatsen.tafel.map((plaats) => (
                  <div 
                    key={plaats.plaats_id} 
                    className={`plaats-item tafel ${plaats.bedrijf_id ? 'occupied' : 'available'}`}
                    title={plaats.company_name || 'Beschikbaar'}
                  >
                    <span className="plaats-nummer">T{plaats.nummer}</span>
                    <span className="plaats-bedrijf">
                      {plaats.company_name ? plaats.company_name.substring(0, 10) + '...' : 'Vrij'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bedrijven lijst */}
          <div className="bedrijven-lijst">
            <h3>Bedrijven en Stand Toewijzingen</h3>
            <div className="bedrijven-table">
              <div className="table-header">
                <span>Bedrijf</span>
                <span>Contact</span>
                <span>Locatie</span>
                <span>Speed Dating</span>
                <span>Prijs</span>
                <span>Acties</span>
              </div>
              
              {bedrijven.map((bedrijf) => (
                <div key={bedrijf.bedrijf_id} className="table-row">
                  <span className="company-name">{bedrijf.company_name}</span>
                  <span className="contact-info">
                    {bedrijf.contact_person || 'Geen contact'}<br/>
                    <small>{bedrijf.email || 'Geen email'}</small>
                  </span>
                  <span className={`location ${bedrijf.plaats_id ? 'assigned' : 'unassigned'}`}>
                    {getLocationDisplay(bedrijf)}
                  </span>
                  <span className={`speeddate ${bedrijf.speeddate_enabled ? 'enabled' : 'disabled'}`}>
                    {bedrijf.speeddate_enabled ? 'Ja' : 'Nee'}
                  </span>
                  <span className="price">
                    {bedrijf.speeddate_price ? `€${bedrijf.speeddate_price}` : '-'}
                  </span>
                  <span className="actions">
                    <button 
                      className="assign-button"
                      onClick={() => openAssignModal(bedrijf)}
                    >
                      {bedrijf.plaats_id ? 'Bewerk' : 'Toewijzen'}
                    </button>
                    {bedrijf.plaats_id && (
                      <button 
                        className="remove-button"
                        onClick={() => handleRemoveStand(bedrijf)}
                      >
                        Verwijder
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Toewijzing pop-up */}
          {showAssignModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Stand Toewijzing - {selectedBedrijf?.company_name}</h3>
                
                <div className="form-group">
                  <label>Locatie:</label>
                  <select 
                    value={selectedPlaats} 
                    onChange={(e) => setSelectedPlaats(e.target.value)}
                  >
                    <option value="">Geen toewijzing</option>
                    <optgroup label="Aula's">
                      {plattegrondData.plaatsen.aula
                        .filter(plaats => !plaats.bedrijf_id || plaats.bedrijf_id === selectedBedrijf?.bedrijf_id)
                        .map(plaats => (
                          <option key={plaats.plaats_id} value={plaats.plaats_id}>
                            Aula {plaats.nummer}
                          </option>
                        ))
                      }
                    </optgroup>
                    <optgroup label="Tafels">
                      {plattegrondData.plaatsen.tafel
                        .filter(plaats => !plaats.bedrijf_id || plaats.bedrijf_id === selectedBedrijf?.bedrijf_id)
                        .map(plaats => (
                          <option key={plaats.plaats_id} value={plaats.plaats_id}>
                            Tafel {plaats.nummer}
                          </option>
                        ))
                      }
                    </optgroup>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={speedDateEnabled}
                      onChange={(e) => setSpeedDateEnabled(e.target.checked)}
                    />
                    Speed Dating Aanbieden
                  </label>
                </div>

                {speedDateEnabled && (
                  <div className="form-group">
                    <label>Prijs per Speed Date Sessie (€):</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={speedDatePrice}
                      onChange={(e) => setSpeedDatePrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button 
                    className="save-button"
                    onClick={handleAssignStand}
                  >
                    Opslaan
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => {
                      setShowAssignModal(false);
                      resetForm();
                    }}
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BeheerStanden;