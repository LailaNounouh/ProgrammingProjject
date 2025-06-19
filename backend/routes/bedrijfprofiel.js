const express = require('express');
const router = express.Router();
const db = require('../db');

// GET bedrijfsgegevens op basis van bedrijf_id
router.get('/:id', async (req, res) => {
  const bedrijfId = req.params.id;

  try {
    const [rows] = await db.execute(
      `SELECT
        bedrijf_id, naam, straat, nummer, postcode, gemeente,
        telefoonnummer, email, btw_nummer, contactpersoon_facturatie,
        email_facturatie, po_nummer, contactpersoon_beurs, email_beurs,
        website_of_linkedin, logo_url, staat_van_betaling, standselectie,
        opleidingsmatch, beschikbare_tijdsloten, speeddates,
        aanbiedingen, doelgroep_opleiding
      FROM bedrijven
      WHERE bedrijf_id = ?`,
      [bedrijfId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Fout bij ophalen bedrijfsgegevens:', error);
    res.status(500).json({ error: 'Fout bij ophalen bedrijfsgegevens' });
  }
});

// PUT update bedrijfsgegevens
router.put('/:id', async (req, res) => {
  const bedrijfId = req.params.id;
  const {
    naam, straat, nummer, postcode, gemeente,
    telefoonnummer, email, btw_nummer, contactpersoon_facturatie,
    email_facturatie, po_nummer, contactpersoon_beurs, email_beurs,
    website_of_linkedin, logo_url, staat_van_betaling, standselectie,
    opleidingsmatch, beschikbare_tijdsloten, speeddates,
    aanbiedingen, doelgroep_opleiding
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE bedrijven SET
        naam = ?, straat = ?, nummer = ?, postcode = ?, gemeente = ?,
        telefoonnummer = ?, email = ?, btw_nummer = ?, contactpersoon_facturatie = ?,
        email_facturatie = ?, po_nummer = ?, contactpersoon_beurs = ?, email_beurs = ?,
        website_of_linkedin = ?, logo_url = ?, staat_van_betaling = ?, standselectie = ?,
        opleidingsmatch = ?, beschikbare_tijdsloten = ?, speeddates = ?, aanbiedingen = ?, doelgroep_opleiding = ?
      WHERE bedrijf_id = ?`,
      [
        naam, straat, nummer, postcode, gemeente,
        telefoonnummer, email, btw_nummer, contactpersoon_facturatie,
        email_facturatie, po_nummer, contactpersoon_beurs, email_beurs,
        website_of_linkedin, logo_url, staat_van_betaling, standselectie,
        opleidingsmatch, beschikbare_tijdsloten, speeddates, aanbiedingen, doelgroep_opleiding,
        bedrijfId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    res.json({ message: 'Bedrijfsgegevens succesvol bijgewerkt' });
  } catch (error) {
    console.error('Fout bij updaten bedrijfsgegevens:', error);
    res.status(500).json({ error: 'Fout bij updaten bedrijfsgegevens' });
  }
});

module.exports = router;
