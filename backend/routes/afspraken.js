const express = require('express');
const router = express.Router();
const pool = require('../db');

// Fallback tijdsloten
const STANDAARD_TIJDEN = [
  '13:30', '13:45', '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45', '16:00', '16:15',
];

/**
 * @route GET /api/afspraken
 * @desc Haal alle afspraken op (admin functie)
 */
router.get('/', async (req, res) => {
  try {
    const [afspraken] = await pool.query(`
      SELECT a.afspraak_id, a.student_id, a.bedrijf_id, a.tijdslot, a.datum,
             b.naam AS bedrijfsnaam 
      FROM Afspraken a
      JOIN Bedrijven b ON a.bedrijf_id = b.bedrijf_id
      ORDER BY a.datum DESC, a.tijdslot ASC
    `);

    res.json(afspraken);
  } catch (err) {
    console.error('[Serverfout] Afspraken ophalen mislukt:', err);
    res.status(500).json({
      error: 'Fout bij ophalen afspraken',
      message: err.message,
    });
  }
});

/**
 * @route GET /api/afspraken/student/:studentId
 * @desc Haal alle afspraken op van een specifieke student
 */
router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const [afspraken] = await pool.query(`
      SELECT a.afspraak_id, a.tijdslot, a.datum,
             b.naam AS bedrijfsnaam, b.logo_url
      FROM Afspraken a
      JOIN Bedrijven b ON a.bedrijf_id = b.bedrijf_id
      WHERE a.student_id = ?
      ORDER BY a.datum DESC, a.tijdslot ASC
    `, [studentId]);

    res.json(afspraken);
  } catch (err) {
    console.error('[Serverfout] Student afspraken ophalen mislukt:', err);
    res.status(500).json({
      error: 'Fout bij ophalen afspraken',
      message: err.message,
    });
  }
});


router.get('/bedrijf/:bedrijfId', async (req, res) => {
  const { bedrijfId } = req.params;
  
  try {
    const [afspraken] = await pool.query(`
      SELECT a.afspraak_id, a.tijdslot, a.datum,
             s.id AS student_id, s.naam AS studentnaam, s.email AS studentemail
      FROM Afspraken a
      JOIN Studenten s ON a.student_id = s.id
      WHERE a.bedrijf_id = ?
      ORDER BY a.datum DESC, a.tijdslot ASC
    `, [bedrijfId]);

    res.json(afspraken);
  } catch (err) {
    console.error('[Serverfout] Bedrijf afspraken ophalen mislukt:', err);
    res.status(500).json({
      error: 'Fout bij ophalen afspraken',
      message: err.message,
    });
  }
});


router.get('/beschikbaar/:bedrijfId', async (req, res) => {
  const { bedrijfId } = req.params;
  const datum = req.query.datum || new Date().toISOString().split('T')[0]; // fallback: vandaag

  console.log(`[GET] Beschikbare tijdsloten voor bedrijf ${bedrijfId} op ${datum}`);

  try {
    // Controleer of bedrijf bestaat
    const [bedrijven] = await pool.query(
      'SELECT * FROM Bedrijven WHERE bedrijf_id = ?',
      [bedrijfId]
    );

    if (bedrijven.length === 0) {
      return res.status(404).json({
        error: 'Bedrijf niet gevonden',
      });
    }

    const bedrijf = bedrijven[0];

    // Haal reeds gemaakte afspraken op voor dit bedrijf en deze datum
    const [afspraken] = await pool.query(
      `SELECT tijdslot FROM Afspraken 
       WHERE bedrijf_id = ? AND datum = ?`,
      [bedrijfId, datum]
    );

    // Parse beschikbare tijdsloten vanuit DB of gebruik standaard
    let alleTijdsloten = STANDAARD_TIJDEN;

    if (bedrijf.beschikbare_tijdsloten) {
      try {
        const bedrijfTijdsloten = JSON.parse(bedrijf.beschikbare_tijdsloten);
        if (Array.isArray(bedrijfTijdsloten) && bedrijfTijdsloten.length > 0) {
          alleTijdsloten = bedrijfTijdsloten;
        }
      } catch (e) {
        console.warn('Kon bedrijfstijdsloten niet parsen:', e);
      }
    }

    const bezetteTijdsloten = afspraken.map((a) => a.tijdslot);
    const beschikbareTijdsloten = alleTijdsloten.filter(
      (tijd) => !bezetteTijdsloten.includes(tijd)
    );

    return res.json({
      beschikbaar: beschikbareTijdsloten,
      bezet: bezetteTijdsloten,
      alle: alleTijdsloten,
    });
  } catch (err) {
    console.error('[Serverfout] Tijdsloten ophalen mislukt:', err);
    return res.status(500).json({
      error: 'Fout bij ophalen tijdsloten',
      message: err.message,
    });
  }
});


