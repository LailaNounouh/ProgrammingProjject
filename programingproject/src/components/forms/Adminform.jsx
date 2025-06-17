import React, { useEffect, useState } from "react";
import { baseUrl } from "../../config";

export default function AdminRegisterPage() {
  const [adminExists, setAdminExists] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Controleer of admin al bestaat door GET request naar backend (route moet bestaan)
    fetch(`${baseUrl}/register/admin-exists`)
      .then((res) => res.json())
      .then((data) => setAdminExists(data.exists))
      .catch(() => setAdminExists(false));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, wachtwoord: password }), // alleen email + wachtwoord
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setAdminExists(true);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Serverfout bij registratie.");
    }
  };

  if (adminExists === null) return <p>Laden...</p>;
  if (adminExists) return <p>Admin is al geregistreerd.</p>;

  return (
    <form onSubmit={handleRegister}>
      <h2>Admin</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registreer</button>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
