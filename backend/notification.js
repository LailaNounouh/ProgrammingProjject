const express = require('express');
const router = express.Router();
const pool = require('../db'); 


router.get('/:bedrijfId', async (req, res) => {
  const bedrijfId = req.params.bedrijfId;

  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT id, bedrijf_id, type, message, is_read, created_at 
       FROM Bedrijf_Notifications 
       WHERE bedrijf_id = ? 
       ORDER BY created_at DESC 
       LIMIT 20`,
      [bedrijfId]
    );
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error('Fout bij ophalen meldingen:', err);
    res.status(500).json({ error: 'Kon meldingen niet ophalen' });
  }
});

module.exports = router;
