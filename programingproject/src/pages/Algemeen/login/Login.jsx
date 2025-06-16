import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../config";
import { useAuth } from "../../../context/AuthProvider";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    wachtwoord: "",
    type: "student" // default type
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(
        formData.email, 
        formData.wachtwoord, 
        formData.type
      );

      if (result.success) {
        navigate(`/${formData.type}`);
      } else {
        setError(result.message || 'Inloggen mislukt');
      }
    } catch (err) {
      console.error("Login fout:", err);
      setError("Er is een fout opgetreden bij het inloggen");
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
          <label htmlFor="email">E-mail:</label>
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
          <label htmlFor="wachtwoord">Wachtwoord:</label>
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

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}