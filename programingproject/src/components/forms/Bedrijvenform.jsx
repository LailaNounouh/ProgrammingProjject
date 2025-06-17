import React, { useState, useEffect } from 'react';
import { baseUrl } from "../../config";

export default function BedrijfForm() {
  const [bedrijfsnaam, setBedrijfsnaam] = useState('');
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [sector, setSector] = useState('');
  const [straat, setStraat] = useState('');
  const [nummer, setNummer] = useState('');
  const [postcode, setPostcode] = useState('');
  const [gemeente, setGemeente] = useState('');
  const [telefoonnummer, setTelefoonnummer] = useState('');
  const [btwNummer, setBtwNummer] = useState('');
  const [contactpersoonFacturatie, setContactpersoonFacturatie] = useState('');
  const [emailFacturatie, setEmailFacturatie] = useState('');
  const [poNummer, setPoNummer] = useState('');
  const [contactpersoonBeurs, setContactpersoonBeurs] = useState('');
  const [emailBeurs, setEmailBeurs] = useState('');
  const [website, setWebsite] = useState('');
  const [sectoren, setSectoren] = useState([]);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/sectoren`)
      .then(res => res.json())
      .then(data => {
        const zichtbare = data.filter(sector => sector.zichtbaar);
        setSectoren(zichtbare);
      })
      .catch((err) => {
        console.error('Fout bij ophalen sectoren:', err);
        setSectoren([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!bedrijfsnaam || !email || !sector || !wachtwoord || !straat || !nummer || !postcode || !gemeente || !telefoonnummer || !btwNummer || !contactpersoonFacturatie || !emailFacturatie || !contactpersoonBeurs || !emailBeurs || !website) {
      setError('Alle verplichte velden moeten ingevuld zijn');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bedrijf',
          naam: bedrijfsnaam,
          email,
          wachtwoord,
          sector: parseInt(sector),
          straat,
          nummer,
          postcode,
          gemeente,
          telefoonnummer,
          btw_nummer: btwNummer,
          contactpersoon_facturatie: contactpersoonFacturatie,
          email_facturatie: emailFacturatie,
          po_nummer: poNummer,
          contactpersoon_beurs: contactpersoonBeurs,
          email_beurs: emailBeurs,
          website
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Er is een fout opgetreden');
      } else {
        setSuccess('Registratie succesvol!');
        // Velden resetten
        setBedrijfsnaam('');
        setEmail('');
        setWachtwoord('');
        setSector('');
        setStraat('');
        setNummer('');
        setPostcode('');
        setGemeente('');
        setTelefoonnummer('');
        setBtwNummer('');
        setContactpersoonFacturatie('');
        setEmailFacturatie('');
        setPoNummer('');
        setContactpersoonBeurs('');
        setEmailBeurs('');
        setWebsite('');
      }
    } catch (err) {
      setError('Server niet bereikbaar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bedrijf-formulier">
      <h2>Bedrijfsgegevens</h2>

      <input type="text" placeholder="Bedrijfsnaam *" value={bedrijfsnaam} onChange={(e) => setBedrijfsnaam(e.target.value)} required />

      <select value={sector} onChange={(e) => setSector(e.target.value)} required>
        <option value="">Kies een sector *</option>
        {sectoren.map((s) => (
          <option key={s.sector_id} value={s.sector_id}>{s.naam}</option>
        ))}
      </select>

      <input type="text" placeholder="Straat *" value={straat} onChange={(e) => setStraat(e.target.value)} required />
      <input type="text" placeholder="Nummer *" value={nummer} onChange={(e) => setNummer(e.target.value)} required />
      <input type="text" placeholder="Postcode *" value={postcode} onChange={(e) => setPostcode(e.target.value)} required />
      <input type="text" placeholder="Gemeente *" value={gemeente} onChange={(e) => setGemeente(e.target.value)} required />
      <input type="tel" placeholder="Telefoonnummer *" value={telefoonnummer} onChange={(e) => setTelefoonnummer(e.target.value)} required />

      <input type="email" placeholder="E-mailadres *" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <input type="text" placeholder="BTW-nummer *" value={btwNummer} onChange={(e) => setBtwNummer(e.target.value)} required />
      <input type="text" placeholder="Naam contactpersoon facturatie *" value={contactpersoonFacturatie} onChange={(e) => setContactpersoonFacturatie(e.target.value)} required />
      <input type="email" placeholder="E-mail contactpersoon facturatie *" value={emailFacturatie} onChange={(e) => setEmailFacturatie(e.target.value)} required />
      <input type="text" placeholder="PO nummer" value={poNummer} onChange={(e) => setPoNummer(e.target.value)} />
      <input type="text" placeholder="Naam contactpersoon beurs *" value={contactpersoonBeurs} onChange={(e) => setContactpersoonBeurs(e.target.value)} required />
      <input type="email" placeholder="E-mail contactpersoon beurs *" value={emailBeurs} onChange={(e) => setEmailBeurs(e.target.value)} required />
      <input type="url" placeholder="Website of LinkedIn van uw bedrijf *" value={website} onChange={(e) => setWebsite(e.target.value)} required />

      <input type="password" placeholder="Wachtwoord *" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} required />

      <button type="submit">Verder</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}
