const express = require('express');
const router = express.Router();
const db = require('../db'); // jouw database module

router.get('/', async (req, res) => {
  try {
    // Query om aantal bedrijven te tellen
    const bedrijvenCountResult = await db.query('SELECT COUNT(*) AS count FROM Bedrijven');
    const bedrijvenCount = parseInt(bedrijvenCountResult.rows[0].count, 10);

    // Query om aantal studenten te tellen
    const studentenCountResult = await db.query('SELECT COUNT(*) AS count FROM Studenten');
    const studentenCount = parseInt(studentenCountResult.rows[0].count, 10);

    // Query om aantal werkzoekenden te tellen
    const werkzoekendenCountResult = await db.query('SELECT COUNT(*) AS count FROM Werkzoekenden');
    const werkzoekendenCount = parseInt(werkzoekendenCountResult.rows[0].count, 10);

    const afsprakenCountResult = await db.query('SELECT COUNT(*) AS count FROM Afspraken');
    const afsprakenCount = parseInt(afsprakenCountResult.rows[0].count, 10);

    res.json({
      bedrijven: bedrijvenCount,
      studenten: studentenCount,
      werkzoekenden: werkzoekendenCount,
      afspraken: afsprakenCount,
    });
  } catch (error) {
    console.error('Fout bij ophalen statistieken:', error);
    res.status(500).json({ error: 'Kon statistieken niet ophalen' });
  }
});

module.exports = router;
