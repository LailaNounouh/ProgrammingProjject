import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from 'react-icons/fi';
import LogoUploadForm from "../../components/forms/LogoUploadform";
import { useAuth } from "../../context/AuthProvider"; // voor bedrijfId
import "./Settingsbedrijf.css";

const Settingsbedrijf = () => {
  const { user } = useAuth(); // haalt ingelogde bedrijf-ID op
  const navigate = useNavigate();
  
  // Mockdata : bedrijfsgegevens
  const [bedrijfsgegevens, setBedrijfsgegevens] = React.useState({
    bedrijfsnaam: "TechSolutions BV",
    sector: "IT",
    straat: "Innovatielaan",
    nummer: "42",
    postcode: "2000",
    gemeente: "Antwerpen",
    telefoon: "+32 3 123 45 67",
    email: "info@techsolutions.be",
    stwNummer: "BE123456789",
    facturatieContact: "Jan Janssens",
    facturatieEmail: "jan.janssens@techsolutions.be",
    poNummer: "PO2023-123",
    beursContact: "Marie Verstraeten",
    beursEmail: "marie.verstraeten@techsolutions.be",
    website: "https://www.techsolutions.be"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBedrijfsgegevens(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Bedrijfsgegevens succesvol opgeslagen!");
    navigate("/Bedrijvendashboard");
  };

  const handleTerug = () => {
    navigate("/Bedrijf");
  };

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
                  <option value="IT">IT & Technologie</option>
                  <option value="finance">Financiën & Bankwezen</option>
                  <option value="healthcare">Gezondheidszorg</option>
                  <option value="education">Onderwijs</option>
                  <option value="construction">Bouw & Vastgoed</option>
                  <option value="retail">Retail & Handel</option>
                  <option value="manufacturing">Productie & Industrie</option>
                  <option value="transport">Transport & Logistiek</option>
                  <option value="hospitality">Horeca & Toerisme</option>
                  <option value="marketing">Marketing & Communicatie</option>
                  <option value="other">Andere</option>
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
          <button type="submit" className="opslaan-knop">Wijzigingen opslaan</button>
        </form>
      </div>
    </div>
  );
};

export default Settingsbedrijf;