import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import { baseUrl } from '../../../config';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, wachtwoord }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login mislukt');
        return;
      }

      // Stel user data in vanuit API response (voorbeeld)
      // Zorg dat API user data teruggeeft met minimaal 'role'
      login(data.user);

      // Na login naar dashboard sturen, afhankelijk van rol
      if (data.user.role === 'student') navigate('/student');
      else if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'bedrijf') navigate('/bedrijf');
      else if (data.user.role === 'seeker') navigate('/seeker');
      else navigate('/'); // fallback

    } catch {
      setError('Server niet bereikbaar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Login</h3>
      <input
        type="email"
        placeholder="E-mailadres"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={wachtwoord}
        onChange={e => setWachtwoord(e.target.value)}
        required
      />
      <button type="submit">Inloggen</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