router.post('/nieuw', async (req, res) => {
  const { student_id, bedrijf_id, tijdslot, datum } = req.body;

  // Basic validatie
  if (!student_id || !bedrijf_id || !tijdslot || !datum) {
    return res.status(400).json({
      error: 'Verplichte velden ontbreken',
    });
  }

  try {
    // Controleer of dit tijdslot beschikbaar is
    const [bestaandeAfspraken] = await pool.query(
      'SELECT * FROM Afspraken WHERE bedrijf_id = ? AND datum = ? AND tijdslot = ?',
      [bedrijf_id, datum, tijdslot]
    );

    if (bestaandeAfspraken.length > 0) {
      return res.status(409).json({
        error: 'Tijdslot is al bezet',
      });
    }

    // Voeg de afspraak toe
    const [result] = await pool.query(
      `INSERT INTO Afspraken 
       (student_id, bedrijf_id, tijdslot, datum) 
       VALUES (?, ?, ?, ?)`,
      [student_id, bedrijf_id, tijdslot, datum]
    );

    return res.status(201).json({
      message: 'Afspraak succesvol gemaakt',
      afspraak_id: result.insertId,
    });
  } catch (err) {
    console.error('[Serverfout] Afspraak maken mislukt:', err);
    return res.status(500).json({
      error: 'Fout bij maken afspraak',
      message: err.message,
    });
  }
});

/**
 * @route PUT /api/afspraken/:afspraakId
 * @desc Update een bestaande afspraak
 */
router.put('/:afspraakId', async (req, res) => {
  const { afspraakId } = req.params;
  const { tijdslot, datum } = req.body;

  if (!tijdslot && !datum) {
    return res.status(400).json({
      error: 'Geen wijzigingen opgegeven',
    });
  }

  try {
    // Controleer of afspraak bestaat
    const [afspraken] = await pool.query(
      'SELECT * FROM Afspraken WHERE afspraak_id = ?',
      [afspraakId]
    );

    if (afspraken.length === 0) {
      return res.status(404).json({
        error: 'Afspraak niet gevonden',
      });
    }

    // Bouw de update query dynamisch op
    let updateQuery = 'UPDATE Afspraken SET ';
    const updateValues = [];
    const updateFields = [];

    if (tijdslot) {
      updateFields.push('tijdslot = ?');
      updateValues.push(tijdslot);
    }

    if (datum) {
      updateFields.push('datum = ?');
      updateValues.push(datum);
    }

    updateQuery += updateFields.join(', ');
    updateQuery += ' WHERE afspraak_id = ?';
    updateValues.push(afspraakId);

    // Voer update uit
    await pool.query(updateQuery, updateValues);

    return res.json({
      message: 'Afspraak succesvol bijgewerkt',
    });
  } catch (err) {
    console.error('[Serverfout] Afspraak bijwerken mislukt:', err);
    return res.status(500).json({
      error: 'Fout bij bijwerken afspraak',
      message: err.message,
    });
  }
});
/**
 * @route GET /api/afspraken/bezet
 * @desc Haal bezette tijdsloten op voor een specifiek bedrijf op een specifieke datum
 */
router.get('/bezet', async (req, res) => {
  const { bedrijf_id, datum } = req.query;

  if (!bedrijf_id || !datum) {
    return res.status(400).json({ 
      error: 'Bedrijf ID en datum zijn verplicht'
    });
  }

  try {
    // Controleer of er afspraken zijn voor dit bedrijf op deze datum
    const [afspraken] = await pool.query(
      'SELECT tijdslot FROM Afspraken WHERE bedrijf_id = ? AND datum = ?',
      [bedrijf_id, datum]
    );

    // Haal de bezette tijdsloten uit de resultaten
    const bezette_tijdsloten = afspraken.map(afspraak => afspraak.tijdslot);

    return res.json({
      bedrijf_id,
      datum,
      bezette_tijdsloten
    });
  } catch (err) {
    console.error('[Serverfout] Ophalen bezette tijdsloten mislukt:', err);
    return res.status(500).json({
      error: 'Fout bij ophalen bezette tijdsloten',
      message: err.message
    });
  }
});
/**
 * @route DELETE /api/afspraken/:afspraakId
 * @desc Verwijder een afspraak
 */
router.delete('/:afspraakId', async (req, res) => {
  const { afspraakId } = req.params;

  try {
    // Controleer of afspraak bestaat
    const [afspraken] = await pool.query(
      'SELECT * FROM Afspraken WHERE afspraak_id = ?',
      [afspraakId]
    );

    if (afspraken.length === 0) {
      return res.status(404).json({
        error: 'Afspraak niet gevonden',
      });
    }

    // Verwijder de afspraak
    await pool.query('DELETE FROM Afspraken WHERE afspraak_id = ?', [afspraakId]);

    return res.json({
      message: 'Afspraak succesvol verwijderd',
    });
  } catch (err) {
    console.error('[Serverfout] Afspraak verwijderen mislukt:', err);
    return res.status(500).json({
      error: 'Fout bij verwijderen afspraak',
      message: err.message,
    });
  }
});

module.exports = router;
