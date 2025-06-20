import React from 'react';

function WachtwoordVergeten() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Wachtwoord vergeten</h1>
      <p>Vul je e-mailadres in om een resetlink te ontvangen.</p>
      <form>
        <input type="email" placeholder="E-mailadres" required />
        <button type="submit">Verstuur</button>
      </form>
    </div>
  );
}

export default WachtwoordVergeten;