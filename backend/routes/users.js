const express = require('express');
const router = express.Router();
const db = require('../db'); // jouw database module


router.get('/', async (req, res) => {
  try {
    const studentenResult = await db.query('SELECT student_id AS id, naam, email, \'student\' AS rol FROM Studenten');
    const werkzoekendenResult = await db.query('SELECT werkzoekende_id AS id, naam, email, \'werkzoekende\' AS rol FROM Werkzoekenden');

    // Combineer rows
    const users = [...studentenResult.rows, ...werkzoekendenResult.rows];

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kon gebruikers niet ophalen' });
  }
});

module.exports = router;
