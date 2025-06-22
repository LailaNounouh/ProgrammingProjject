const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Bedrijven');
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon bedrijven niet ophalen' });
  }
});

router.get('/:id', async (req, res) => {
  const bedrijfId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM Bedrijven WHERE bedrijf_id = ?', [bedrijfId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon bedrijf niet ophalen' });
  }
});

// PUT route to update company
router.put('/:id', async (req, res) => {
  const bedrijfId = req.params.id;

  try {
    console.log(`Updating company ${bedrijfId} with data:`, req.body);

    // Extract all possible fields from request body
    const {
      naam, straat, nummer, postcode, gemeente, telefoonnummer, email,
      btw_nummer, contactpersoon_facturatie, email_facturatie, po_nummer,
      contactpersoon_beurs, email_beurs, website_of_linkedin, logo_url,
      staat_van_betaling, standselectie, opleidingsmatch, beschikbare_tijdsloten,
      speeddates, aanbiedingen, doelgroep_opleiding, sector, wachtwoord
    } = req.body;

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    // Add fields that are present in the request
    if (naam !== undefined) { updateFields.push('naam = ?'); updateValues.push(naam); }
    if (straat !== undefined) { updateFields.push('straat = ?'); updateValues.push(straat); }
    if (nummer !== undefined) { updateFields.push('nummer = ?'); updateValues.push(nummer); }
    if (postcode !== undefined) { updateFields.push('postcode = ?'); updateValues.push(postcode); }
    if (gemeente !== undefined) { updateFields.push('gemeente = ?'); updateValues.push(gemeente); }
    if (telefoonnummer !== undefined) { updateFields.push('telefoonnummer = ?'); updateValues.push(telefoonnummer); }
    if (email !== undefined) { updateFields.push('email = ?'); updateValues.push(email); }
    if (btw_nummer !== undefined) { updateFields.push('btw_nummer = ?'); updateValues.push(btw_nummer); }
    if (contactpersoon_facturatie !== undefined) { updateFields.push('contactpersoon_facturatie = ?'); updateValues.push(contactpersoon_facturatie); }
    if (email_facturatie !== undefined) { updateFields.push('email_facturatie = ?'); updateValues.push(email_facturatie); }
    if (po_nummer !== undefined) { updateFields.push('po_nummer = ?'); updateValues.push(po_nummer); }
    if (contactpersoon_beurs !== undefined) { updateFields.push('contactpersoon_beurs = ?'); updateValues.push(contactpersoon_beurs); }
    if (email_beurs !== undefined) { updateFields.push('email_beurs = ?'); updateValues.push(email_beurs); }
    if (website_of_linkedin !== undefined) { updateFields.push('website_of_linkedin = ?'); updateValues.push(website_of_linkedin); }
    if (logo_url !== undefined) { updateFields.push('logo_url = ?'); updateValues.push(logo_url); }
    if (staat_van_betaling !== undefined) { updateFields.push('staat_van_betaling = ?'); updateValues.push(staat_van_betaling); }
    if (standselectie !== undefined) { updateFields.push('standselectie = ?'); updateValues.push(standselectie); }
    if (opleidingsmatch !== undefined) { updateFields.push('opleidingsmatch = ?'); updateValues.push(opleidingsmatch); }
    if (beschikbare_tijdsloten !== undefined) { updateFields.push('beschikbare_tijdsloten = ?'); updateValues.push(beschikbare_tijdsloten); }
    if (speeddates !== undefined) { updateFields.push('speeddates = ?'); updateValues.push(speeddates ? 1 : 0); }
    if (aanbiedingen !== undefined) { updateFields.push('aanbiedingen = ?'); updateValues.push(aanbiedingen); }
    if (doelgroep_opleiding !== undefined) { updateFields.push('doelgroep_opleiding = ?'); updateValues.push(doelgroep_opleiding); }
    if (sector !== undefined) { updateFields.push('sector = ?'); updateValues.push(sector); }
    if (wachtwoord !== undefined) { updateFields.push('wachtwoord = ?'); updateValues.push(wachtwoord); }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Geen velden om bij te werken' });
    }

    // Add the ID to the end of values array
    updateValues.push(bedrijfId);

    const updateQuery = `UPDATE Bedrijven SET ${updateFields.join(', ')} WHERE bedrijf_id = ?`;

    console.log('Update query:', updateQuery);
    console.log('Update values:', updateValues);

    const [result] = await db.query(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    res.json({
      success: true,
      message: 'Bedrijf succesvol bijgewerkt',
      affectedRows: result.affectedRows
    });

  } catch (error) {
    console.error('Database error bij bijwerken bedrijf:', error);
    res.status(500).json({ error: 'Kon bedrijf niet bijwerken', details: error.message });
  }
});

module.exports = router;
