const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/newsletter/registratie
router.post('/registratie', async (req, res) => {
  const { naam, email, rol } = req.body;

  if (!naam || !email || !rol) {
    return res.status(400).json({ error: 'Naam, e-mail en rol zijn verplicht.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT abonnement_id FROM Nieuwsbrief_Abonnementen WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'E-mail is al ingeschreven.' });
    }

    await pool.query(
      'INSERT INTO Nieuwsbrief_Abonnementen (naam, email, rol) VALUES (?, ?, ?)',
      [naam, email, rol]
    );

    console.log('📧 Nieuwsbriefinschrijving:', { naam, email, rol });
    res.status(201).json({ message: 'Inschrijving succesvol!' });
  } catch (error) {
    console.error('❌ Fout bij inschrijving:', error);
    res.status(500).json({ error: 'Serverfout bij nieuwsbriefinschrijving.' });
  }
});

module.exports = router;
