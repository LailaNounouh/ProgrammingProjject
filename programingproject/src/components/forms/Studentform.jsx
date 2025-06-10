import React, { useState } from 'react';

export default function StudentForm() {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [studie, setStudie] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    // Simpele validatie
    if (!naam || !email || !studie || !wachtwoord) {
      setError('Alle velden zijn verplicht');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'student',
          naam,
          email,
          studie,
          wachtwoord, // let op: je backend moet wachtwoord verwerken
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Er is een fout opgetreden');
      } else {
        setSuccess('Registratie succesvol!');
        setNaam('');
        setEmail('');
        setStudie('');
        setWachtwoord('');
      }
    } catch (err) {
      setError('Server niet bereikbaar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registratie - Student</h3>
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
        type="text"
        placeholder="Studie"
        value={studie}
        onChange={(e) => setStudie(e.target.value)}
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
