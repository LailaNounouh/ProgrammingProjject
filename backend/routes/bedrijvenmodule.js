// backend/bedrijvenmodule.js
const express = require('express');
const pool = require('./db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bedrijven');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen bedrijven' });
  }
});

module.exports = router;
