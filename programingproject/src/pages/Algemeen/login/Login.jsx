import React, { useState } from "react";  
import "./Login.css";
import { useNavigate } from "react-router-dom";

const demoUsers = [
  { username: "student", password: "student123", role: "student" },
  { username: "bedrijf", password: "bedrijf123", role: "bedrijf" },
  { username: "werkzoekende", password: "werk123", role: "werkzoekende" },
  { username: "admin", password: "admin123", role: "admin" },
];

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const user = demoUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      navigate(`/${user.role}`);
    } else {
      setError("Ongeldige inloggegevens");
    }
  };

  return (
    <div className="login-container">
      <h2>Inloggen</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Gebruikersnaam"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
