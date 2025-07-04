import React, { useState } from 'react';
import { baseUrl } from "../../config";

export default function SeekersForm() {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [vaardigheden, setVaardigheden] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!naam || !email || !wachtwoord || !vaardigheden) {
      setError('Alle velden zijn verplicht');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'werkzoekende',
          naam,
          email,
          wachtwoord,
          vaardigheden,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Er is een fout opgetreden');
      } else {
        setSuccess('Registratie succesvol!');
        setNaam('');
        setEmail('');
        setWachtwoord('');
        setVaardigheden('');
      }
    } catch (err) {
      setError('Server niet bereikbaar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Werkzoekende</h2>

      <input
        type="text"
        placeholder="Naam"
        value={naam}
        onChange={(e) => setNaam(e.target.value)}
        required
      />
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
      <div className="form-group">
        <label htmlFor="vaardigheden">Vaardigheden</label>
          <textarea
            id="vaardigheden"
            placeholder="Beschrijf je vaardigheden..."
            value={vaardigheden}
            onChange={(e) => setVaardigheden(e.target.value)}
            required
            className="input-field"
            rows={4}
         />
    </div>
      <button type="submit">Registreer</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}
