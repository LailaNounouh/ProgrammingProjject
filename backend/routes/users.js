const express = require('express');
const router = express.Router();
const db = require('../db'); // je mysql2 pool

router.get('/', async (req, res) => {
  try {

    const [studenten] = await db.query('SELECT student_id AS id, naam, email, "student" AS rol FROM Studenten');
    const [werkzoekenden] = await db.query('SELECT werkzoekende_id AS id, naam, email, "werkzoekende" AS rol FROM Werkzoekenden');

    const users = [...studenten, ...werkzoekenden];

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kon gebruikers niet ophalen' });
  }
});

module.exports = router;
