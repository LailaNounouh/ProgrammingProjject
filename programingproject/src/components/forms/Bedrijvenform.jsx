import React, { useState, useEffect } from 'react';
import { baseUrl } from "../../config";

export default function BedrijfForm() {
  const [bedrijfsnaam, setBedrijfsnaam] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sectoren, setSectoren] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}/sectoren`)
      .then(res => res.json())
      .then(data => {
        // Filter enkel zichtbare sectoren
        const zichtbare = data.filter(sector => sector.zichtbaar);
        setSectoren(zichtbare);
      })
      .catch(() => setSectoren([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!bedrijfsnaam || !email || !sector || !wachtwoord) {
      setError('Alle velden zijn verplicht');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bedrijf',
          naam: bedrijfsnaam, // backend verwacht "naam"
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
    <form onSubmit={handleSubmit} className="bedrijf-formulier">
      <h3>Bedrijfsgegevens</h3>

      <input type="text" placeholder="Bedrijfsnaam *" value={bedrijfsnaam} onChange={(e) => setBedrijfsnaam(e.target.value)} required />
      <select value={sector} onChange={(e) => setSector(e.target.value)} required>
        <option value="">Kies een sector *</option>
        {sectoren.map((s, index) => (
          <option key={index} value={s.naam}>
            {s.naam}
          </option>
        ))}
      </select>
      <input type="text" placeholder="Straat *" required />
      <input type="text" placeholder="Nummer *" required />
      <input type="text" placeholder="Postcode *" required />
      <input type="text" placeholder="Gemeente *" required />
      <input type="tel" placeholder="Telefoonnummer *" required />
      <input type="email" placeholder="E-mailadres *" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="text" placeholder="BTW-nummer *" required />
      <input type="text" placeholder="Naam contactpersoon facturatie *" required />
      <input type="email" placeholder="E-mail contactpersoon facturatie *" required />
      <input type="text" placeholder="PO nummer" />
      <input type="text" placeholder="Naam contactpersoon beurs *" required />
      <input type="email" placeholder="E-mail contactpersoon beurs *" required />
      <input type="url" placeholder="Website of LinkedIn van uw bedrijf *" required />
      <input type="file" required />
      <input type="password" placeholder="Wachtwoord *" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} required />

      <button type="submit">Verder</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}
