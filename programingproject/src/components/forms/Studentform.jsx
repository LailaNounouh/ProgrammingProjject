import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from "../../config";

const studierichtingen = [
  'Informatica',
  'Toegepaste Informatica',
  'Bedrijfskunde',
  'Elektronica-ICT',
  'Netwerkeconomie',
  'Biomedische Wetenschappen',
  'Rechten',
  'Communicatie',
  'Andere'
];

export default function StudentForm() {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [studie, setStudie] = useState(studierichtingen[0]);
  const [wachtwoord, setWachtwoord] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!naam || !email || !studie || !wachtwoord) {
      setError('Alle velden zijn verplicht.');
      return;
    }

    if (!email.endsWith('@student.ehb.be')) {
      setError('Gebruik een geldig EHB student e-mailadres (bijv. naam@student.ehb.be).');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'student',
          naam,
          email,
          wachtwoord,
          studie,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Er is een fout opgetreden tijdens de registratie.');
      } else {
        setSuccess('✅ Registratie succesvol! Je wordt doorgestuurd naar de loginpagina...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        setNaam('');
        setEmail('');
        setStudie(studierichtingen[0]);
        setWachtwoord('');
      }
    } catch (err) {
      setError('❌ Server niet bereikbaar.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Student</h2>

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
      <select
        value={studie}
        onChange={(e) => setStudie(e.target.value)}
        required
      >
        {studierichtingen.map((richting, index) => (
          <option key={index} value={richting}>{richting}</option>
        ))}
      </select>
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