const express = require('express');
const router = express.Router();
const pool = require('../db');  // Zorg dat dit klopt

router.post('/registratie', async (req, res) => {
  const { naam, email, isStudent, isCompany } = req.body;

  if (!naam || !email) {
    return res.status(400).json({ error: 'Naam en e-mail zijn verplicht.' });
  }

  // We zetten rol op basis van isStudent/isCompany (optioneel)
  let rol = null;
  if (isStudent) rol = 'student';
  else if (isCompany) rol = 'bedrijf';

  try {
    // Insert in newsletter_subscribers
    await pool.query(
      `INSERT INTO newsletter_subscribers (naam, email) VALUES (?, ?)`,
      [naam, email]
    );

    // Als je rol ook in newsletter_subscribers wilt opslaan, moet je kolom toevoegen aan DB

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
