const express = require('express');
const router = express.Router();
const pool = require('../db');

// Dynamische data uit frontend
router.post('/', async (req, res) => {
  const { bedrijf_id, bedrag, methode, status, factuur_pdf, factuur_naam } = req.body;

  if (!bedrijf_id || !bedrag || !methode || !status || !factuur_naam) {
    return res.status(400).json({ message: 'Verplichte velden ontbreken.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO betalingen (bedrijf_id, bedrag, methode, status, factuur_pdf, factuur_naam)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bedrijf_id, bedrag, methode, status, factuur_pdf || null, factuur_naam]
    );

    res.status(201).json({ message: 'Betaling toegevoegd', insertId: result.insertId });
  } catch (error) {
    console.error('Fout bij toevoegen betaling:', error);
    res.status(500).json({ message: 'Fout bij toevoegen betaling.' });
  }
});

// Hardcoded voorbeelddata invoegen test
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
        `INSERT INTO betalingen (bedrijf_id, bedrag, methode, status, factuur_pdf, factuur_naam) 
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
