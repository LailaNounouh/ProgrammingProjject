import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom"; // alleen indien je react-router-dom gebruikt

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, type }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess("Login geslaagd!");
      } else {
        setError(data.error || "Login mislukt.");
      }
    } catch (err) {
      setError("Serverfout.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Inloggen</h2>
        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}
        <label>
          Type gebruiker:
          <select value={type} onChange={e => setType(e.target.value)}>
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
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Wachtwoord:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit">Inloggen</button>
        <div className="register-link">
          Nog geen account?{" "}
          <Link to="/register">Registreer hier</Link>
          {/* Als je geen react-router gebruikt, vervang bovenste regel door: 
          <a href="/registratie">Registreer hier</a> 
          */}
        </div>
      </form>
    </div>
  );
}