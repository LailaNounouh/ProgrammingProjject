import React from "react";
import "./Register.css";

export default function Register() {
  return (
    <div className="register">
      <div className="register-content">
        <h1>Registreren</h1>
        <form>
          <div className="form-group">
            <label htmlFor="username">Gebruikersnaam:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Wachtwoord:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Registreren</button>
        </form>
      </div>
    </div>
  );
}