const express = require('express');
const router = express.Router();
const db = require('../db');
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM Bedrijven) AS bedrijvenCount,
        (SELECT COUNT(*) FROM Studenten) AS studentenCount,
        (SELECT COUNT(*) FROM Werkzoekenden) AS werkzoekendenCount,
        (SELECT COUNT(*) FROM Afspraken) AS afsprakenCount
    `);

    const counts = rows;
    res.json({
      bedrijven: parseInt(counts.bedrijvenCount, 10),
      studenten: parseInt(counts.studentenCount, 10),
      werkzoekenden: parseInt(counts.werkzoekendenCount, 10),
      afspraken: parseInt(counts.afsprakenCount, 10),
    });
  } catch (error) {
    console.error('Fout bij ophalen statistieken:', error.stack || error);
    res.status(500).json({ error: 'Kon statistieken niet ophalen' });
  }
});
