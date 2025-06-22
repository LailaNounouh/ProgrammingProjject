const express = require('express');
const router = express.Router();
const pool = require('../db');

const STANDAARD_TIJDEN = [
  '13:30', '13:45', '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45', '16:00', '16:15',
];

/**
 * @route GET /api/afspraken
 * @desc Haal alle afspraken op (voor admin)
 */
router.get('/', async (req, res) => {
  try {
    const [afspraken] = await pool.query(`
      SELECT a.afspraak_id, a.student_id, a.bedrijf_id, a.tijdslot, a.datum, a.status,
             b.naam AS bedrijfsnaam
      FROM Afspraken a
      JOIN Bedrijven b ON a.bedrijf_id = b.bedrijf_id
      ORDER BY a.datum DESC, a.tijdslot ASC
    `);
    res.json(afspraken);
  } catch (err) {
    console.error('[Serverfout] Afspraken ophalen mislukt:', err);
    res.status(500).json({ error: 'Fout bij ophalen afspraken', message: err.message });
  }
});

/**
 * @route GET /api/afspraken/student/:studentId
 * @desc Haal afspraken op voor een specifieke student
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
    console.error('[Serverfout] Afspraken voor student ophalen mislukt:', err);
    res.status(500).json({ error: 'Fout bij ophalen afspraken', message: err.message });
  }
});

/**
 * @route GET /api/afspraken/bedrijf/:bedrijfId
 * @desc Haal afspraken op voor een specifiek bedrijf
 */
router.get('/bedrijf/:bedrijfId', async (req, res) => {
  const { bedrijfId } = req.params;
  try {
    const [afspraken] = await pool.query(`
      SELECT a.afspraak_id, a.tijdslot, a.datum, a.student_id, a.status,
             s.naam AS studentnaam, s.email AS studentemail
      FROM Afspraken a
      JOIN Studenten s ON a.student_id = s.student_id
      WHERE a.bedrijf_id = ?
      ORDER BY a.datum DESC, a.tijdslot ASC
    `, [bedrijfId]);

    res.json(afspraken);
  } catch (err) {
    console.error('[Serverfout] Afspraken voor bedrijf ophalen mislukt:', err);
    res.status(500).json({ error: 'Fout bij ophalen afspraken', message: err.message });
  }
});

/**
 * @route GET /api/afspraken/beschikbaar/:bedrijfId?datum=yyyy-mm-dd
 * @desc Haal beschikbare tijdsloten op voor een bedrijf op een bepaalde dag
 */
