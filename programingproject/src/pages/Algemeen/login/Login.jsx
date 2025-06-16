import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from '../../../config';
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

export default function Login() {
  const navigate = useNavigate();
  const { inloggen } = useAuth();
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [type, setType] = useState("student");
  const [foutmelding, setFoutmelding] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFoutmelding("");

    try {
      const resultaat = await inloggen(email, wachtwoord, type);

      if (resultaat.success) {
        navigate(`/${type}`);
      } else {
        setFoutmelding(resultaat.bericht || "Inloggen mislukt");
      }
    } catch (err) {
      console.error("Login fout:", err);
      setFoutmelding("Er is een fout opgetreden bij het inloggen");
    }
  };

  return (
    <div className="login-container">
      <h2>Inloggen</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="type">Account type:</label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="student">Student</option>
            <option value="bedrijf">Bedrijf</option>
            <option value="werkzoekende">Werkzoekende</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label>
          Email:
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Wachtwoord:
          <input
            type="password"
            id="wachtwoord"
            name="wachtwoord"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            required
          />
        </label>

        <button type="submit">Inloggen</button>

        <div className="register-link">
          Nog geen account? <Link to="/register">Registreer hier</Link>
        </div>

        <button type="submit" className="login-button">
          Inloggen
        </button>

        {foutmelding && <div className="error-message">{foutmelding}</div>}
      </form>
    </div>
  );
}
