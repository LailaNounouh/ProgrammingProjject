import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleTerug = () => {
  navigate("/Bedrijf");
};

const Settingsbedrijf = () => {
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
      </div>
    </div>
  );
};
const [bedrijfsgegevens, setBedrijfsgegevens] = React.useState({
  bedrijfsnaam: "",
  sector: "",
  straat: "",
  nummer: "",
  postcode: "",
  gemeente: ""
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setBedrijfsgegevens((prev) => ({ ...prev, [name]: value }));
};
<form className="bedrijfsformulier">
  <section className="form-sectie">
    <h2 className="sectie-titel">Bedrijfsgegevens</h2>

    <div className="formulier-groep">
      <label className="formulier-label">Bedrijfsnaam</label>
      <input
        type="text"
        name="bedrijfsnaam"
        value={bedrijfsgegevens.bedrijfsnaam}
        onChange={handleChange}
        className="formulier-input"
      />
    </div>
    <div className="formulier-groep">
  <label className="formulier-label">Straat</label>
  <input
    type="text"
    name="straat"
    value={bedrijfsgegevens.straat}
    onChange={handleChange}
    className="formulier-input"
  />
</div>

<div className="formulier-rij">
  <div className="formulier-groep">
    <label className="formulier-label">Huisnummer</label>
    <input
      type="text"
      name="nummer"
      value={bedrijfsgegevens.nummer}
      onChange={handleChange}
      className="formulier-input"
    />
  </div>
  <div className="formulier-groep">
    <label className="formulier-label">Postcode</label>
    <input
      type="text"
      name="postcode"
      value={bedrijfsgegevens.postcode}
      onChange={handleChange}
      className="formulier-input"
    />
  </div>
  <div className="formulier-groep">
    <label className="formulier-label">Gemeente</label>
    <input
      type="text"
      name="gemeente"
      value={bedrijfsgegevens.gemeente}
      onChange={handleChange}
      className="formulier-input"
    />
  </div>
</div>

  </section>
</form>

export default Settingsbedrijf;