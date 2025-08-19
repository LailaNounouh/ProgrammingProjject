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
  
  console.log('🔄 Updating bedrijf ID:', bedrijfId);
  console.log('📦 Request body:', req.body);

  // Toegestane velden + mapping DB kolomnamen
  const fieldMap = {
    naam: 'naam',
    straat: 'straat',
    nummer: 'nummer',
    postcode: 'postcode',
    gemeente: 'gemeente',
    telefoonnummer: 'telefoonnummer',
    email: 'email',
    btw_nummer: 'btw_nummer',
    contactpersoon_facturatie: 'contactpersoon_facturatie',
    email_facturatie: 'email_facturatie',
    po_nummer: 'po_nummer',
    contactpersoon_beurs: 'contactpersoon_beurs',
    email_beurs: 'email_beurs',
    website_of_linkedin: 'website_of_linkedin',
    logo_url: 'logo_url',
    staat_van_betaling: 'staat_van_betaling',
    standselectie: 'standselectie',
    opleidingsmatch: 'opleidingsmatch',
    beschikbare_tijdsloten: 'beschikbare_tijdsloten',
    speeddates: 'speeddates',
    aanbiedingen: 'aanbiedingen',
    doelgroep_opleiding: 'doelgroep_opleiding'
  };

  const body = req.body || {};
  const sectorId = body.sector_id; // apart behandelen
  const updateParts = [];
  const values = [];

  // AANGEPASTE LOGICA: Accept null values en skip alleen undefined
  Object.entries(fieldMap).forEach(([key, col]) => {
    if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
      console.log(`🔧 Processing field ${key}:`, body[key], typeof body[key]);
      
      // Normaliseer booleans naar 0/1 voor speeddates indien nodig
      if (key === 'speeddates') {
        updateParts.push(`${col} = ?`);
        values.push(body[key] ? 1 : 0);
      } else {
        updateParts.push(`${col} = ?`);
        // Accepteer null waarden - verwijder de body[key] !== '' check
        values.push(body[key]);
      }
    }
  });

  console.log('📝 Update parts:', updateParts);
  console.log('🎯 Values:', values);

  if (updateParts.length === 0 && !sectorId) {
    return res.status(400).json({ error: 'Geen velden om bij te werken' });
  }

  const conn = db;
  try {
    await conn.execute('START TRANSACTION');

    if (updateParts.length > 0) {
      const sql = `UPDATE Bedrijven SET ${updateParts.join(', ')} WHERE bedrijf_id = ?`;
      values.push(bedrijfId);
      
      console.log('🚀 Executing SQL:', sql);
      console.log('🎯 With values:', values);
      
      const [result] = await conn.execute(sql, values);
      if (result.affectedRows === 0) {
        await conn.execute('ROLLBACK');
        return res.status(404).json({ error: 'Bedrijf niet gevonden' });
      }
      
      console.log('✅ Update successful, affected rows:', result.affectedRows);
    }

    if (sectorId) {
      console.log('🏢 Updating sector to:', sectorId);
      await conn.execute('DELETE FROM Bedrijf_Sector WHERE bedrijf_id = ?', [bedrijfId]);
      await conn.execute(
        'INSERT INTO Bedrijf_Sector (bedrijf_id, sector_id) VALUES (?, ?)',
        [bedrijfId, sectorId]
      );
    }

    await conn.execute('COMMIT');

    // Haal actuele data terug
    const [rows] = await conn.execute(
      `SELECT b.*, s.naam AS sector_naam, bs.sector_id
       FROM Bedrijven b
       LEFT JOIN Bedrijf_Sector bs ON b.bedrijf_id = bs.bedrijf_id
       LEFT JOIN Sectoren s ON s.sector_id = bs.sector_id
       WHERE b.bedrijf_id = ?`,
      [bedrijfId]
    );

    console.log('🎉 Update completed successfully');
    res.json({ success: true, message: 'Bijgewerkt', data: rows[0] || null });
  } catch (e) {
    await conn.execute('ROLLBACK');
    console.error('❌ Update error:', e);
    res.status(500).json({ error: 'Fout bij updaten bedrijfsgegevens', details: e.message });
  }
});

module.exports = router;
