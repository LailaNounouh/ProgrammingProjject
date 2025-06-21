import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from 'react-icons/fi';
import LogoUploadForm from "../../components/forms/LogoUploadform";
import { useAuth } from "../../context/AuthProvider";
import { baseUrl } from "../../config";
import "./Settingsbedrijf.css";

const Settingsbedrijf = () => {
  const { user } = useAuth();
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
  const [saving, setSaving] = useState(false);

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
      if (!user?.id) {
        setError("Geen bedrijf ingelogd");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/bedrijfprofiel/${user.id}`);

        if (!response.ok) {
          throw new Error("Kon bedrijfsgegevens niet ophalen");
        }

        const data = await response.json();

        // Map database fields to form fields
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
        setError("Kon bedrijfsgegevens niet laden");
      } finally {
        setLoading(false);
      }
    };

    fetchBedrijfsgegevens();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBedrijfsgegevens(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError("Geen bedrijf ingelogd");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${baseUrl}/bedrijfprofiel/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naam: bedrijfsgegevens.bedrijfsnaam,
          sector_id: bedrijfsgegevens.sector,
          straat: bedrijfsgegevens.straat,
          nummer: bedrijfsgegevens.nummer,
          postcode: bedrijfsgegevens.postcode,
          gemeente: bedrijfsgegevens.gemeente,
          telefoonnummer: bedrijfsgegevens.telefoon,
          email: bedrijfsgegevens.email,
          btw_nummer: bedrijfsgegevens.stwNummer,
          contactpersoon_facturatie: bedrijfsgegevens.facturatieContact,
          email_facturatie: bedrijfsgegevens.facturatieEmail,
          po_nummer: bedrijfsgegevens.poNummer,
          contactpersoon_beurs: bedrijfsgegevens.beursContact,
          email_beurs: bedrijfsgegevens.beursEmail,
          website_of_linkedin: bedrijfsgegevens.website
        }),
      });

      if (!response.ok) {
        throw new Error("Kon bedrijfsgegevens niet opslaan");
      }

      alert("Bedrijfsgegevens succesvol opgeslagen!");
      navigate("/bedrijf");
    } catch (err) {
      console.error("Fout bij opslaan bedrijfsgegevens:", err);
      setError("Kon bedrijfsgegevens niet opslaan");
    } finally {
      setSaving(false);
    }
  };

  const handleTerug = () => {
    navigate("/bedrijf");
  };

  if (loading) {
    return (
      <div className="instellingen-pagina">
        <div className="instellingen-container">
          <div className="loading-message">
            Bedrijfsgegevens worden geladen...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instellingen-pagina">
      <div className="instellingen-container">
        <button onClick={handleTerug} className="terug-knop">
          <FiArrowLeft className="terug-icoon" /> Terug naar dashboard
        </button>

        <div className="instellingen-header">
          <h1>Instellingen</h1>
          <p className="instellingen-subtitel">Beheer hier de contactgegevens van uw bedrijf</p>
        </div>

        {error && (
          <div className="error-message" style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bedrijfsformulier">
          {/* Sectie 1: Bedrijfsgegevens */}
          <section className="form-sectie">
            <div className="sectie-inhoud">
              <h2 className="sectie-titel">Bedrijfsgegevens</h2>
              
              <div className="formulier-groep">
                <label className="formulier-label required">Bedrijfsnaam</label>
                <input
                  type="text"
                  name="bedrijfsnaam"
                  value={bedrijfsgegevens.bedrijfsnaam}
                  onChange={handleChange}
                  required
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label required">Sector</label>
                <select
                  name="sector"
                  value={bedrijfsgegevens.sector}
                  onChange={handleChange}
                  required
                  className="formulier-input"
                >
                  <option value="">-- Selecteer een sector --</option>
                  {sectoren.map((sector) => (
                    <option key={sector.sector_id} value={sector.sector_id}>
                      {sector.naam}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formulier-groep">
                <label className="formulier-label required">Straat</label>
                <input
                  type="text"
                  name="straat"
                  value={bedrijfsgegevens.straat}
                  onChange={handleChange}
                  required
                  className="formulier-input"
                />
              </div>

              <div className="formulier-rij">
                <div className="formulier-groep">
                  <label className="formulier-label required">Huisnummer</label>
                  <input
                    type="text"
                    name="nummer"
                    value={bedrijfsgegevens.nummer}
                    onChange={handleChange}
                    required
                    className="formulier-input small-input"
                  />
                </div>
                
                <div className="formulier-groep">
                  <label className="formulier-label required">Postcode</label>
                  <input
                    type="text"
                    name="postcode"
                    value={bedrijfsgegevens.postcode}
                    onChange={handleChange}
                    required
                    className="formulier-input small-input"
                  />
                </div>
                
                <div className="formulier-groep">
                  <label className="formulier-label required">Gemeente</label>
                  <input
                    type="text"
                    name="gemeente"
                    value={bedrijfsgegevens.gemeente}
                    onChange={handleChange}
                    required
                    className="formulier-input small-input"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sectie 2 en 3: Facturatie en Beurs naast elkaar */}
          <div className="dubbele-secties">
            {/* Sectie 2: Facturatiegegevens */}
            <section className="form-sectie kleine-sectie">
              <div className="sectie-inhoud">
                <h2 className="sectie-titel">Facturatiegegevens</h2>
                
                <div className="formulier-groep">
                  <label className="formulier-label required">Contactpersoon facturatie</label>
                  <input
                    type="text"
                    name="facturatieContact"
                    value={bedrijfsgegevens.facturatieContact}
                    onChange={handleChange}
                    required
                    className="formulier-input"
                  />
                </div>

                <div className="formulier-groep">
                  <label className="formulier-label required">E-mail facturatie</label>
                  <input
                    type="email"
                    name="facturatieEmail"
                    value={bedrijfsgegevens.facturatieEmail}
                    onChange={handleChange}
                    required
                    className="formulier-input"
                  />
                </div>

                <div className="formulier-groep">
                  <label className="formulier-label">PO-nummer</label>
                  <input
                    type="text"
                    name="poNummer"
                    value={bedrijfsgegevens.poNummer}
                    onChange={handleChange}
                    className="formulier-input"
                  />
                </div>
              </div>
            </section>

            {/* Sectie 3: Beursvertegenwoordigers */}
            <section className="form-sectie kleine-sectie">
              <div className="sectie-inhoud">
                <h2 className="sectie-titel">Beursvertegenwoordigers</h2>
                
                <div className="formulier-groep">
                  <label className="formulier-label required">Contactpersoon beurs</label>
                  <input
                    type="text"
                    name="beursContact"
                    value={bedrijfsgegevens.beursContact}
                    onChange={handleChange}
                    required
                    className="formulier-input"
                  />
                </div>

                <div className="formulier-groep">
                  <label className="formulier-label required">E-mail beurs</label>
                  <input
                    type="email"
                    name="beursEmail"
                    value={bedrijfsgegevens.beursEmail}
                    onChange={handleChange}
                    required
                    className="formulier-input"
                  />
                </div>

                <div className="formulier-groep">
                  <label className="formulier-label required">Website/LinkedIn</label>
                  <input
                    type="url"
                    name="website"
                    value={bedrijfsgegevens.website}
                    onChange={handleChange}
                    required
                    className="formulier-input"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="form-sectie">
            <h2 className="sectie-titel">Logo uploaden</h2>
            <LogoUploadForm bedrijfId={user?.id} />
          </div>
          <button
            type="submit"
            className="opslaan-knop"
            disabled={saving}
          >
            {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settingsbedrijf;