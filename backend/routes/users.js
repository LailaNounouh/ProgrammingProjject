const express = require('express');
const router = express.Router();
const db = require('../db'); // je mysql2 pool

router.get('/', async (req, res) => {
  try {
    const [studenten] = await db.query('SELECT student_id AS id, naam, email, "student" AS rol FROM Studenten');
    const [werkzoekenden] = await db.query('SELECT werkzoekende_id AS id, naam, email, "werkzoekende" AS rol FROM Werkzoekenden');

    const users = [...studenten, ...werkzoekenden];

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kon gebruikers niet ophalen' });
  }
});

// PUT route to update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { naam, email, rol } = req.body;

  try {
    console.log(`Updating user ${id} with data:`, { naam, email, rol });

    // Determine which table to update based on role
    if (rol === 'student') {
      const [result] = await db.query(
        'UPDATE Studenten SET naam = ?, email = ? WHERE student_id = ?',
        [naam, email, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student niet gevonden' });
      }
    } else if (rol === 'werkzoekende') {
      const [result] = await db.query(
        'UPDATE Werkzoekenden SET naam = ?, email = ? WHERE werkzoekende_id = ?',
        [naam, email, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Werkzoekende niet gevonden' });
      }
    } else {
      return res.status(400).json({ error: 'Ongeldige rol' });
    }

    res.json({
      success: true,
      message: 'Gebruiker succesvol bijgewerkt',
      user: { id, naam, email, rol }
    });

  } catch (err) {
    console.error('Fout bij bijwerken gebruiker:', err);
    res.status(500).json({ error: 'Kon gebruiker niet bijwerken' });
  }
});

module.exports = router;
