import React from 'react';

export default function BedrijfForm() {
  return (
    <form>
      <h3>Registratie - Bedrijf</h3>
      <input type="text" placeholder="Bedrijfsnaam" required />
      <input type="email" placeholder="E-mailadres" required />
      <input type="text" placeholder="Contactpersoon" required />
      <input type="password" placeholder="Wachtwoord" required />
      <button type="submit">Registreer</button>
    </form>
  );
}
    