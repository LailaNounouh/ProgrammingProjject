import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [type, setType] = useState("student");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: wachtwoord, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ongeldige inloggegevens");
      } else {
        navigate(`/${type}`);
      }
    } catch (err) {
      setError("Fout bij verbinding met de server");
    }
  };

  return (
    <div className="login-container">
      <h2>Inloggen</h2>
      <form onSubmit={handleLogin}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="login-select"
        >
          <option value="student">Student</option>
          <option value="werkzoekende">Werkzoekende</option>
          <option value="bedrijf">Bedrijf</option>
        </select>

        <input
          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
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
          Heb je nog geen account? <a href="/register">Registreer hier</a>
        </p>
      </div>

      <div className="login-image">Afbeelding</div>
    </div>
  );
}