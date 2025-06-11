// bedrijvenmodule.js
const express = require('express');
const router = express.Router();
const db = require('./db'); // jouw database connectie, pas pad aan indien nodig

// GET /bedrijvenmodule - haal alle bedrijven met alle velden op
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      id,
      bedrijfsnaam,
      email,
      straat,
      nummer,
      postcode,
      gemeente,
      telefoonnummer,
      btw_nummer,
      naam_contactpersoon,
      email_contactpersoon,
      po_nummer,
      naam_contactpersoon_vertegenwoordiger,
      email_contactpersoon_vertegenwoordiger,
      website,
      linkedin,
      logo_url,
      sector_id,
      beschrijving
    FROM bedrijven
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fout bij ophalen bedrijven:', err);
      return res.status(500).json({ error: 'Interne serverfout' });
    }
    res.json(results);
  });
});

module.exports = router;
