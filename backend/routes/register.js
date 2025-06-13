const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configureer multer opslag (bestanden in /uploads, originele naam)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

// POST /register, met file upload (optioneel)
router.post('/', upload.single('bestand'), async (req, res) => {
  try {
    const {
      type,       // 'student', 'werkzoekende', 'bedrijf'
      naam,
      email,
      wachtwoord,
      studie,
      sector,
      straat,
      nummer,
      postcode,
      gemeente,
      telefoonnummer,
      btw_nummer,
      contactpersoon_facturatie,
      email_facturatie,
      po_nummer,
      contactpersoon_beurs,
      email_beurs,
      website_of_linkedin
    } = req.body;

    // Algemene verplichte velden: type, naam, email
    if (!type || !naam || !email) {
      return res.status(400).json({ error: 'Type, naam en e-mailadres zijn verplicht' });
    }

    if (type === 'student') {
      if (!wachtwoord || !studie) {
        return res.status(400).json({ error: 'Wachtwoord en studie zijn verplicht voor studenten' });
      }

      if (!email.endsWith('@student.ehb.be')) {
        return res.status(400).json({ error: 'Alleen EHB student e-mailadressen zijn toegestaan.' });
      }

      const hashedPassword = await bcrypt.hash(wachtwoord, 10);

      const [result] = await pool.query(
        `INSERT INTO Studenten 
         (naam, email, wachtwoord, studie, jobstudent, werkzoekend, stage_gewenst) 
         VALUES (?, ?, ?, ?, false, false, false)`,
        [naam, email, hashedPassword, studie]
      );

      return res.status(201).json({ message: 'Student geregistreerd', id: result.insertId });

    } else if (type === 'werkzoekende') {
      if (!wachtwoord) {
        return res.status(400).json({ error: 'Wachtwoord is verplicht voor werkzoekenden' });
      }

      const hashedPassword = await bcrypt.hash(wachtwoord, 10);

      const [result] = await pool.query(
        `INSERT INTO Werkzoekenden (naam, email, wachtwoord) VALUES (?, ?, ?)`,
        [naam, email, hashedPassword]
      );

      return res.status(201).json({ message: 'Werkzoekende geregistreerd', id: result.insertId });

    } else if (type === 'bedrijf') {
      // Alleen e-mail en wachtwoord verplicht voor bedrijven
      if (!wachtwoord || !email) {
        return res.status(400).json({ error: 'E-mail en wachtwoord zijn verplicht voor bedrijven' });
      }

      const hashedPassword = await bcrypt.hash(wachtwoord, 10);

      // Filepad (optioneel)
      const bestandPad = req.file ? req.file.path : null;

      // Insert in Bedrijven, overige velden optioneel (null als leeg)
      const [result] = await pool.query(
        `INSERT INTO Bedrijven 
         (naam, email, wachtwoord, straat, nummer, postcode, gemeente, telefoonnummer, btw_nummer, contactpersoon_facturatie, email_facturatie, po_nummer, contactpersoon_beurs, email_beurs, website_of_linkedin, logo_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          naam || null,
          email,
          hashedPassword,
          straat || null,
          nummer || null,
          postcode || null,
          gemeente || null,
          telefoonnummer || null,
          btw_nummer || null,
          contactpersoon_facturatie || null,
          email_facturatie || null,
          po_nummer || null,
          contactpersoon_beurs || null,
          email_beurs || null,
          website_of_linkedin || null,
          bestandPad || null
        ]
      );

      const bedrijfId = result.insertId;

      // Link bedrijf aan sector in koppel tabel, alleen als sector is ingevuld
      if (sector) {
        await pool.query(
          `INSERT INTO Bedrijf_Sector (bedrijf_id, sector_id) VALUES (?, ?)`,
          [bedrijfId, sector]
        );
      }

      return res.status(201).json({ message: 'Bedrijf geregistreerd', id: bedrijfId });

    } else {
      return res.status(400).json({ error: 'Ongeldig registratie-type opgegeven' });
    }
  } catch (error) {
    console.error('❌ Registratiefout:', error);
    return res.status(500).json({ error: 'Serverfout bij registratie' });
  }
});

module.exports = router;
