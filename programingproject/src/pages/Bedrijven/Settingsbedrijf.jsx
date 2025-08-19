import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthProvider";
import { baseUrl } from "../../config";
import "./Settingsbedrijf.css";

const Settingsbedrijf = () => {
  const { gebruiker } = useAuth();
  const navigate = useNavigate();

  const [bedrijfsgegevens, setBedrijfsgegevens] = useState({
    bedrijfsnaam: "",
    sector: "",
    straat: "",
    nummer: "",
    postcode: "",
    gemeente: "",
    telefoon: "",
    email: "",
    stwNummer: "",
    facturatieContact: "",
    facturatieEmail: "",
    poNummer: "",
    beursContact: "",
    beursEmail: "",
    website: ""
  });

  const [sectoren, setSectoren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("bedrijfsinfo");

  // Fetch available sectors
  useEffect(() => {
    const fetchSectoren = async () => {
      try {
        const response = await fetch(`${baseUrl}/sectoren`);
        if (response.ok) {
          const data = await response.json();
          const zichtbare = data.filter(sector => sector.zichtbaar);
          setSectoren(zichtbare);
        }
      } catch (err) {
        console.error('Fout bij ophalen sectoren:', err);
        setSectoren([]);
      }
    };

    fetchSectoren();
  }, []);

  // Fetch company data when component mounts
  useEffect(() => {
    const fetchBedrijfsgegevens = async () => {
      if (!gebruiker?.id) {
        setError("Geen bedrijf ingelogd");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Haal de token op uit verschillende bronnen
        let token = localStorage.getItem('auth_token') || 
                    localStorage.getItem('token') || 
                    gebruiker?.token;

        if (!token) {
          const userData = localStorage.getItem('user');
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              token = parsedUser.token;
            } catch (e) {
              console.error('Error parsing user data:', e);
            }
          }
        }

        const response = await fetch(`${baseUrl}/bedrijfprofiel/${gebruiker.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        setBedrijfsgegevens({
          bedrijfsnaam: data.naam || "",
          sector: data.sector_id || "",
          straat: data.straat || "",
          nummer: data.nummer || "",
          postcode: data.postcode || "",
          gemeente: data.gemeente || "",
          telefoon: data.telefoonnummer || "",
          email: data.email || "",
          stwNummer: data.btw_nummer || "",
          facturatieContact: data.contactpersoon_facturatie || "",
          facturatieEmail: data.email_facturatie || "",
          poNummer: data.po_nummer || "",
          beursContact: data.contactpersoon_beurs || "",
          beursEmail: data.email_beurs || "",
          website: data.website_of_linkedin || ""
        });

        setError("");
      } catch (err) {
        console.error("Fout bij ophalen bedrijfsgegevens:", err);
        setError(`Kon bedrijfsgegevens niet laden: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBedrijfsgegevens();
  }, [gebruiker?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBedrijfsgegevens(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      // Haal de token op uit verschillende bronnen
      let token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('token') || 
                  gebruiker?.token;

      if (!token) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            token = parsedUser.token;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }
      
      if (!token) {
        throw new Error('Geen token gevonden. Log opnieuw in.');
      }

      // Helper functie om waarden te normaliseren
      const normalizeValue = (value) => {
        if (value === undefined || value === null || value === '') {
          return null;
        }
        if (typeof value === 'string') {
          const trimmed = value.trim();
          return trimmed === '' ? null : trimmed;
        }
        return value;
      };

      const payload = {
        naam: normalizeValue(bedrijfsgegevens.bedrijfsnaam),
        sector_id: normalizeValue(bedrijfsgegevens.sector),
        straat: normalizeValue(bedrijfsgegevens.straat),
        nummer: normalizeValue(bedrijfsgegevens.nummer),
        postcode: normalizeValue(bedrijfsgegevens.postcode),
        gemeente: normalizeValue(bedrijfsgegevens.gemeente),
        telefoonnummer: normalizeValue(bedrijfsgegevens.telefoon),
        email: normalizeValue(bedrijfsgegevens.email),
        btw_nummer: normalizeValue(bedrijfsgegevens.stwNummer),
        contactpersoon_facturatie: normalizeValue(bedrijfsgegevens.facturatieContact),
        email_facturatie: normalizeValue(bedrijfsgegevens.facturatieEmail),
        po_nummer: normalizeValue(bedrijfsgegevens.poNummer),
        contactpersoon_beurs: normalizeValue(bedrijfsgegevens.beursContact),
        email_beurs: normalizeValue(bedrijfsgegevens.beursEmail),
        website_of_linkedin: normalizeValue(bedrijfsgegevens.website)
      };
      
      const response = await fetch(`${baseUrl}/bedrijfprofiel/${gebruiker.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      
      setSuccessMessage("Bedrijfsgegevens succesvol opgeslagen!");
      setEditMode(false);
      
    } catch (err) {
      console.error("Fout bij opslaan bedrijfsgegevens:", err);
      setError(`Fout: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setError("");
    setSuccessMessage("");
    // Reset form data by refetching
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="page-container account-module">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Bedrijfsgegevens laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container account-module">
      <div className="account-header">
        <h2>Bedrijfsinstellingen</h2>
        {!editMode && (
          <button className="edit-btn" onClick={() => setEditMode(true)}>
            <FaEdit /> Bewerken
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="account-sections">
        {editMode ? (
          <div className="persoonlijke-info">
            {/* Tabs voor bewerkmodus */}
            <div className="account-tabs">
              <button 
                className={`tab-button ${activeTab === 'bedrijfsinfo' ? 'active' : ''}`}
                onClick={() => setActiveTab('bedrijfsinfo')}
              >
                Bedrijfsinfo
              </button>
              <button 
                className={`tab-button ${activeTab === 'facturatie' ? 'active' : ''}`}
                onClick={() => setActiveTab('facturatie')}
              >
                Facturatie
              </button>
              <button 
                className={`tab-button ${activeTab === 'beurs' ? 'active' : ''}`}
                onClick={() => setActiveTab('beurs')}
              >
                Beurscontact
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Bedrijfsinfo tab */}
              {activeTab === 'bedrijfsinfo' && (
                <div className="tab-content">
                  <h3>Bedrijfsinformatie</h3>
                  
                  <div className="form-group">
                    <label htmlFor="bedrijfsnaam">Bedrijfsnaam *</label>
                    <input
                      type="text"
                      id="bedrijfsnaam"
                      name="bedrijfsnaam"
                      value={bedrijfsgegevens.bedrijfsnaam}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="sector">Sector *</label>
                    <select
                      id="sector"
                      name="sector"
                      value={bedrijfsgegevens.sector}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Selecteer een sector --</option>
                      {sectoren.map((sector) => (
                        <option key={sector.sector_id} value={sector.sector_id}>
                          {sector.naam}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="straat">Straat *</label>
                    <input
                      type="text"
                      id="straat"
                      name="straat"
                      value={bedrijfsgegevens.straat}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nummer">Huisnummer *</label>
                      <input
                        type="text"
                        id="nummer"
                        name="nummer"
                        value={bedrijfsgegevens.nummer}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="postcode">Postcode *</label>
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={bedrijfsgegevens.postcode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="gemeente">Gemeente *</label>
                      <input
                        type="text"
                        id="gemeente"
                        name="gemeente"
                        value={bedrijfsgegevens.gemeente}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefoon">Telefoonnummer</label>
                    <input
                      type="tel"
                      id="telefoon"
                      name="telefoon"
                      value={bedrijfsgegevens.telefoon}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">E-mailadres</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={bedrijfsgegevens.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="stwNummer">BTW-nummer</label>
                    <input
                      type="text"
                      id="stwNummer"
                      name="stwNummer"
                      value={bedrijfsgegevens.stwNummer}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="website">Website/LinkedIn *</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={bedrijfsgegevens.website}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}
              
              {/* Facturatie tab */}
              {activeTab === 'facturatie' && (
                <div className="tab-content">
                  <h3>Facturatiegegevens</h3>
                  
                  <div className="form-group">
                    <label htmlFor="facturatieContact">Contactpersoon facturatie *</label>
                    <input
                      type="text"
                      id="facturatieContact"
                      name="facturatieContact"
                      value={bedrijfsgegevens.facturatieContact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="facturatieEmail">E-mail facturatie *</label>
                    <input
                      type="email"
                      id="facturatieEmail"
                      name="facturatieEmail"
                      value={bedrijfsgegevens.facturatieEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="poNummer">PO-nummer</label>
                    <input
                      type="text"
                      id="poNummer"
                      name="poNummer"
                      value={bedrijfsgegevens.poNummer}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              
              {/* Beurscontact tab */}
              {activeTab === 'beurs' && (
                <div className="tab-content">
                  <h3>Beursvertegenwoordigers</h3>
                  
                  <div className="form-group">
                    <label htmlFor="beursContact">Contactpersoon beurs *</label>
                    <input
                      type="text"
                      id="beursContact"
                      name="beursContact"
                      value={bedrijfsgegevens.beursContact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="beursEmail">E-mail beurs *</label>
                    <input
                      type="email"
                      id="beursEmail"
                      name="beursEmail"
                      value={bedrijfsgegevens.beursEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={cancelEdit}>
                  <FaTimes /> Annuleren
                </button>
                <button type="submit" className="opslaan-btn" disabled={saving}>
                  {saving ? "Opslaan..." : <><FaSave /> Wijzigingen opslaan</>}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="account-details">
            <section className="account-section">
              <h3>Bedrijfsinformatie</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Bedrijfsnaam</label>
                  <p>{bedrijfsgegevens.bedrijfsnaam || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>Sector</label>
                  <p>{sectoren.find(s => s.sector_id == bedrijfsgegevens.sector)?.naam || "Niet geselecteerd"}</p>
                </div>
                <div className="info-item">
                  <label>Adres</label>
                  <p>
                    {bedrijfsgegevens.straat && bedrijfsgegevens.nummer ? 
                      `${bedrijfsgegevens.straat} ${bedrijfsgegevens.nummer}` : 
                      "Niet ingevuld"
                    }
                    {bedrijfsgegevens.postcode && bedrijfsgegevens.gemeente && (
                      <><br />{bedrijfsgegevens.postcode} {bedrijfsgegevens.gemeente}</>
                    )}
                  </p>
                </div>
                <div className="info-item">
                  <label>Telefoonnummer</label>
                  <p>{bedrijfsgegevens.telefoon || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>E-mailadres</label>
                  <p>{bedrijfsgegevens.email || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>BTW-nummer</label>
                  <p>{bedrijfsgegevens.stwNummer || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>Website/LinkedIn</label>
                  <p>
                    {bedrijfsgegevens.website ? (
                      <a href={bedrijfsgegevens.website} target="_blank" rel="noopener noreferrer">
                        {bedrijfsgegevens.website}
                      </a>
                    ) : (
                      "Niet ingevuld"
                    )}
                  </p>
                </div>
              </div>
            </section>
            
            <section className="account-section">
              <h3>Facturatiegegevens</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Contactpersoon</label>
                  <p>{bedrijfsgegevens.facturatieContact || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>E-mail</label>
                  <p>{bedrijfsgegevens.facturatieEmail || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>PO-nummer</label>
                  <p>{bedrijfsgegevens.poNummer || "Niet ingevuld"}</p>
                </div>
              </div>
            </section>
            
            <section className="account-section">
              <h3>Beursvertegenwoordigers</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Contactpersoon</label>
                  <p>{bedrijfsgegevens.beursContact || "Niet ingevuld"}</p>
                </div>
                <div className="info-item">
                  <label>E-mail</label>
                  <p>{bedrijfsgegevens.beursEmail || "Niet ingevuld"}</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settingsbedrijf;