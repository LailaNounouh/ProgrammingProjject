const express = require('express');
const router = express.Router();
const pool = require('../db');

// Betaling toevoegen met extra datumvelden
router.post('/', async (req, res) => {
  const { 
    bedrijf_id, 
    bedrag, 
    methode, 
    status, 
    factuur_pdf, 
    factuur_naam,
    factuur_verzonden_datum,
    in_behandeling_datum,
    ontvangen_datum,
    verwerkt_datum
  } = req.body;

  if (!bedrijf_id || !bedrag || !methode || !status || !factuur_naam) {
    return res.status(400).json({ message: 'Verplichte velden ontbreken.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO betalingen 
        (bedrijf_id, bedrag, methode, status, factuur_pdf, factuur_naam, 
         factuur_verzonden_datum, in_behandeling_datum, ontvangen_datum, verwerkt_datum)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bedrijf_id, 
        bedrag, 
        methode, 
        status, 
        factuur_pdf || null, 
        factuur_naam,
        factuur_verzonden_datum || null,
        in_behandeling_datum || null,
        ontvangen_datum || null,
        verwerkt_datum || null
      ]
    );

    res.status(201).json({ message: 'Betaling toegevoegd', insertId: result.insertId });
  } catch (error) {
    console.error('Fout bij toevoegen betaling:', error);
    res.status(500).json({ message: 'Fout bij toevoegen betaling.' });
  }
});

// Hardcoded voorbeelddata invoegen test, uitgebreid met datumvelden
router.post('/add-samples', async (req, res) => {
  try {
    const samples = [
      [1, 1200.50, 'overschrijving', 'factuur_verzonden', null, 'factuur_accenture.pdf', '2025-06-01 10:00:00', null, null, null],
      [8, 850.00, 'bancontact', 'ontvangen', null, 'factuur_dxc.pdf', '2025-06-05 09:30:00', '2025-06-06 11:00:00', '2025-06-07 15:00:00', null],
      [50, 2000.00, 'creditcard', 'in_behandeling', null, 'factuur_safran.pdf', '2025-06-02 12:00:00', '2025-06-04 14:00:00', null, null],
      [59, 999.99, 'overschrijving', 'verwerkt', null, 'factuur_yteria.pdf', '2025-06-01 08:00:00', '2025-06-03 10:00:00', '2025-06-05 13:00:00', '2025-06-08 09:00:00'],
    ];

    for (const sample of samples) {
      await pool.query(
        `INSERT INTO betalingen 
         (bedrijf_id, bedrag, methode, status, factuur_pdf, factuur_naam,
          factuur_verzonden_datum, in_behandeling_datum, ontvangen_datum, verwerkt_datum) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sample
      );
    }

    res.json({ message: 'Voorbeelddata succesvol toegevoegd.' });
  } catch (error) {
    console.error('Fout bij invoegen voorbeelddata:', error);
    res.status(500).json({ message: 'Fout bij invoegen voorbeelddata.' });
  }
});

// Betaling ophalen voor een bedrijf, nu met dynamische datumvelden
router.get('/:bedrijf_id', async (req, res) => {
  const { bedrijf_id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT bedrag, methode, status, factuur_naam,
              DATE_FORMAT(datum, '%d %M %Y') AS datum,
              DATE_FORMAT(factuur_verzonden_datum, '%d %M %Y') AS factuur_verzonden,
              DATE_FORMAT(in_behandeling_datum, '%d %M %Y') AS in_behandeling,
              DATE_FORMAT(ontvangen_datum, '%d %M %Y') AS ontvangen,
              DATE_FORMAT(verwerkt_datum, '%d %M %Y') AS verwerkt
       FROM betalingen
       WHERE bedrijf_id = ?
       ORDER BY datum DESC
       LIMIT 1`,
      [bedrijf_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Geen betaling gevonden.' });
    }

    const betaling = rows[0];

    betaling.factuur_url = `/uploads/${betaling.factuur_naam}`;

    res.json(betaling);
  } catch (error) {
    console.error('Fout bij ophalen betaling:', error);
    res.status(500).json({ message: 'Fout bij ophalen betaling.' });
  }
});

module.exports = router;
