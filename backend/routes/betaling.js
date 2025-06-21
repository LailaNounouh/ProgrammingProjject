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

router.post('/add-samples', async (req, res) => {
  try {
    const samples = [
      [1, 1200.50, 'overschrijving', 'factuur_verzonden', null, 'factuur_accenture.pdf'],
      [8, 850.00, 'bancontact', 'ontvangen', null, 'factuur_dxc.pdf'],
      [50, 2000.00, 'creditcard', 'in_behandeling', null, 'factuur_safran.pdf'],
      [59, 999.99, 'overschrijving', 'verwerkt', null, 'factuur_yteria.pdf'],
    ];

    for (const sample of samples) {
      await pool.query(
        `INSERT INTO betalingen 
         (bedrijf_id, bedrag, methode, status, factuur_pdf, factuur_naam) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        sample
      );
    }

    res.json({ message: 'Voorbeelddata succesvol toegevoegd.' });
  } catch (error) {
    console.error('Fout bij invoegen voorbeelddata:', error);
    res.status(500).json({ message: 'Fout bij invoegen voorbeelddata.' });
  }
});

module.exports = router;
