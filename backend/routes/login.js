const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

// POST /api/login
router.post('/', async (req, res) => {
  const { email, password, type } = req.body;

  if (!email || !password || !type) {
    return res.status(400).json({ error: 'Email, wachtwoord en type zijn verplicht' });
  }

  try {
    let table;
    if (type === 'student') {
      table = 'Studenten';
    } else if (type === 'werkzoekende') {
      table = 'Werkzoekenden';
    } else if (type === 'admin') {
      table = 'Admins';
    } else if (type === 'bedrijf') {
      // Bedrijven hebben geen wachtwoord, dus login niet ondersteund
      return res.status(400).json({ error: 'Bedrijven kunnen niet inloggen via deze route' });
    } else {
      return res.status(400).json({ error: 'Ongeldig type gebruiker' });
    }

    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Gebruiker niet gevonden' });
    }

    const user = rows[0];

    // Vergelijk het gehashte wachtwoord
    const isMatch = await bcrypt.compare(password, user.wachtwoord);
    if (!isMatch) {
      return res.status(401).json({ error: 'Ongeldig wachtwoord' });
    }

    // Verwijder het wachtwoord voor de response
    delete user.wachtwoord;

    res.json({ message: 'Succesvol ingelogd', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfout bij inloggen' });
  }
});

module.exports = router;
