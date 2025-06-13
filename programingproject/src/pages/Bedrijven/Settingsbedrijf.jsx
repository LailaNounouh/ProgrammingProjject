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

export default Settingsbedrijf;