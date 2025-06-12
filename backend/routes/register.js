const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  try {
    const { type, naam, email, wachtwoord, studie, vaardigheden, sector } = req.body;

    if (!type || !naam || !email) {
      return res.status(400).json({ error: 'Type, naam en email zijn verplicht' });
    }

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

      return res.json({ message: 'Student geregistreerd', id: result.insertId });

    } else if (type === 'werkzoekende') {
      if (!wachtwoord) {
        return res.status(400).json({ error: 'Wachtwoord is verplicht voor werkzoekenden' });
      }
      const hashedPassword = await bcrypt.hash(wachtwoord, 10);

      const [result] = await pool.query(
        `INSERT INTO Werkzoekenden (naam, email, wachtwoord)
         VALUES (?, ?, ?)`,
        [naam, email, hashedPassword]
      );

      return res.json({ message: 'Werkzoekende geregistreerd', id: result.insertId });

    } else if (type === 'bedrijf') {
      // Voor bedrijven is wachtwoord niet van toepassing
      // sector kan meerdere zijn, maar hier enkel 1 sector id verwacht
      
      if (!sector) {
        return res.status(400).json({ error: 'Sector is verplicht voor bedrijven' });
      }

      const [result] = await pool.query(
        `INSERT INTO Bedrijven (naam, email)
         VALUES (?, ?)`,
        [naam, email]
      );

      const bedrijfId = result.insertId;

      // Koppel sector (sector moet een id zijn)
      await pool.query(
        `INSERT INTO Bedrijf_Sector (bedrijf_id, sector_id) VALUES (?, ?)`,
        [bedrijfId, sector]
      );

      return res.json({ message: 'Bedrijf geregistreerd', id: bedrijfId });

    } else {
      return res.status(400).json({ error: 'Ongeldig type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Serverfout bij registratie' });
  }
});

module.exports = router;
