const express = require('express');
const router = express.Router();
const pool = require('../db');
const QRCode = require('qrcode');
const crypto = require('crypto');

// POST- verzkoek maken - Genereer algemene QR-code voor evenement
router.post('/generate-event', async (req, res) => {
  try {
    const { event_id, event_naam } = req.body;

    if (!event_id || !event_naam) {
      return res.status(400).json({ error: 'Event ID en naam zijn verplicht' });
    }

    // maak een unieke QR-code token voor het evenement
    const qrToken = crypto.randomBytes(16).toString('hex');
    
    // QR-code data bevat alleen de URL naar de check-in pagina
    const qrCodeData = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/qr-checkin?event=${event_id}&token=${qrToken}`;

    // Genereer QR-code afbeelding
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Sla evenement QR-code op in database 
    await pool.query(
      `INSERT INTO event_qr_codes (event_id, qr_token, qr_data_url, created_at) 
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE qr_token = VALUES(qr_token), qr_data_url = VALUES(qr_data_url), created_at = NOW()`,
      [event_id, qrToken, qrCodeData]
    );

    res.status(200).json({ 
      message: 'Evenement QR-code gegenereerd',
      qr_code_image: qrCodeImage,
      qr_code_url: qrCodeData,
      event_id: event_id,
      event_naam: event_naam
    });

  } catch (error) {
    console.error('❌ QR-code generatie fout:', error);
    res.status(500).json({ error: 'Serverfout bij QR-code generatie' });
  }
});

// POST /qr/checkin - Verwerk check-in via algemene QR-code
router.post('/checkin', async (req, res) => {
  try {
    const { event_id, naam, email, deelnemer_type } = req.body;

    if (!event_id || !naam || !email) {
      return res.status(400).json({ error: 'Event ID, naam en e-mail zijn verplicht' });
    }

    let deelnemer_id = null;
    let bestaande_deelnemer = false;

    // We gaan eerst in de bestaande deelnemers zoeken
    if (deelnemer_type === 'student' || !deelnemer_type) {
      const [studentResult] = await pool.query(
        `SELECT id FROM studenten WHERE email = ?`,
        [email]
      );
      if (studentResult.length > 0) {
        deelnemer_id = studentResult[0].id;
        bestaande_deelnemer = true;
        deelnemer_type = 'student';
      }
    }

    if (!bestaande_deelnemer && (deelnemer_type === 'werkzoekende' || !deelnemer_type)) {
      const [werkzoekendeResult] = await pool.query(
        `SELECT id FROM werkzoekende WHERE email = ?`,
        [email]
      );
      if (werkzoekendeResult.length > 0) {
        deelnemer_id = werkzoekendeResult[0].id;
        bestaande_deelnemer = true;
        deelnemer_type = 'werkzoekende';
      }
    }

    if (!bestaande_deelnemer && (deelnemer_type === 'bedrijf' || !deelnemer_type)) {
      const [bedrijfResult] = await pool.query(
        `SELECT id FROM bedrijven WHERE email = ?`,
        [email]
      );
      if (bedrijfResult.length > 0) {
        deelnemer_id = bedrijfResult[0].id;
        bestaande_deelnemer = true;
        deelnemer_type = 'bedrijf';
      }
    }

    // Als geen bestaande deelnemer gevonden, maak gastdeelnemer aan
    if (!bestaande_deelnemer) {
      // Controleer of gastdeelnemers tabel bestaat, zo niet maak deze aan
      await pool.query(`
        CREATE TABLE IF NOT EXISTS gast_deelnemers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          naam VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_email (email)
        )
      `);

      // Voeg gastdeelnemer toe of haal bestaande op
      await pool.query(
        `INSERT INTO gast_deelnemers (naam, email) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE naam = VALUES(naam)`,
        [naam, email]
      );

      const [gastResult] = await pool.query(
        `SELECT id FROM gast_deelnemers WHERE email = ?`,
        [email]
      );
      
      deelnemer_id = gastResult[0].id;
      deelnemer_type = 'gast';
    }

    // Controleer of al aanwezig geregistreerd
    const [bestaandeAanwezigheid] = await pool.query(
      `SELECT * FROM aanwezigheid WHERE deelnemer_id = ? AND event_id = ? AND deelnemer_type = ?`,
      [deelnemer_id, event_id, deelnemer_type]
    );

    if (bestaandeAanwezigheid.length > 0) {
      return res.status(400).json({ 
        error: 'Aanwezigheid al geregistreerd voor dit evenement',
        timestamp: bestaandeAanwezigheid[0].aanwezig_op
      });
    }

    // Registreer aanwezigheid
    await pool.query(
      `INSERT INTO aanwezigheid (deelnemer_id, event_id, deelnemer_type, aanwezig_op, registratie_methode) 
       VALUES (?, ?, ?, NOW(), 'QR_CODE')`,
      [deelnemer_id, event_id, deelnemer_type]
    );

    res.status(200).json({ 
      message: 'Aanwezigheid succesvol geregistreerd',
      deelnemer: {
        id: deelnemer_id,
        naam: naam,
        email: email,
        type: deelnemer_type,
        bestaande_deelnemer: bestaande_deelnemer
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Check-in fout:', error);
    res.status(500).json({ error: 'Serverfout bij check-in verwerking' });
  }
});

// GET /qr/attendance/:event_id - Haal aanwezigheidslijst op voor admin
router.get('/attendance/:event_id', async (req, res) => {
  try {
    const { event_id } = req.params;

    const [attendanceList] = await pool.query(`
      SELECT 
        a.deelnemer_id,
        a.deelnemer_type,
        a.aanwezig_op,
        a.registratie_methode,
        CASE 
          WHEN a.deelnemer_type = 'student' THEN s.naam
          WHEN a.deelnemer_type = 'werkzoekende' THEN w.naam
          WHEN a.deelnemer_type = 'bedrijf' THEN b.bedrijfsnaam
          WHEN a.deelnemer_type = 'gast' THEN g.naam
          ELSE 'Onbekend'
        END as naam,
        CASE 
          WHEN a.deelnemer_type = 'student' THEN s.email
          WHEN a.deelnemer_type = 'werkzoekende' THEN w.email
          WHEN a.deelnemer_type = 'bedrijf' THEN b.email
          WHEN a.deelnemer_type = 'gast' THEN g.email
          ELSE 'Onbekend'
        END as email,
        a.deelnemer_type as type
      FROM aanwezigheid a
      LEFT JOIN studenten s ON a.deelnemer_id = s.id AND a.deelnemer_type = 'student'
      LEFT JOIN werkzoekende w ON a.deelnemer_id = w.id AND a.deelnemer_type = 'werkzoekende'
      LEFT JOIN bedrijven b ON a.deelnemer_id = b.id AND a.deelnemer_type = 'bedrijf'
      LEFT JOIN gast_deelnemers g ON a.deelnemer_id = g.id AND a.deelnemer_type = 'gast'
      WHERE a.event_id = ?
      ORDER BY a.aanwezig_op DESC
    `, [event_id]);

    res.status(200).json({
      event_id: event_id,
      total_aanwezig: attendanceList.length,
      deelnemers: attendanceList
    });

  } catch (error) {
    console.error('❌ Aanwezigheidslijst fout:', error);
    res.status(500).json({ error: 'Serverfout bij ophalen aanwezigheidslijst' });
  }
});

// GET /qr/events - Haal lijst van evenementen op
router.get('/events', async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT id, naam, beschrijving, datum, tijd, locatie, max_deelnemers, created_at
      FROM evenementen 
      ORDER BY datum DESC
    `);

    res.status(200).json({
      events: events
    });

  } catch (error) {
    console.error('❌ Evenementen ophalen fout:', error);
    res.status(500).json({ error: 'Serverfout bij ophalen evenementen' });
  }
});

module.exports = router;

