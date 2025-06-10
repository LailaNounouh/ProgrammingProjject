// routes/newsletter.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/newsletter/registratie
router.post('/registratie', async (req, res) => {
  const { naam, email, role } = req.body;

  if (!naam || !email || !role) {
    return res.status(400).json({ error: 'Naam, e-mail en rol zijn verplicht.' });
  }

  try {
    // Optioneel: controleer op duplicaten
    const [existing] = await pool.query('SELECT id FROM newsletter_subscribers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'E-mail is al ingeschreven.' });
    }

    // Voeg toe aan database
    await pool.query(
      'INSERT INTO newsletter_subscribers (naam, email, rol) VALUES (?, ?, ?)',
      [naam, email, role]
    );

    console.log('📧 Nieuwsbriefinschrijving:', { naam, email, role });
    res.status(201).json({ message: 'Inschrijving succesvol!' });
  } catch (error) {
    console.error('❌ Fout bij inschrijving:', error);
    res.status(500).json({ error: 'Serverfout bij nieuwsbriefinschrijving.' });
  }
});

module.exports = router;
