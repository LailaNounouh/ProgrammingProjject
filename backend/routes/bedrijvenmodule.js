const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Bedrijven');
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon bedrijven niet ophalen' });
  }
});

router.get('/:id', async (req, res) => {
  const bedrijfId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM Bedrijven WHERE bedrijf_id = ?', [bedrijfId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon bedrijf niet ophalen' });
  }
});

module.exports = router;
