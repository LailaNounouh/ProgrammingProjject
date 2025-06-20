import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./WachtwoordVergeten.css";



function WachtwoordVergeten() {
  const [email, setEmail] = useState("");
  const [melding, setMelding] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMelding("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/wachtwoord-vergeten/reset-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMelding("Als dit e-mailadres bij ons bekend is, ontvang je zo een resetlink.");
      } else {
        setMelding(data.error || "Er is iets misgegaan.");
      }
    } catch (err) {
      console.error("Fout bij versturen resetverzoek:", err);
      setMelding("Er is een fout opgetreden. Probeer later opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="wachtwoordvergeten-container">
      <div className="wachtwoordvergeten-card">
        <h1>Wachtwoord vergeten</h1>
        <p>Vul je e-mailadres in om een resetlink te ontvangen.</p>
        <form onSubmit={handleSubmit}>
          <input 
           type="email"
            placeholder="E-mailadres"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Versturen..." : "Verstuur"}
          </button>
        </form>
        {melding && <p>{melding}</p>}
        <div className="wachtwoordvergeten-terug-link">
          <Link to="/login">Terug naar inloggen</Link>
        </div>
      </div>
    </div>
  );
}

export default WachtwoordVergeten;