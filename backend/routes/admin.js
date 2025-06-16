const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/stats', async (req, res) => {
  try {
    const [[bedrijven]] = await pool.query('SELECT COUNT(*) AS totaal FROM bedrijven');
    const [[studenten]] = await pool.query('SELECT COUNT(*) AS totaal FROM studenten');
    const [[werkzoekenden]] = await pool.query('SELECT COUNT(*) AS totaal FROM werkzoekenden');

    res.json({
      totaalBedrijven: bedrijven.totaal,
      totaalGebruikers: studenten.totaal + werkzoekenden.totaal,
      totaalStudenten: studenten.totaal,
      totaalWerkzoekenden: werkzoekenden.totaal
    });
  } catch (err) {
    res.status(500).json({ error: 'Statistieken ophalen mislukt' });
  }
});

router.get('/bedrijven', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bedrijven');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Bedrijven ophalen mislukt' });
  }
});

router.put('/bedrijven/:id', async (req, res) => {
  const { id } = req.params;
  const { naam, email, telefoonnummer, gemeente, website_of_linkedin } = req.body;
  try {
    await pool.query(
      'UPDATE bedrijven SET naam=?, email=?, telefoonnummer=?, gemeente=?, website_of_linkedin=? WHERE bedrijf_id=?',
      [naam, email, telefoonnummer, gemeente, website_of_linkedin, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Bedrijf bijwerken mislukt' });
  }
});

router.get('/gebruikers', async (req, res) => {
  try {
    const [studenten] = await pool.query('SELECT student_id AS id, "student" AS rol FROM studenten');
    const [werkzoekenden] = await pool.query('SELECT werkzoekende_id AS id, "werkzoekende" AS rol FROM werkzoekenden');
    res.json([...studenten, ...werkzoekenden]);
  } catch (err) {
    res.status(500).json({ error: 'Gebruikers ophalen mislukt' });
  }
});


router.get('/sectoren', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sectoren');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Sectoren ophalen mislukt' });
  }
});

router.post('/sectoren', async (req, res) => {
  const { naam } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO sectoren (naam, zichtbaar) VALUES (?, 1)', [naam]);
    res.status(201).json({ id: result.insertId, naam, zichtbaar: 1 });
  } catch (err) {
    res.status(500).json({ error: 'Sector toevoegen mislukt' });
  }
});

router.put('/sectoren/:id', async (req, res) => {
  const { id } = req.params;
  const { zichtbaar } = req.body;
  try {
    await pool.query('UPDATE sectoren SET zichtbaar = ? WHERE id = ?', [zichtbaar, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Sector bijwerken mislukt' });
  }
});

module.exports = router;