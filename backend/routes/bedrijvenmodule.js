// backend/bedrijvenmodule.js
const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        naam,
        straat,
        nummer,
        postcode,
        gemeente,
        telefoonnummer,
        email,
        website_of_linkedin,
        logo_url
      FROM Bedrijven
    `);
    res.json(rows);
  } catch (err) {
    console.error("DB-fout bij ophalen bedrijven:", err.message);
    res.status(500).json({ error: 'Database fout bij ophalen bedrijven' });
  }
});

module.exports = router;
