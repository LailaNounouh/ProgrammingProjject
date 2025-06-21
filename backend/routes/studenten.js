const express = require('express');
const router = express.Router();
const db = require('../db');

// Alle studenten ophalen
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Studenten');
    
    // Verwijder wachtwoorden uit de resultaten voor veiligheid
    const studenten = rows.map(student => {
      const { wachtwoord, ...studentZonderWachtwoord } = student;
      return studentZonderWachtwoord;
    });
    
    res.json(studenten);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon studenten niet ophalen' });
  }
});

// Specifieke student ophalen op basis van ID
router.get('/:id', async (req, res) => {
  const studentId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM Studenten WHERE student_id = ?', [studentId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student niet gevonden' });
    }
    
    // Verwijder wachtwoord uit het resultaat voor veiligheid
    const { wachtwoord, ...studentZonderWachtwoord } = rows[0];
    
    res.json(studentZonderWachtwoord);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon student niet ophalen' });
  }
});

// Student toevoegen
router.post('/', async (req, res) => {
  const { naam, email, studie, telefoon, linkedin_url, github_url, aboutMe, wachtwoord } = req.body;
  
  // Valideer verplichte velden
  if (!email || !naam || !wachtwoord) {
    return res.status(400).json({ error: 'Naam, email en wachtwoord zijn verplicht' });
  }

  try {
    // Controleer of email al bestaat
    const [bestaandeStudenten] = await db.query('SELECT * FROM Studenten WHERE email = ?', [email]);
    if (bestaandeStudenten.length > 0) {
      return res.status(409).json({ error: 'Email bestaat al' });
    }

    // Voeg nieuwe student toe
    const [result] = await db.query(
      `INSERT INTO Studenten 
       (naam, email, studie, telefoon, linkedin_url, github_url, aboutMe, wachtwoord) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [naam, email, studie || null, telefoon || null, linkedin_url || null, github_url || null, aboutMe || null, wachtwoord]
    );

    res.status(201).json({ 
      message: 'Student succesvol toegevoegd', 
      student_id: result.insertId 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon student niet toevoegen' });
  }
});

// Student bijwerken
router.put('/:id', async (req, res) => {
  const studentId = req.params.id;
  const { naam, email, studie, telefoon, linkedin_url, github_url, aboutMe, jobstudent, werkzoekend, stage_gewenst } = req.body;
  
  // Valideer verplichte velden
  if (!email || !naam) {
    return res.status(400).json({ error: 'Naam en email zijn verplicht' });
  }

  try {
    // Controleer of student bestaat
    const [bestaandeStudenten] = await db.query('SELECT * FROM Studenten WHERE student_id = ?', [studentId]);
    if (bestaandeStudenten.length === 0) {
      return res.status(404).json({ error: 'Student niet gevonden' });
    }

    // Bijwerken van student
    await db.query(
      `UPDATE Studenten 
       SET naam = ?, email = ?, studie = ?, telefoon = ?, linkedin_url = ?, github_url = ?, 
           aboutMe = ?, jobstudent = ?, werkzoekend = ?, stage_gewenst = ?
       WHERE student_id = ?`,
      [
        naam, 
        email, 
        studie || null, 
        telefoon || null, 
        linkedin_url || null, 
        github_url || null, 
        aboutMe || null,
        jobstudent ? 1 : 0,
        werkzoekend ? 1 : 0,
        stage_gewenst ? 1 : 0,
        studentId
      ]
    );

    // Ophalen van bijgewerkte student
    const [updatedRows] = await db.query('SELECT * FROM Studenten WHERE student_id = ?', [studentId]);
    const { wachtwoord, ...updatedStudent } = updatedRows[0];

    res.json({ 
      message: 'Student succesvol bijgewerkt',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon student niet bijwerken' });
  }
});

// Student verwijderen
router.delete('/:id', async (req, res) => {
  const studentId = req.params.id;
  
  try {
    // Controleer of student bestaat
    const [bestaandeStudenten] = await db.query('SELECT * FROM Studenten WHERE student_id = ?', [studentId]);
    if (bestaandeStudenten.length === 0) {
      return res.status(404).json({ error: 'Student niet gevonden' });
    }

    // Verwijder student
    await db.query('DELETE FROM Studenten WHERE student_id = ?', [studentId]);

    res.json({ message: 'Student succesvol verwijderd' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Kon student niet verwijderen' });
  }
});

module.exports = router;