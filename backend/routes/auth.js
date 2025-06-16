const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { naam, email, wachtwoord, studie } = req.body;

    if (!naam || !email || !wachtwoord) {
      return res.status(400).json({ error: 'Naam, email en wachtwoord zijn verplicht.' });
    }

    // Check of gebruiker al bestaat
    const [existing] = await db.query('SELECT student_id FROM Studenten WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'E-mail is al geregistreerd.' });
    }

    // Hash het wachtwoord
    const hashedPassword = await bcrypt.hash(wachtwoord, 10);

    // Voeg student toe
    const [result] = await db.query(
      'INSERT INTO Studenten (naam, email, wachtwoord, studie) VALUES (?, ?, ?, ?)',
      [naam, email, hashedPassword, studie || null]
    );

    res.status(201).json({ message: 'Registratie succesvol', student_id: result.insertId });
  } catch (error) {
    console.error('Fout bij registratie:', error);
    res.status(500).json({ error: 'Serverfout bij registratie' });
  }
});

module.exports = router;
