import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { inloggen } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    wachtwoord: "",
    type: "student"
  });
  const [foutmelding, setFoutmelding] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFoutmelding("");

    try {
      const resultaat = await inloggen(formData.email, formData.wachtwoord, formData.type);
      if (resultaat.success) {
        navigate(`/${formData.type}`);
      } else {
        setFoutmelding(resultaat.bericht || "Inloggen mislukt");
      }
    } catch (err) {
      console.error("Login fout:", err);
      setFoutmelding("Er is een fout opgetreden bij het inloggen");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Inloggen</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="type">Account type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="bedrijf">Bedrijf</option>
              <option value="werkzoekende">Werkzoekende</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="wachtwoord">Wachtwoord</label>
            <input
              type="password"
              id="wachtwoord"
              name="wachtwoord"
              value={formData.wachtwoord}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Inloggen
          </button>

          <div className="register-link">
            Nog geen account? <Link to="/register">Registreer hier</Link>
          </div>

          {foutmelding && <div className="error-message">{foutmelding}</div>}
        </form>
      </div>
    </div>
  );
}
