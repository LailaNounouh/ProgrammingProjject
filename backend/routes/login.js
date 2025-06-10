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
    let table, passwordField;
    if (type === 'student') {
      table = 'students';
      passwordField = 'wachtwoord';
    } else if (type === 'werkzoekende') {
      table = 'werkzoekende';
      passwordField = 'wachtwoord';
    } else if (type === 'bedrijf') {
      table = 'bedrijven';
      passwordField = 'wachtwoord';
    } else {
      return res.status(400).json({ error: 'Ongeldig type gebruiker' });
    }

    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Gebruiker niet gevonden' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user[passwordField]);

    if (!isMatch) {
      return res.status(401).json({ error: 'Ongeldig wachtwoord' });
    }

    res.json({ message: 'Succesvol ingelogd', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfout bij inloggen' });
  }
});

module.exports = router;
