const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql2 pool

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

  // Validation
  if (!id || !naam || !email || !rol) {
    return res.status(400).json({
      error: 'Ontbrekende velden',
      required: ['id', 'naam', 'email', 'rol'],
      received: { id, naam, email, rol }
    });
  }

  try {
    console.log(`🔄 Updating user ${id} with data:`, { naam, email, rol });

    let result;

    // Determine which table to update based on role
    if (rol === 'student') {
      console.log('📚 Updating student in Studenten table...');
      [result] = await db.execute(
        'UPDATE Studenten SET naam = ?, email = ? WHERE student_id = ?',
        [naam, email, id]
      );

      console.log('📊 Student update result:', result);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student niet gevonden' });
      }

    } else if (rol === 'werkzoekende') {
      console.log('💼 Updating werkzoekende in Werkzoekenden table...');
      [result] = await db.execute(
        'UPDATE Werkzoekenden SET naam = ?, email = ? WHERE werkzoekende_id = ?',
        [naam, email, id]
      );

      console.log('📊 Werkzoekende update result:', result);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Werkzoekende niet gevonden' });
      }

    } else {
      return res.status(400).json({
        error: 'Ongeldige rol',
        allowedRoles: ['student', 'werkzoekende'],
        received: rol
      });
    }

    console.log(`✅ User ${id} successfully updated`);

    res.json({
      success: true,
      message: 'Gebruiker succesvol bijgewerkt',
      user: { id, naam, email, rol },
      affectedRows: result.affectedRows
    });

  } catch (err) {
    console.error('❌ Fout bij bijwerken gebruiker:', err);
    res.status(500).json({
      error: 'Kon gebruiker niet bijwerken',
      details: err.message,
      sqlState: err.sqlState,
      code: err.code
    });
  }
});

module.exports = router;
