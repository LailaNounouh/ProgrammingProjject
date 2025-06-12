const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

// POST /register
router.post('/', async (req, res) => {
  try {
    const {
      type,       // 'student', 'werkzoekende', of 'bedrijf'
      naam,
      email,
      wachtwoord,
      studie,
      sector
    } = req.body;

    // Algemene validatie
    if (!type || !naam || !email) {
      return res.status(400).json({ error: 'Type, naam en e-mailadres zijn verplicht' });
    }

    // Student registreren
    if (type === 'student') {
      if (!wachtwoord || !studie) {
        return res.status(400).json({ error: 'Wachtwoord en studie zijn verplicht voor studenten' });
      }

      const hashedPassword = await bcrypt.hash(wachtwoord, 10);

      const [result] = await pool.query(
        `INSERT INTO Studenten (naam, email, wachtwoord, studie, jobstudent, werkzoekend, stage_gewenst)
         VALUES (?, ?, ?, ?, false, false, false)`,
        [naam, email, hashedPassword, studie]
      );

      return res.status(201).json({ message: 'Student geregistreerd', id: result.insertId });

    }

    // Werkzoekende registreren
    else if (type === 'werkzoekende') {
      if (!wachtwoord) {
        return res.status(400).json({ error: 'Wachtwoord is verplicht voor werkzoekenden' });
      }

      const hashedPassword = await bcrypt.hash(wachtwoord, 10);

      const [result] = await pool.query(
        `INSERT INTO Werkzoekenden (naam, email, wachtwoord)
         VALUES (?, ?, ?)`,
        [naam, email, hashedPassword]
      );

      return res.status(201).json({ message: 'Werkzoekende geregistreerd', id: result.insertId });
    }

    // Bedrijf registreren
    else if (type === 'bedrijf') {
      if (!sector) {
        return res.status(400).json({ error: 'Sector (ID) is verplicht voor bedrijven' });
      }

      const [result] = await pool.query(
        `INSERT INTO Bedrijven (naam, email)
         VALUES (?, ?)`,
        [naam, email]
      );

      const bedrijfId = result.insertId;

      // Sector koppelen (1 sector_id verwacht, integer)
      await pool.query(
        `INSERT INTO Bedrijf_Sector (bedrijf_id, sector_id) VALUES (?, ?)`,
        [bedrijfId, sector]
      );

      return res.status(201).json({ message: 'Bedrijf geregistreerd', id: bedrijfId });
    }

    // Ongeldig type
    else {
      return res.status(400).json({ error: 'Ongeldig registratie-type opgegeven' });
    }
  } catch (error) {
    console.error('❌ Registratiefout:', error);
    return res.status(500).json({ error: 'Serverfout bij registratie' });
  }
});

module.exports = router;
