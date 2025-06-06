import React from 'react';

export default function SeekersForm() {
  return (
    <form>
      <h3>Registratie - Werkzoekende</h3>
      <input type="text" placeholder="Naam" required />
      <input type="email" placeholder="E-mailadres" required />
      <input type="password" placeholder="Wachtwoord" required />
      <button type="submit">Registreer</button>
    </form>
  );
}
