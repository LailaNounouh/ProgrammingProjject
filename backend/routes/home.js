const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/registratie', async (req, res) => {
  const { naam, email, isStudent, isCompany } = req.body;

  if (!naam || !email) {
    return res.status(400).json({ error: 'Naam en e-mail zijn verplicht.' });
  }

  // Rol bepalen
  let rol = null;
  if (isStudent) rol = 'student';
  else if (isCompany) rol = 'bedrijf';

  try {
    // Check of e-mail al bestaat
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

    console.log('📥 Nieuwe nieuwsbrief inschrijving:', { naam, email, rol });
    res.status(201).json({ message: 'Inschrijving succesvol ontvangen!' });
  } catch (error) {
    console.error('Fout bij inschrijving nieuwsbrief:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'E-mail is al ingeschreven.' });
    } else {
      res.status(500).json({ error: 'Serverfout bij inschrijving nieuwsbrief.' });
    }
  }
});

module.exports = router;
