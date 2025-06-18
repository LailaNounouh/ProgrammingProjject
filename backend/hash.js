// hashWachtwoord.js
const bcrypt = require('bcrypt');

// Voorbeeldwachtwoord (vervang dit door je invoer of gebruik prompt/input)
const wachtwoord = 'Cronos!2025@';

// Aantal salt rounds – 10 is standaard goed
const saltRounds = 10;

bcrypt.hash(wachtwoord, saltRounds, (err, hash) => {
  if (err) {
    console.error('Fout bij hashen:', err);
    return;
  }

  console.log('Oorspronkelijk wachtwoord:', wachtwoord);
  console.log('Gehasht wachtwoord:', hash);
});