router.get('/beschikbaar/:bedrijfId', async (req, res) => {
  const { bedrijfId } = req.params;
  const datum = req.query.datum || new Date().toISOString().split('T')[0];

  try {
    const [bedrijven] = await pool.query('SELECT * FROM Bedrijven WHERE bedrijf_id = ?', [bedrijfId]);

    if (bedrijven.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    const bedrijf = bedrijven[0];
    let alleTijdsloten = STANDAARD_TIJDEN;

    // Als het bedrijf eigen tijdsloten heeft ingesteld
    if (bedrijf.beschikbare_tijdsloten) {
      try {
        const parsed = JSON.parse(bedrijf.beschikbare_tijdsloten);
        if (Array.isArray(parsed)) alleTijdsloten = parsed;
      } catch (err) {
        alleTijdsloten = bedrijf.beschikbare_tijdsloten
          .split(',')
          .map((t) => t.trim());
      }
    }

    const [afspraken] = await pool.query(
      'SELECT tijdslot FROM Afspraken WHERE bedrijf_id = ? AND datum = ?',
      [bedrijfId, datum]
    );

    const bezetteTijdsloten = afspraken.map((a) => a.tijdslot);
    const beschikbareTijdsloten = alleTijdsloten.filter(
      (tijd) => !bezetteTijdsloten.includes(tijd)
    );

    res.json({
      beschikbaar: beschikbareTijdsloten,
      bezet: bezetteTijdsloten,
      alle: alleTijdsloten,
    });
  } catch (err) {
    console.error('[Serverfout] Tijdsloten ophalen mislukt:', err);
    res.status(500).json({ error: 'Fout bij ophalen tijdsloten', message: err.message });
  }
});

/**
 * @route POST /api/afspraken/nieuw
 * @desc Maak een nieuwe afspraak aan
 */
router.post('/nieuw', async (req, res) => {
  const { student_id, bedrijf_id, tijdslot, datum } = req.body;

  if (!student_id || !bedrijf_id || !tijdslot || !datum) {
    return res.status(400).json({
      error: 'Verplichte velden ontbreken',
    });
  }

  try {
    // Check 1: Tijdslot already taken by this company
    const [bestaandeTijdslot] = await pool.query(
      'SELECT * FROM Afspraken WHERE bedrijf_id = ? AND datum = ? AND tijdslot = ?',
      [bedrijf_id, datum, tijdslot]
    );

    if (bestaandeTijdslot.length > 0) {
      return res.status(409).json({ error: 'Dit tijdslot is al bezet bij dit bedrijf' });
    }

    // Check 2: Student already has appointment at same time (different company)
    const [studentTijdslot] = await pool.query(
      'SELECT * FROM Afspraken WHERE student_id = ? AND datum = ? AND tijdslot = ?',
      [student_id, datum, tijdslot]
    );

    if (studentTijdslot.length > 0) {
      return res.status(409).json({ error: 'Je hebt al een afspraak op dit tijdslot' });
    }

    // Check 3: Student already has appointment with this company (any time)
    const [studentBedrijf] = await pool.query(
      'SELECT * FROM Afspraken WHERE student_id = ? AND bedrijf_id = ?',
      [student_id, bedrijf_id]
    );

    if (studentBedrijf.length > 0) {
      return res.status(409).json({ error: 'Je hebt al een afspraak met dit bedrijf' });
    }

    // All checks passed, create the appointment
    const [result] = await pool.query(
      `INSERT INTO Afspraken (student_id, bedrijf_id, tijdslot, datum, status)
       VALUES (?, ?, ?, ?, 'in_afwachting')`,
      [student_id, bedrijf_id, tijdslot, datum]
    );

    const afspraak_id = result.insertId;

    // Create notification for company
    await pool.query(`
      INSERT INTO Bedrijf_Notifications
        (bedrijf_id, type, message, is_read, created_at)
       VALUES (?, 'appointment', ?, 0, NOW())`,
      [bedrijf_id, `Nieuwe afspraak aanvraag op ${datum} om ${tijdslot} van student ID ${student_id}`]
    );

    return res.status(201).json({
      message: 'Afspraak succesvol aangemaakt en wacht op goedkeuring',
      afspraak_id,
      status: 'in_afwachting'
    });
  } catch (err) {
    console.error('[Serverfout] Afspraak maken mislukt:', err);
    res.status(500).json({
      error: 'Fout bij maken afspraak',
      message: err.message,
    });
  }
});

/**
 * @route PUT /api/afspraken/:afspraakId
 * @desc Update een bestaande afspraak (datum en/of tijdslot)
 */
router.put('/:afspraakId', async (req, res) => {
  const { afspraakId } = req.params;
  const { tijdslot, datum } = req.body;

  if (!tijdslot && !datum) {
    return res.status(400).json({ error: 'Geen wijzigingen opgegeven' });
  }

  try {
    const [afspraken] = await pool.query('SELECT * FROM Afspraken WHERE afspraak_id = ?', [afspraakId]);
    if (afspraken.length === 0) {
      return res.status(404).json({ error: 'Afspraak niet gevonden' });
    }

    const updates = [];
    const values = [];

    if (tijdslot) {
      updates.push('tijdslot = ?');
      values.push(tijdslot);
    }

    if (datum) {
      updates.push('datum = ?');
      values.push(datum);
    }

    values.push(afspraakId);

    await pool.query(`UPDATE Afspraken SET ${updates.join(', ')} WHERE afspraak_id = ?`, values);
    res.json({ message: 'Afspraak succesvol bijgewerkt' });
  } catch (err) {
    console.error('[Serverfout] Afspraak bijwerken mislukt:', err);
    res.status(500).json({ error: 'Fout bij bijwerken afspraak', message: err.message });
  }
});

/**
 * @route DELETE /api/afspraken/:afspraakId
 * @desc Verwijder een afspraak
 */
router.delete('/:afspraakId', async (req, res) => {
  const { afspraakId } = req.params;

  try {
    const [check] = await pool.query('SELECT * FROM Afspraken WHERE afspraak_id = ?', [afspraakId]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Afspraak niet gevonden' });
    }

    await pool.query('DELETE FROM Afspraken WHERE afspraak_id = ?', [afspraakId]);
    res.json({ message: 'Afspraak succesvol verwijderd' });
  } catch (err) {
    console.error('[Serverfout] Afspraak verwijderen mislukt:', err);
    res.status(500).json({ error: 'Fout bij verwijderen afspraak', message: err.message });
  }
});

/**
 * @route PUT /api/afspraken/:id/status
 * @desc Update appointment status (accept/reject)
 */
router.put('/:id/status', async (req, res) => {
  const afspraakId = req.params.id;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['in_afwachting', 'goedgekeurd', 'geweigerd'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Ongeldige status. Toegestane waarden: in_afwachting, goedgekeurd, geweigerd'
    });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE Afspraken SET status = ? WHERE afspraak_id = ?',
      [status, afspraakId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Afspraak niet gevonden' });
    }

    res.json({
      message: 'Afspraak status succesvol bijgewerkt',
      afspraak_id: afspraakId,
      status: status
    });

  } catch (error) {
    console.error('Fout bij bijwerken afspraak status:', error);
    res.status(500).json({ error: 'Interne serverfout' });
  }
});

/**
 * @route GET /api/afspraken/bezet
 * @desc Haal bezette tijdsloten op voor een bedrijf op een bepaalde dag
 */
router.get('/bezet', async (req, res) => {
  const { bedrijf_id, datum } = req.query;

  if (!bedrijf_id || !datum) {
    return res.status(400).json({ error: 'Bedrijf ID en datum zijn verplicht' });
  }

  try {
    const [afspraken] = await pool.query(
      'SELECT tijdslot FROM Afspraken WHERE bedrijf_id = ? AND datum = ?',
      [bedrijf_id, datum]
    );

    const bezette_tijdsloten = afspraken.map(a => a.tijdslot);
    res.json({ bedrijf_id, datum, bezette_tijdsloten });
  } catch (err) {
    console.error('[Serverfout] Bezetting ophalen mislukt:', err);
    res.status(500).json({ error: 'Fout bij ophalen bezette tijdsloten', message: err.message });
  }
});

module.exports = router;
