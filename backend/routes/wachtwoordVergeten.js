const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Zoek het account op in alle mogelijke tabellen (of kies er één afhankelijk van je projectstructuur)
    const [student] = await db.query('SELECT * FROM Studenten WHERE email = ?', [email]);
    const [bedrijf] = await db.query('SELECT * FROM Bedrijven WHERE email = ?', [email]);
    const [admin] = await db.query('SELECT * FROM Admins WHERE email = ?', [email]);
    const [zoekende] = await db.query('SELECT * FROM Werkzoekenden WHERE email = ?', [email]);

    const account = student[0] || bedrijf[0] || admin[0] || zoekende[0];

    if (!account) {
      return res.status(404).json({ error: 'Geen account gevonden met dit e-mailadres.' });
    }

    // Hier zou je normaal een mail versturen met een resetlink
    res.json({ message: 'Als dit e-mailadres bestaat, sturen we je een resetlink.' });

  } catch (error) {
    console.error('Fout bij wachtwoord vergeten:', error);
    res.status(500).json({ error: 'Serverfout bij verzoek.' });
  }
});

module.exports = router;