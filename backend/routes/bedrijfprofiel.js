const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole, requireOwnership } = require('../middleware/auth');

// GET bedrijfsgegevens op basis van bedrijf_id (tijdelijk zonder auth voor debugging)
router.get('/:id', async (req, res) => {
  const bedrijfId = req.params.id;
  console.log('🔍 Fetching bedrijfprofiel for ID:', bedrijfId);

  try {
    const [rows] = await db.execute(
      `SELECT
        b.bedrijf_id, b.naam, b.straat, b.nummer, b.postcode, b.gemeente,
        b.telefoonnummer, b.email, b.btw_nummer, b.contactpersoon_facturatie,
        b.email_facturatie, b.po_nummer, b.contactpersoon_beurs, b.email_beurs,
        b.website_of_linkedin, b.logo_url, b.staat_van_betaling, b.standselectie,
        b.opleidingsmatch, b.beschikbare_tijdsloten, b.speeddates,
        b.aanbiedingen, b.doelgroep_opleiding,
        bs.sector_id, s.naam as sector_naam
      FROM Bedrijven b
      LEFT JOIN Bedrijf_Sector bs ON b.bedrijf_id = bs.bedrijf_id
      LEFT JOIN Sectoren s ON bs.sector_id = s.sector_id
      WHERE b.bedrijf_id = ?`,
      [bedrijfId]
    );

    if (rows.length === 0) {
      console.log('❌ Bedrijf niet gevonden voor ID:', bedrijfId);
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    console.log('✅ Bedrijfprofiel gevonden:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Fout bij ophalen bedrijfsgegevens:', error);
    res.status(500).json({ error: 'Fout bij ophalen bedrijfsgegevens' });
  }
});

// PUT update bedrijfsgegevens
router.put('/:id', authenticateToken, requireRole(['bedrijf', 'admin']), requireOwnership, async (req, res) => {
  const bedrijfId = req.params.id;
  const {
    naam, straat, nummer, postcode, gemeente,
    telefoonnummer, email, btw_nummer, contactpersoon_facturatie,
    email_facturatie, po_nummer, contactpersoon_beurs, email_beurs,
    website_of_linkedin, logo_url, staat_van_betaling, standselectie,
    opleidingsmatch, beschikbare_tijdsloten, speeddates,
    aanbiedingen, doelgroep_opleiding, sector_id
  } = req.body;

  try {
    // Start transaction
    await db.execute('START TRANSACTION');

    // Update company data
    const [result] = await db.execute(
      `UPDATE Bedrijven SET
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
      await db.execute('ROLLBACK');
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    // Update sector relationship if provided
    if (sector_id) {
      // Delete existing sector relationship
      await db.execute('DELETE FROM Bedrijf_Sector WHERE bedrijf_id = ?', [bedrijfId]);

      // Insert new sector relationship
      await db.execute(
        'INSERT INTO Bedrijf_Sector (bedrijf_id, sector_id) VALUES (?, ?)',
        [bedrijfId, sector_id]
      );
    }

    // Commit transaction
    await db.execute('COMMIT');

    res.json({ message: 'Bedrijfsgegevens succesvol bijgewerkt' });
  } catch (error) {
    // Rollback on error
    await db.execute('ROLLBACK');
    console.error('Fout bij updaten bedrijfsgegevens:', error);
    res.status(500).json({ error: 'Fout bij updaten bedrijfsgegevens' });
  }
});

module.exports = router;
