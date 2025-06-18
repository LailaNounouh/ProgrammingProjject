const express = require('express');
const router = express.Router();
const db = require('../db'); // jouw database module, bv met query functies

// Route om alle gebruikers (studenten + werkzoekenden) op te halen
router.get('/users', async (req, res) => {
  try {
    // Voorbeeld: haal alle studenten op
    const studenten = await db.query('SELECT student_id AS id, naam, email, "student" AS rol FROM Studenten');

    // haal alle werkzoekenden op
    const werkzoekenden = await db.query('SELECT werkzoekende_id AS id, naam, email, "werkzoekende" AS rol FROM Werkzoekenden');

    // combineer de lijsten
    const users = [...studenten, ...werkzoekenden];

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kon gebruikers niet ophalen' });
  }
});

module.exports = router;
