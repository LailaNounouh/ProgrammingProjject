import React from "react";
import Plattegrond from '../../components/plattegrond/Plattegrond';
import "./StandenModule.css";

export default function StandenModule() {
  return (
    <div className="standen-module">
      <h2>Plattegrond Standen</h2>
      <p className="info-text">Hier vindt u een overzicht van alle stands tijdens het evenement.</p>
      
      <div className="plattegrond-container">
        <Plattegrond bewerkModus={false} /> 
      </div>

      <div className="legenda">
        <h3>Legenda:</h3>
        <div className="legenda-items">
          <div className="legenda-item">
            <div className="legenda-kleur bedrijf"></div>
            <span>Bedrijfsstand</span>
          </div>
          <div className="legenda-item">
            <div className="legenda-kleur faciliteit"></div>
            <span>Faciliteit (Buffet/Onthaal)</span>
          </div>
        </div>
      </div>
    </div>
  );
}