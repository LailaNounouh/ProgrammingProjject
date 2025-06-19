import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import LogoUploadForm from "../../components/forms/LogoUploadform";
import { useAuth } from "../../context/AuthProvider";
import "./Settingsbedrijf.css";
import { baseUrl } from '../../config';

const Settingsbedrijf = () => {
  const { gebruiker } = useAuth();
  const navigate = useNavigate();

  const [bedrijfsgegevens, setBedrijfsgegevens] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bedrijfsgegevens ophalen bij mount of als gebruiker.id verandert
  useEffect(() => {
    if (!gebruiker?.id) return;

    fetch(`${baseUrl}/bedrijfprofiel/${gebruiker.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kon bedrijfsgegevens niet ophalen");
        return res.json();
      })
      .then((data) => {
        setBedrijfsgegevens(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [gebruiker?.id]);

  // Wijzigingen in formuliervelden verwerken
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBedrijfsgegevens((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // Formulier verzenden (PUT request)
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${baseUrl}/bedrijfprofiel/${gebruiker.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bedrijfsgegevens),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kon bedrijfsgegevens niet opslaan");
        alert("Bedrijfsgegevens succesvol opgeslagen!");
        navigate("/Bedrijvendashboard");
      })
      .catch((err) => alert(err.message));
  };

  const handleTerug = () => {
    navigate("/Bedrijf");
  };

  if (loading) return <p>Laden...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!bedrijfsgegevens) return null;

  return (
    <div className="instellingen-pagina">
      <div className="instellingen-container">
        <button onClick={handleTerug} className="terug-knop">
          <FiArrowLeft className="terug-icoon" /> Terug naar dashboard
        </button>

        <div className="instellingen-header">
          <h1>Instellingen</h1>
          <p className="instellingen-subtitel">
            Beheer hier de contactgegevens van uw bedrijf
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bedrijfsformulier">
          <section className="form-sectie">
            <div className="sectie-inhoud">
              <h2 className="sectie-titel">Bedrijfsgegevens</h2>

              <div className="formulier-groep">
                <label className="formulier-label required">Bedrijfsnaam</label>
                <input
                  type="text"
                  name="naam"
                  value={bedrijfsgegevens.naam || ""}
                  onChange={handleChange}
                  required
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Straat</label>
                <input
                  type="text"
                  name="straat"
                  value={bedrijfsgegevens.straat || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Nummer</label>
                <input
                  type="text"
                  name="nummer"
                  value={bedrijfsgegevens.nummer || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Postcode</label>
                <input
                  type="text"
                  name="postcode"
                  value={bedrijfsgegevens.postcode || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Gemeente</label>
                <input
                  type="text"
                  name="gemeente"
                  value={bedrijfsgegevens.gemeente || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Telefoonnummer</label>
                <input
                  type="text"
                  name="telefoonnummer"
                  value={bedrijfsgegevens.telefoonnummer || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={bedrijfsgegevens.email || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">BTW Nummer</label>
                <input
                  type="text"
                  name="btw_nummer"
                  value={bedrijfsgegevens.btw_nummer || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Contactpersoon Facturatie</label>
                <input
                  type="text"
                  name="contactpersoon_facturatie"
                  value={bedrijfsgegevens.contactpersoon_facturatie || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Email Facturatie</label>
                <input
                  type="email"
                  name="email_facturatie"
                  value={bedrijfsgegevens.email_facturatie || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">PO Nummer</label>
                <input
                  type="text"
                  name="po_nummer"
                  value={bedrijfsgegevens.po_nummer || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Contactpersoon Beurs</label>
                <input
                  type="text"
                  name="contactpersoon_beurs"
                  value={bedrijfsgegevens.contactpersoon_beurs || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Email Beurs</label>
                <input
                  type="email"
                  name="email_beurs"
                  value={bedrijfsgegevens.email_beurs || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Website of LinkedIn</label>
                <input
                  type="text"
                  name="website_of_linkedin"
                  value={bedrijfsgegevens.website_of_linkedin || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Staat van Betaling</label>
                <input
                  type="text"
                  name="staat_van_betaling"
                  value={bedrijfsgegevens.staat_van_betaling || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Standselectie</label>
                <input
                  type="text"
                  name="standselectie"
                  value={bedrijfsgegevens.standselectie || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Opleidingsmatch</label>
                <input
                  type="text"
                  name="opleidingsmatch"
                  value={bedrijfsgegevens.opleidingsmatch || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Beschikbare Tijdsloten</label>
                <input
                  type="text"
                  name="beschikbare_tijdsloten"
                  value={bedrijfsgegevens.beschikbare_tijdsloten || ""}
                  onChange={handleChange}
                  className="formulier-input"
                />
              </div>

              <div className="formulier-groep">
                <label className="formulier-label">Is Actief</label>
                <input
                  type="checkbox"
                  name="is_actief"
                  checked={bedrijfsgegevens.is_actief === 1}
                  onChange={handleChange}
                  className="formulier-checkbox"
                />
              </div>
            </div>
          </section>

          <section className="form-sectie">
            <LogoUploadForm
              bedrijfsId={gebruiker.id}
              huidigeLogo={bedrijfsgegevens.logo_url}
              onLogoUpdate={(nieuweLogoUrl) =>
                setBedrijfsgegevens((prev) => ({
                  ...prev,
                  logo_url: nieuweLogoUrl,
                }))
              }
            />
          </section>

          <button type="submit" className="opslaan-knop">
            Opslaan
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settingsbedrijf;
