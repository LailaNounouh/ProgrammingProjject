const express = require('express');
const pool = require('../db');
const router = express.Router();

// ✅ 1. Haal bedrijfsinformatie op voor afspraakmodule
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        bedrijf_id,
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
      WHERE bedrijf_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Fout bij ophalen bedrijfsinfo:", err.message);
    res.status(500).json({ error: 'Databasefout bij ophalen bedrijf' });
  }
});

// ✅ 2. Voeg een nieuwe afspraak toe
router.post('/', async (req, res) => {
  const { student_id, bedrijf_id, datum, tijdstip, opmerking } = req.body;

  if (!student_id || !bedrijf_id || !datum || !tijdstip) {
    return res.status(400).json({ error: 'Vul alle verplichte velden in' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO Afspraken (student_id, bedrijf_id, datum, tijdstip, opmerking)
      VALUES (?, ?, ?, ?, ?)
    `, [student_id, bedrijf_id, datum, tijdstip, opmerking || null]);

    res.status(201).json({
      success: true,
      afspraak_id: result.insertId,
      message: 'Afspraak succesvol toegevoegd',
    });
  } catch (err) {
    console.error('Fout bij toevoegen afspraak:', err.message);
    res.status(500).json({ error: 'Databasefout bij toevoegen afspraak' });
  }
});

module.exports = router;
