const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/stats', async (req, res) => {
  try {
    const [[bedrijven]] = await pool.query('SELECT COUNT(*) AS totaal FROM bedrijven');
    const [[studenten]] = await pool.query('SELECT COUNT(*) AS totaal FROM studenten');
    const [[werkzoekenden]] = await pool.query('SELECT COUNT(*) AS totaal FROM werkzoekenden');

    res.json({
      totaalBedrijven: bedrijven.totaal,
      totaalGebruikers: studenten.totaal + werkzoekenden.totaal,
      totaalStudenten: studenten.totaal,
      totaalWerkzoekenden: werkzoekenden.totaal
    });
  } catch (err) {
    res.status(500).json({ error: 'Statistieken ophalen mislukt' });
  }
});

router.get('/bedrijven', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Bedrijven');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Bedrijven ophalen mislukt' });
  }
});

router.put('/bedrijven/:id', async (req, res) => {
  const { id } = req.params;
  const { naam, email, telefoonnummer, gemeente, website_of_linkedin } = req.body;
  try {
    await pool.query(
      'UPDATE bedrijven SET naam=?, email=?, telefoonnummer=?, gemeente=?, website_of_linkedin=? WHERE bedrijf_id=?',
      [naam, email, telefoonnummer, gemeente, website_of_linkedin, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Bedrijf bijwerken mislukt' });
  }
});

router.get('/gebruikers', async (req, res) => {
  try {
    const [studenten] = await pool.query('SELECT student_id AS id, "student" AS rol FROM studenten');
    const [werkzoekenden] = await pool.query('SELECT werkzoekende_id AS id, "werkzoekende" AS rol FROM werkzoekenden');
    res.json([...studenten, ...werkzoekenden]);
  } catch (err) {
    res.status(500).json({ error: 'Gebruikers ophalen mislukt' });
  }
});

router.get('/sectoren', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sectoren');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Sectoren ophalen mislukt' });
  }
});

router.post('/sectoren', async (req, res) => {
  const { naam } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO sectoren (naam, zichtbaar) VALUES (?, 1)', [naam]);
    res.status(201).json({ id: result.insertId, naam, zichtbaar: 1 });
  } catch (err) {
    res.status(500).json({ error: 'Sector toevoegen mislukt' });
  }
});

