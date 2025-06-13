// routes/sectoren.js
const express = require('express');
const router = express.Router();
const db = require('../database'); // pas aan naar jouw db connectie

router.get('/', async (req, res) => {
  try {
    const [sectoren] = await db.query('SELECT * FROM sectoren');
    res.json(sectoren);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fout bij ophalen sectoren' });
  }
});

module.exports = router;
