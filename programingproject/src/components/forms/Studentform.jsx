import React from 'react';

export default function StudentForm() {
  return (
    <form>
      <h3>Registratie - Student</h3>
      <input type="text" placeholder="Naam" required />
      <input type="email" placeholder="E-mailadres" required />
      <input type="text" placeholder="School" required />
      <input type="password" placeholder="Wachtwoord" required />
      <button type="submit">Registreer</button>
    </form>
  );
}
