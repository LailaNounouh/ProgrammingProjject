const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:bedrijf_id', async (req, res) => {
  const bedrijfId = req.params.bedrijf_id;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM betalingen WHERE bedrijf_id = ? LIMIT 1',
      [bedrijfId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Geen betaling gevonden.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Databasefout bij ophalen betaling:', err);
    res.status(500).json({ message: 'Fout bij ophalen betaling.' });
  }
});

module.exports = router;
