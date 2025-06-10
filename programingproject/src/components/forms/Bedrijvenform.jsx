import React, { useState } from 'react';

export default function BedrijfForm() {
  const [bedrijfsnaam, setBedrijfsnaam] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!bedrijfsnaam || !email || !sector || !wachtwoord) {
      setError('Alle velden zijn verplicht');
      return;
    }

    // Let op: backend verwacht "naam" als veld, maar jouw tabel heet "bedrijfsnaam"
    // Stuur in JSON "naam" mee met de waarde van bedrijfsnaam!

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bedrijf',
          naam: bedrijfsnaam,  // backend checkt op "naam"
          email,
          sector,
          wachtwoord,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Er is een fout opgetreden');
      } else {
        setSuccess('Registratie succesvol!');
        setBedrijfsnaam('');
        setEmail('');
        setSector('');
        setWachtwoord('');
      }
    } catch (err) {
      setError('Server niet bereikbaar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registratie - Bedrijf</h3>
      <input
        type="text"
        placeholder="Bedrijfsnaam"
        value={bedrijfsnaam}
        onChange={(e) => setBedrijfsnaam(e.target.value)}
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
        type="text"
        placeholder="Sector"
        value={sector}
        onChange={(e) => setSector(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={wachtwoord}
        onChange={(e) => setWachtwoord(e.target.value)}
        required
      />
      <button type="submit">Registreer</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}
