import React from "react";  
import "./Login.css"; 

export default function Login() {
  return (
    <div className="login-container">
      <h2>Inloggen als</h2>
      <div className="login-buttons">
        <button>STUDENT</button>
        <button>BEDRIJF</button>
        <button>WERKZOEKENDE</button>
        <button>ADMIN</button>
      </div>
      <div className="register-container">
        <p>Heb je nog geen account? <a href="/register">Registreer hier</a></p>
      </div>

      <div className="login-image">Afbeelding</div>
    </div>
  );
}
