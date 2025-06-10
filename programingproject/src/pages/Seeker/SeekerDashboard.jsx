import React from 'react';
import './SeekerDashboard.css';

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-header">
      <h1>Login als werkzoekende</h1>
      <p>Vul je gegevens in om toegang te krijgen tot je account</p>
    </div>

      <div className="login-form">
        <form onSubmit={(e) => {
          e.preventDefault();
          alert("Login logica hier!");
        }}>
          <div className="form-group">
            <label htmlFor="email">E-mailadres</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="voer je e-mailadres in"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Wachtwoord</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="voer je wachtwoord in"
            />
          </div>

          <button type="submit" className="login-button">sign-in</button>
        </form>

        <div className="alternative-login">
          <p>Geen account? <a href="#registreer">Registreer als werkzoekende</a></p>
          <p><a href="#wachtwoord-vergeten">Wachtwoord vergeten?</a></p>
        </div>
      </div>
    </div>
  );
}
