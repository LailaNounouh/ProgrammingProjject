import React, { useState } from 'react';
import './AdminStanden.css';
import Plattegrond from '../../components/plattegrond/Plattegrond';
import { useNavigate } from "react-router-dom";

function BeheerStanden() {
  const [bewerkModus, setBewerkModus] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
     <div className="terug-knop-container">
  <button className="terug-button" onClick={() => navigate("/admin")}>
    ← Terug naar dashboard
  </button>
</div>
    
      <main className="admin-main">
        <section className="standen-section">
          <h2>Beheer van standen</h2>

          <div className="plattegrond">
            <Plattegrond bewerkModus={bewerkModus} />
          </div>

          <div className="bedrijven-header">
            <button
              className="bewerken-button"
              onClick={() => setBewerkModus(!bewerkModus)}
            >
              {bewerkModus ? 'Opslaan' : 'Bewerk'}</button>
          </div>

          

        </section>
      </main>
    </div>
  );
}

export default BeheerStanden;