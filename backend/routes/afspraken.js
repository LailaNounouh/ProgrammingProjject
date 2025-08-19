const express = require('express');
const router = express.Router();
const db = require('../db');

console.log('🟢 Afspraken router loaded');

// Helper functie om real-time notifications te sturen
const sendNotification = (req, userId, userType, type, message, data = null) => {
  const io = req.app.get('io');
  const roomName = `${userType}-${userId}`;
  
  const notification = {
    id: Date.now(), // Simple ID
    type,
    message,
    data,
    timestamp: new Date().toISOString(),
    read: false
  };

  console.log(`📤 Sending notification to room ${roomName}:`, notification);
  io.to(roomName).emit('notification', notification);
};

// POST - Nieuwe afspraak aanmaken
router.post('/', async (req, res) => {
  console.log('🔵 POST /afspraken called');
  console.log('🔵 Body:', req.body);

  const { student_id, bedrijf_id, datum, tijdslot, notities, status = 'in_afwachting' } = req.body;

  if (!student_id || !bedrijf_id || !datum || !tijdslot) {
    console.log('🔴 Missing required fields');
    return res.status(400).json({ 
      error: 'Student ID, Bedrijf ID, datum en tijdslot zijn verplicht',
      received: { student_id, bedrijf_id, datum, tijdslot }
    });
  }

  try {
    console.log('🔵 Creating new afspraak...');
    
    // Maak de afspraak aan
    const [result] = await db.execute(
      `INSERT INTO Afspraken (student_id, bedrijf_id, datum, tijdslot, notities, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [student_id, bedrijf_id, datum, tijdslot, notities || '', status]
    );

    const afspraakId = result.insertId;
    console.log('✅ Afspraak created with ID:', afspraakId);

    // Haal student en bedrijf gegevens op voor notifications
    const [studentData] = await db.execute(
      'SELECT voornaam, naam FROM Users WHERE id = ? AND type = "student"',
      [student_id]
    );

    const [bedrijfData] = await db.execute(
      'SELECT bedrijfsnaam FROM Users WHERE id = ? AND type = "bedrijf"',
      [bedrijf_id]
    );

    const studentNaam = studentData[0] ? `${studentData[0].voornaam} ${studentData[0].naam}` : 'Onbekende student';
    const bedrijfNaam = bedrijfData[0] ? bedrijfData[0].bedrijfsnaam : 'Onbekend bedrijf';

    // Notification data
    const notificationData = {
      afspraak_id: afspraakId,
      datum: datum,
      tijdslot: tijdslot,
      student_naam: studentNaam,
      bedrijf_naam: bedrijfNaam
    };

    // Stuur real-time notifications
    sendNotification(
      req,
      bedrijf_id,
      'bedrijf',
      'nieuwe_afspraak',
      `🔔 Nieuwe afspraak aangevraagd door ${studentNaam} op ${new Date(datum).toLocaleDateString('nl-BE')} om ${tijdslot}`,
      notificationData
    );

    sendNotification(
      req,
      student_id,
      'student',
      'afspraak_aangevraagd',
      `✅ Afspraakverzoek verzonden naar ${bedrijfNaam} voor ${new Date(datum).toLocaleDateString('nl-BE')} om ${tijdslot}`,
      notificationData
    );

    console.log('✅ Real-time notifications sent');

    // Haal de volledige afspraak op om terug te sturen
    const [afspraakDetails] = await db.execute(
      `SELECT a.*, 
              s.voornaam, s.naam as studentnaam,
              b.bedrijfsnaam
       FROM Afspraken a
       LEFT JOIN Users s ON a.student_id = s.id AND s.type = 'student'
       LEFT JOIN Users b ON a.bedrijf_id = b.id AND b.type = 'bedrijf'
       WHERE a.afspraak_id = ?`,
      [afspraakId]
    );

    res.status(201).json({
      message: 'Afspraak succesvol aangemaakt',
      afspraak: afspraakDetails[0]
    });

  } catch (error) {
    console.error('🔴 Fout bij aanmaken afspraak:', error);
    res.status(500).json({ 
      error: 'Server error bij aanmaken afspraak',
      details: error.message 
    });
  }
});

// PUT - Afspraak status updaten
router.put('/:id/status', async (req, res) => {
  console.log('🔵 PUT /afspraken/:id/status called');
  const { id } = req.params;
  const { status } = req.body;

  if (!['goedgekeurd', 'afgewezen', 'in_afwachting'].includes(status)) {
    return res.status(400).json({ error: 'Ongeldige status' });
  }

  try {
    // Haal de afspraak op voordat we hem updaten
    const [afspraakDetails] = await db.execute(
      `SELECT a.*, 
              s.voornaam, s.naam as studentnaam, s.id as student_id,
              b.bedrijfsnaam, b.id as bedrijf_id
       FROM Afspraken a
       LEFT JOIN Users s ON a.student_id = s.id AND s.type = 'student'
       LEFT JOIN Users b ON a.bedrijf_id = b.id AND b.type = 'bedrijf'
       WHERE a.afspraak_id = ?`,
      [id]
    );

    if (afspraakDetails.length === 0) {
      return res.status(404).json({ error: 'Afspraak niet gevonden' });
    }

    const afspraak = afspraakDetails[0];
    const bedrijfNaam = afspraak.bedrijfsnaam;

    // Update de status
    await db.execute(
      'UPDATE Afspraken SET status = ? WHERE afspraak_id = ?',
      [status, id]
    );

    console.log(`✅ Afspraak ${id} status updated to: ${status}`);

    // Stuur real-time notification naar student
    const notificationData = {
      afspraak_id: id,
      datum: afspraak.datum,
      tijdslot: afspraak.tijdslot,
      bedrijf_naam: bedrijfNaam,
      nieuwe_status: status
    };

    let message = '';
    let icon = '';

    if (status === 'goedgekeurd') {
      icon = '✅';
      message = `${icon} Uw afspraak met ${bedrijfNaam} is goedgekeurd! Datum: ${new Date(afspraak.datum).toLocaleDateString('nl-BE')} om ${afspraak.tijdslot}`;
    } else if (status === 'afgewezen') {
      icon = '❌';
      message = `${icon} Uw afspraak met ${bedrijfNaam} is helaas afgewezen. Probeer een ander tijdslot.`;
    }

    if (message) {
      sendNotification(
        req,
        afspraak.student_id,
        'student',
        `afspraak_${status}`,
        message,
        notificationData
      );
    }

    res.json({
      message: `Afspraak ${status}`,
      afspraak: {
        ...afspraak,
        status: status
      }
    });

  } catch (error) {
    console.error('🔴 Fout bij updaten afspraak status:', error);
    res.status(500).json({ error: 'Server error bij updaten status' });
  }
});

// DELETE - Afspraak verwijderen
router.delete('/:id', async (req, res) => {
  console.log('🔵 DELETE /afspraken/:id called');
  const { id } = req.params;

  try {
    // Haal de afspraak op voordat we hem verwijderen
    const [afspraakDetails] = await db.execute(
      `SELECT a.*, 
              s.voornaam, s.naam as studentnaam, s.id as student_id,
              b.bedrijfsnaam, b.id as bedrijf_id
       FROM Afspraken a
       LEFT JOIN Users s ON a.student_id = s.id AND s.type = 'student'
       LEFT JOIN Users b ON a.bedrijf_id = b.id AND b.type = 'bedrijf'
       WHERE a.afspraak_id = ?`,
      [id]
    );

    if (afspraakDetails.length === 0) {
      return res.status(404).json({ error: 'Afspraak niet gevonden' });
    }

    const afspraak = afspraakDetails[0];
    const studentNaam = `${afspraak.voornaam} ${afspraak.studentnaam}`;
    const bedrijfNaam = afspraak.bedrijfsnaam;

    // Verwijder de afspraak
    await db.execute('DELETE FROM Afspraken WHERE afspraak_id = ?', [id]);
    console.log(`✅ Afspraak ${id} deleted`);

    // Stuur real-time notifications
    const notificationData = {
      afspraak_id: id,
      datum: afspraak.datum,
      tijdslot: afspraak.tijdslot,
      student_naam: studentNaam,
      bedrijf_naam: bedrijfNaam
    };

    sendNotification(
      req,
      afspraak.bedrijf_id,
      'bedrijf',
      'afspraak_geannuleerd',
      `🚫 Afspraak met ${studentNaam} is geannuleerd (${new Date(afspraak.datum).toLocaleDateString('nl-BE')} om ${afspraak.tijdslot})`,
      notificationData
    );

    sendNotification(
      req,
      afspraak.student_id,
      'student',
      'afspraak_geannuleerd',
      `🚫 Uw afspraak met ${bedrijfNaam} is geannuleerd (${new Date(afspraak.datum).toLocaleDateString('nl-BE')} om ${afspraak.tijdslot})`,
      notificationData
    );

    res.json({ message: 'Afspraak succesvol verwijderd' });

  } catch (error) {
    console.error('🔴 Fout bij verwijderen afspraak:', error);
    res.status(500).json({ error: 'Server error bij verwijderen afspraak' });
  }
});

// GET - Alle afspraken voor een bedrijf
router.get('/bedrijf/:bedrijfId', async (req, res) => {
  console.log('🔵 GET /afspraken/bedrijf/:bedrijfId called');
  const { bedrijfId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT a.*, 
              s.voornaam, s.naam as studentnaam
       FROM Afspraken a
       LEFT JOIN Users s ON a.student_id = s.id AND s.type = 'student'
       WHERE a.bedrijf_id = ?
       ORDER BY a.datum DESC, a.tijdslot ASC`,
      [bedrijfId]
    );

    console.log(`✅ Found ${rows.length} afspraken for bedrijf ${bedrijfId}`);
    res.json(rows);
  } catch (error) {
    console.error('🔴 Fout bij ophalen bedrijf afspraken:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET - Alle afspraken voor een student
router.get('/student/:studentId', async (req, res) => {
  console.log('🔵 GET /afspraken/student/:studentId called');
  const { studentId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT a.*, 
              b.bedrijfsnaam
       FROM Afspraken a
       LEFT JOIN Users b ON a.bedrijf_id = b.id AND b.type = 'bedrijf'
       WHERE a.student_id = ?
       ORDER BY a.datum DESC, a.tijdslot ASC`,
      [studentId]
    );

    console.log(`✅ Found ${rows.length} afspraken for student ${studentId}`);
    res.json(rows);
  } catch (error) {
    console.error('🔴 Fout bij ophalen student afspraken:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET - Alle afspraken (admin)
router.get('/', async (req, res) => {
  console.log('🔵 GET /afspraken called');

  try {
    const [rows] = await db.execute(
      `SELECT a.*, 
              s.voornaam, s.naam as studentnaam,
              b.bedrijfsnaam
       FROM Afspraken a
       LEFT JOIN Users s ON a.student_id = s.id AND s.type = 'student'
       LEFT JOIN Users b ON a.bedrijf_id = b.id AND b.type = 'bedrijf'
       ORDER BY a.datum DESC, a.tijdslot ASC`
    );

    console.log(`✅ Found ${rows.length} total afspraken`);
    res.json(rows);
  } catch (error) {
    console.error('🔴 Fout bij ophalen alle afspraken:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

console.log('🟢 All afspraken routes registered with notification support');

module.exports = router;