router.put('/sectoren/:id', async (req, res) => {
  const { id } = req.params;
  const { zichtbaar } = req.body;
  try {
    await pool.query('UPDATE sectoren SET zichtbaar = ? WHERE id = ?', [zichtbaar, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Sector bijwerken mislukt' });
  }
});

// ophalen van de bedrijven en hun standen
router.get('/bedrijven-standen', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        b.bedrijf_id,
        b.naam as company_name,
        b.contactpersoon_beurs as contact_person,
        b.email_beurs as email,
        b.speeddates as speeddate_enabled,
        p.plaats_id,
        p.type as location_type,
        p.nummer as location_number
      FROM Bedrijven b
      LEFT JOIN plattegrond p ON b.bedrijf_id = p.bedrijf_id
      ORDER BY b.naam
    `);
    res.json(rows);
  } catch (error) {
    console.error('Fout bij ophalen bedrijven met standen:', error);
    res.status(500).json({ error: 'Bedrijven met standen ophalen mislukt' });
  }
});

//  Plattegrond toewijzing voor een bedrijf
router.put('/bedrijven/:id/stand', async (req, res) => {
  const { id } = req.params;
  const { plaats_id, speeddate_enabled } = req.body;
 
   try {
 // zorgen voor een soepele beweging in de database 
    await pool.query('START TRANSACTION'); 

     await pool.query('UPDATE plattegrond SET bedrijf_id = NULL WHERE bedrijf_id = ?', [id]);
    
    // Als een nieuwe plaats is geselecteerd, wijs deze toe
    if (plaats_id) {
      // Controleer of de plaats al bezet is
      const [existing] = await pool.query(
        'SELECT bedrijf_id FROM plattegrond WHERE plaats_id = ? AND bedrijf_id IS NOT NULL',
        [plaats_id]
      );
      
      if (existing.length > 0) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ 
          error: 'Deze plaats is al bezet door een ander bedrijf' 
        });
      }
      
      // Wijs de nieuwe plaats toe
      await pool.query(
        'UPDATE plattegrond SET bedrijf_id = ? WHERE plaats_id = ?',
        [id, plaats_id]
      );
    }
    
    await pool.query(
      'UPDATE Bedrijven SET speeddates = ? WHERE bedrijf_id = ?',
      [speeddate_enabled || 0, id]
    );
    
    await pool.query('COMMIT');
    res.json({ success: true, message: 'Stand toewijzing bijgewerkt' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Fout bij bijwerken stand toewijzing:', error);
    res.status(500).json({ error: 'Stand toewijzing bijwerken mislukt' });
  }
});

// Haal beschikbare plaatsen op
router.get('/beschikbare-standen', async (req, res) => {
  try {
    const [plaatsen] = await pool.query(`
      SELECT 
        p.plaats_id,
        p.type,
        p.nummer,
        p.bedrijf_id,
        b.naam as company_name
      FROM plattegrond p
      LEFT JOIN Bedrijven b ON p.bedrijf_id = b.bedrijf_id
      ORDER BY p.type, p.nummer
    `);

    // Groepeer per type
    const grouped = {
      aula: plaatsen.filter(p => p.type === 'aula'),
      tafel: plaatsen.filter(p => p.type === 'tafel')
    };

    // Bereken statistieken
    const stats = {
      aula: {
        total: grouped.aula.length,
        occupied: grouped.aula.filter(p => p.bedrijf_id).length,
        available: grouped.aula.filter(p => !p.bedrijf_id).length
      },
      tafel: {
        total: grouped.tafel.length,
        occupied: grouped.tafel.filter(p => p.bedrijf_id).length,
        available: grouped.tafel.filter(p => !p.bedrijf_id).length
      }
    };

    res.json({
      plaatsen: grouped,
      stats: stats,
      all: plaatsen
    });
  } catch (error) {
    console.error('Fout bij ophalen beschikbare standen:', error);
    res.status(500).json({ error: 'Beschikbare standen ophalen mislukt' });
  }
});


// Toewijzing van bedrijven aan plaatsen
router.post('/bedrijven-toewijzen', async (req, res) => {
  // Array van {bedrijf_id, plaats_id}
  const { assignments } = req.body; 
  
  try {
    // Start transactie
    await pool.query('START TRANSACTION');
    
    for (const assignment of assignments) {
      const { bedrijf_id, plaats_id } = assignment;
      
      if (plaats_id) {
        // Controleer of de plaats beschikbaar is
        const [existing] = await pool.query(
          'SELECT bedrijf_id FROM plattegrond WHERE plaats_id = ? AND bedrijf_id IS NOT NULL AND bedrijf_id != ?',
          [plaats_id, bedrijf_id]
        );
        
        if (existing.length > 0) {
          await pool.query('ROLLBACK');
          return res.status(400).json({ 
            error: `Plaats ${plaats_id} is al bezet` 
          });
        }
      }
      
      // Verwijder bestaande toewijzing van dit bedrijf
      await pool.query('UPDATE plattegrond SET bedrijf_id = NULL WHERE bedrijf_id = ?', [bedrijf_id]);
      
      // Wijs nieuwe plaats toe (als het opgegeven wordt)
      if (plaats_id) {
        await pool.query(
          'UPDATE plattegrond SET bedrijf_id = ? WHERE plaats_id = ?',
          [bedrijf_id, plaats_id]
        );
      }
    }
    
    await pool.query('COMMIT');
    res.json({ success: true, message: ' Toewijzing voltooid' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Fout bij toewijzing:', err);
    res.status(500).json({ error: 'Toewijzing mislukt' });
  }
});

// Reset alle stand toewijzingen
router.post('/reset-standen', async (req, res) => {
  try {
    await pool.query('UPDATE plattegrond SET bedrijf_id = NULL');
    res.json({ success: true, message: 'Alle stand toewijzingen gereset' });
  } catch (err) {
    console.error('Fout bij resetten standen:', err);
    res.status(500).json({ error: 'Standen resetten mislukt' });
  }
});


// Haal plattegrond data op voor visualisatie
router.get('/plattegrond', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.plaats_id,
        p.type,
        p.nummer,
        p.bedrijf_id,
        b.naam as company_name
      FROM plattegrond p
      LEFT JOIN Bedrijven b ON p.bedrijf_id = b.bedrijf_id
      ORDER BY p.type, p.nummer
    `);
    res.json(rows);
  } catch (err) {
    console.error('Fout bij ophalen plattegrond:', err);
    res.status(500).json({ error: 'Plattegrond ophalen mislukt' });
  }
});



module.exports = router;