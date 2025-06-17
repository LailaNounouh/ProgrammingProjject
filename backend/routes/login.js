const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  const { email, password, type } = req.body;
  console.log('Login poging details:', { email, type });

  try {
    let tableName;
    switch (type) {
      case 'student':
        tableName = 'Studenten';
        break;
      case 'bedrijf':
        tableName = 'Bedrijven';
        break;
      case 'admin':
        tableName = 'Admins';
        break;
      case 'werkzoekende':
        tableName = 'Werkzoekenden';
        break;
      default:
        return res.status(400).json({ error: 'Ongeldig account type' });
    }

    const query = `
      SELECT 
        email,
        wachtwoord,
        naam
      FROM ${tableName}
      WHERE email = ?
    `;

    console.log('Query:', query.replace('?', `'${email}'`));

    const [rows] = await db.query(query, [email]);
    console.log('Raw database result:', rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: `${type} niet gevonden met email: ${email}` });
    }

    const user = rows[0];
    
    // Debug logging voor wachtwoord vergelijking
    console.log('Ingevoerd wachtwoord:', password);
    console.log('Opgeslagen hash:', user.wachtwoord);
    
    const validPassword = await bcrypt.compare(password, user.wachtwoord);
    console.log('Wachtwoord vergelijking resultaat:', validPassword);

    if (!validPassword) {
      console.log('Wachtwoord verificatie mislukt');
      return res.status(401).json({ error: 'Ongeldig wachtwoord' });
    }

    delete user.wachtwoord;

    const responseData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        naam: user.naam,
        type: type
      }
    };

    res.json(responseData);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error bij inloggen' });
  }
});

module.exports = router;