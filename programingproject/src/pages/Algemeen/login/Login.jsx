import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../config";
import { useAuth } from "../../../context/AuthProvider";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [type, setType] = useState("student");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: wachtwoord, type }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Ongeldige inloggegevens");
        return;
      }

      const data = await response.json();


      login(email, wachtwoord, type);

      navigate(`/${type}`);
    } catch (err) {
      console.error("Login fout:", err);
      setError("Er is een verbindingsfout met de server.");
    }
  };

  return (
    <div className="login-container">
      <h2>Inloggen</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="type">Ik ben een:</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="login-select"
        >
          <option value="student">Student</option>
          <option value="werkzoekende">Werkzoekende</option>
          <option value="bedrijf">Bedrijf</option>
          <option value="admin">Admin</option>
        </select>

        <label htmlFor="email">E-mailadres</label>
        <input
          id="email"
          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />  

        <label htmlFor="password">Wachtwoord</label>
        <input
          id="password"
          type="password"
          placeholder="Wachtwoord"
          value={wachtwoord}
          onChange={(e) => setWachtwoord(e.target.value)}
          required
        />

        <button type="submit">Inloggen</button>

        {error && <div className="error">{error}</div>}
      </form>

      <div className="register-container">
        <p>
          Nog geen account? <a href="/register">Registreer hier</a>
        </p>
      </div>

      <div className="login-image">Afbeelding</div>
    </div>
  );
}

