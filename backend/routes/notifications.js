const express = require('express');
const router = express.Router();
const db = require('../db'); // zorg dat backend/db.js exporteert via mysql2/promise

// Haal notifications voor een bedrijf (nieuwste eerst)
router.get('/afspraken/notifications/:bedrijfId/bedrijf', async (req, res) => {
  const { bedrijfId } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM notifications WHERE bedrijf_id = ? ORDER BY created_at DESC',
      [bedrijfId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout' });
  }
});

// Haal notifications voor een student (optioneel)
router.get('/afspraken/notifications/student/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM notifications WHERE student_id = ? ORDER BY created_at DESC',
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout' });
  }
});

// Markeer als gelezen
router.put('/afspraken/notifications/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE notifications SET gelezen = 1 WHERE notification_id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout' });
  }
});

// Verwijder notification
router.delete('/afspraken/notifications/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM notifications WHERE notification_id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout' });
  }
});

module.exports = router;