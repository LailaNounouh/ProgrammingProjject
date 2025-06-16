const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [bedrijven] = await db.query('SELECT * FROM Bedrijven');
    res.json(bedrijven);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error bij ophalen bedrijven' });
  }
});

module.exports = router;
