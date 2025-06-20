import React from 'react';
import { Link } from "react-router-dom";
import "./WachtwoordVergeten.css";



function WachtwoordVergeten() {
  return (
     <div className="wachtwoordvergeten-container">
      <div className="wachtwoordvergeten-card">
        <h1>Wachtwoord vergeten</h1>
        <p>Vul je e-mailadres in om een resetlink te ontvangen.</p>
        <form>
          <input type="email" placeholder="E-mailadres" required />
          <button type="submit">Verstuur</button>
        </form>
        <div className="wachtwoordvergeten-terug-link">
          <Link to="/login">Terug naar inloggen</Link>
        </div>
      </div>
    </div>
  );
}

export default WachtwoordVergeten;