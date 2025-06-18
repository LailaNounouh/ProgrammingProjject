const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Bedrijven WHERE bedrijf_id >= 2');
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon bedrijven niet ophalen' });
  }
});

module.exports = router;
