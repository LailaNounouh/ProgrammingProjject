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

    // First, find out what the current role is
    const [studentCheck] = await db.execute(
      'SELECT student_id, naam, email FROM Studenten WHERE student_id = ?',
      [id]
    );

    const [werkzoekendeCheck] = await db.execute(
      'SELECT werkzoekende_id, naam, email FROM Werkzoekenden WHERE werkzoekende_id = ?',
      [id]
    );

    let currentRole = null;
    let currentData = null;

    if (studentCheck.length > 0) {
      currentRole = 'student';
      currentData = studentCheck[0];
    } else if (werkzoekendeCheck.length > 0) {
      currentRole = 'werkzoekende';
      currentData = werkzoekendeCheck[0];
    } else {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    console.log(`👤 Current role: ${currentRole}, Target role: ${rol}`);

    // If role is changing, we need to move the user between tables
    if (currentRole !== rol) {
      console.log(`🔄 Role change detected: ${currentRole} → ${rol}`);

      // Start transaction
      await db.execute('START TRANSACTION');

      try {
        // Insert into new table (let database generate new ID)
        let newId;
        if (rol === 'student') {
          console.log('📚 Moving to Studenten table...');
          const [insertResult] = await db.execute(
            'INSERT INTO Studenten (naam, email) VALUES (?, ?)',
            [naam, email]
          );
          newId = insertResult.insertId;
        } else if (rol === 'werkzoekende') {
          console.log('💼 Moving to Werkzoekenden table...');
          const [insertResult] = await db.execute(
            'INSERT INTO Werkzoekenden (naam, email) VALUES (?, ?)',
            [naam, email]
          );
          newId = insertResult.insertId;
        }

        // Delete from old table
        if (currentRole === 'student') {
          console.log('🗑️ Removing from Studenten table...');
          await db.execute('DELETE FROM Studenten WHERE student_id = ?', [id]);
        } else if (currentRole === 'werkzoekende') {
          console.log('🗑️ Removing from Werkzoekenden table...');
          await db.execute('DELETE FROM Werkzoekenden WHERE werkzoekende_id = ?', [id]);
        }

        // Commit transaction
        await db.execute('COMMIT');
        console.log('✅ Role change completed successfully');

      } catch (error) {
        // Rollback on error
        await db.execute('ROLLBACK');
        throw error;
      }

    } else {
      // Same role, just update the existing record
      console.log(`📝 Updating existing ${rol} record...`);

      let result;
      if (rol === 'student') {
        [result] = await db.execute(
          'UPDATE Studenten SET naam = ?, email = ? WHERE student_id = ?',
          [naam, email, id]
        );
      } else if (rol === 'werkzoekende') {
        [result] = await db.execute(
          'UPDATE Werkzoekenden SET naam = ?, email = ? WHERE werkzoekende_id = ?',
          [naam, email, id]
        );
      }

      console.log('📊 Update result:', result);
    }

    console.log(`✅ User ${id} successfully updated`);

    res.json({
      success: true,
      message: 'Gebruiker succesvol bijgewerkt',
      user: {
        id: currentRole !== rol ? newId : id, // Use new ID if role changed
        naam,
        email,
        rol
      },
      roleChanged: currentRole !== rol,
      previousRole: currentRole,
      newId: currentRole !== rol ? newId : id
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

// DELETE route to remove user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Gebruiker ID is verplicht' });
  }

  try {
    console.log(`🗑️ Deleting user ${id}...`);

    // Find out which table the user is in
    const [studentCheck] = await db.execute(
      'SELECT student_id FROM Studenten WHERE student_id = ?',
      [id]
    );

    const [werkzoekendeCheck] = await db.execute(
      'SELECT werkzoekende_id FROM Werkzoekenden WHERE werkzoekende_id = ?',
      [id]
    );

    let result;
    let userType;

    if (studentCheck.length > 0) {
      console.log('📚 Deleting from Studenten table...');
      [result] = await db.execute(
        'DELETE FROM Studenten WHERE student_id = ?',
        [id]
      );
      userType = 'student';
    } else if (werkzoekendeCheck.length > 0) {
      console.log('💼 Deleting from Werkzoekenden table...');
      [result] = await db.execute(
        'DELETE FROM Werkzoekenden WHERE werkzoekende_id = ?',
        [id]
      );
      userType = 'werkzoekende';
    } else {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    console.log(`✅ User ${id} (${userType}) successfully deleted`);

    res.json({
      success: true,
      message: 'Gebruiker succesvol verwijderd',
      deletedUser: { id, type: userType },
      affectedRows: result.affectedRows
    });

  } catch (err) {
    console.error('❌ Fout bij verwijderen gebruiker:', err);
    res.status(500).json({
      error: 'Kon gebruiker niet verwijderen',
      details: err.message,
      sqlState: err.sqlState,
      code: err.code
    });
  }
});

module.exports = router;
