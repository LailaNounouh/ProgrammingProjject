const express = require('express');
const router = express.Router();
const pool = require('../db');

const TIJDSLOTEN = [
  '13:30', '13:45', '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45', '16:00', '16:15'
];

router.get('/beschikbaar/:bedrijfId', async (req, res) => {
  const { bedrijfId } = req.params;
  const datum = req.query.datum || new Date().toISOString().split('T')[0];

  try {
    const [bezetteTijdsloten] = await pool.query(
      'SELECT tijdslot FROM afspraken WHERE bedrijf_id = ? AND datum = ?',
      [bedrijfId, datum]
    );

    const bezetTijden = bezetteTijdsloten.map(row => row.tijdslot);
    const beschikbareTijden = TIJDSLOTEN.filter(tijd => !bezetTijden.includes(tijd));

    res.json({
      beschikbaar: beschikbareTijden,
      bezet: bezetTijden,
      alle: TIJDSLOTEN
    });
  } catch (err) {
    res.status(500).json({ fout: err.message });
  }
});

router.post('/nieuw', async (req, res) => {
  const { student_id, bedrijf_id, tijdslot, datum } = req.body;

  if (!student_id || !bedrijf_id || !tijdslot || !datum) {
    return res.status(400).json({ fout: 'Alle velden zijn verplicht' });
  }

  try {
    const [bestaand] = await pool.query(
      'SELECT * FROM afspraken WHERE bedrijf_id = ? AND datum = ? AND tijdslot = ?',
      [bedrijf_id, datum, tijdslot]
    );

    if (bestaand.length > 0) {
      return res.status(409).json({ fout: 'Dit tijdslot is al bezet' });
    }

    const [resultaat] = await pool.query(
      'INSERT INTO afspraken (student_id, bedrijf_id, tijdslot, datum) VALUES (?, ?, ?, ?)',
      [student_id, bedrijf_id, tijdslot, datum]
    );

    res.status(201).json({
      id: resultaat.insertId,
      student_id,
      bedrijf_id,
      tijdslot,
      datum
    });

  } catch (err) {
    res.status(500).json({ fout: err.message });
  }
});

module.exports = router;