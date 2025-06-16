import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../config";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [type, setType] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: wachtwoord, type }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          role: type,
          ...data.user,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setSuccess("Login geslaagd!");

        setTimeout(() => {
          if (type === "admin") navigate("/Admin");
          else if (type === "bedrijf") navigate("/Bedrijf");
          else if (type === "student") navigate("/Student");
          else if (type === "werkzoekende") navigate("/werkzoekende");
          else navigate("/");
        }, 1000);
      } else {
        setError(data.error || "Login mislukt.");
      }
    } catch (err) {
      console.error("Login fout:", err);
      setError("Serverfout tijdens inloggen.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Inloggen</h2>

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        <div className="form-group">
          <label htmlFor="type">Accounttype:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="student">Student</option>
            <option value="bedrijf">Bedrijf</option>
            <option value="werkzoekende">Werkzoekende</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mailadres:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="wachtwoord">Wachtwoord:</label>
          <input
            type="password"
            id="wachtwoord"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className="login-button">Inloggen</button>

        <div className="register-link">
          Nog geen account? <Link to="/register">Registreer hier</Link>
        </div>
      </form>
    </div>
  );
}
