const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/register
router.post('/', async (req, res) => {
  try {
    const { type, naam, email, studie, vaardigheden, sector } = req.body;

    if (!type || !naam || !email) {
      return res.status(400).json({ error: 'Type, naam en email zijn verplicht' });
    }

    if (type === 'student') {
      if (!studie) {
        return res.status(400).json({ error: 'Studie is verplicht voor studenten' });
      }
      const [result] = await pool.query(
        'INSERT INTO students (naam, email, studie) VALUES (?, ?, ?)',
        [naam, email, studie]
      );
      return res.json({ message: 'Student geregistreerd', id: result.insertId });

    } else if (type === 'werkzoekende') {
      if (!vaardigheden) {
        return res.status(400).json({ error: 'Vaardigheden zijn verplicht voor werkzoekenden' });
      }
      const [result] = await pool.query(
        'INSERT INTO werkzoekende (naam, email, vaardigheden) VALUES (?, ?, ?)',
        [naam, email, vaardigheden]
      );
      return res.json({ message: 'Werkzoekende geregistreerd', id: result.insertId });

    } else if (type === 'bedrijf') {
      if (!sector) {
        return res.status(400).json({ error: 'Sector is verplicht voor bedrijven' });
      }
      const [result] = await pool.query(
        'INSERT INTO bedrijven (bedrijfsnaam, email, sector) VALUES (?, ?, ?)',
        [naam, email, sector]
      );
      return res.json({ message: 'Bedrijf geregistreerd', id: result.insertId });

    } else {
      return res.status(400).json({ error: 'Ongeldig type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Serverfout bij registratie' });
  }
});

module.exports = router;
