

const express = require('express');
const pool = require('../db');
const router = express.Router();

// Haal bedrijfsinformatie op voor afspraakmodule
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        bedrijf_id,
        naam,
        beschrijving,
        logo_url
      FROM Bedrijven
      WHERE bedrijf_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Fout bij ophalen afspraakbedrijf:", err.message);
    res.status(500).json({ error: 'Databasefout bij ophalen afspraakbedrijf' });
  }
});

module.exports = router;