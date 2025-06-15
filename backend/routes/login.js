const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  const { email, password, type } = req.body;
  console.log('Login poging:', { email, type }); 

  if (!email || !password || !type) {
    return res.status(400).json({ error: 'Email, wachtwoord en type zijn verplicht' });
  }

  try {
    let query;
    let params = [email];

  
    if (type === 'bedrijf') {
      query = `
        SELECT 
          id,
          email,
          wachtwoord,
          naam as bedrijfsnaam,
          sector,
          website_of_linkedin,
          telefoonnummer,
          gemeente
        FROM Bedrijven 
        WHERE email = ?
      `;
    } else {
      query = `
        SELECT id, email, wachtwoord, naam
        FROM ${type === 'student' ? 'Studenten' : 
              type === 'werkzoekende' ? 'Werkzoekenden' : 
              'Admins'} 
        WHERE email = ?
      `;
    }

    const [rows] = await db.query(query, params);
    
    if (rows.length === 0) {
      return res.status(401).json({ 
        error: `${type === 'bedrijf' ? 'Bedrijf' : 'Gebruiker'} niet gevonden` 
      });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.wachtwoord);

    if (!validPassword) {
      return res.status(401).json({ error: 'Ongeldig wachtwoord' });
    }


    delete user.wachtwoord;

    const responseData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        type: type,
        ...(type === 'bedrijf' ? {
          bedrijfsnaam: user.bedrijfsnaam,
          sector: user.sector,
          website: user.website_of_linkedin,
          telefoonnummer: user.telefoonnummer,
          gemeente: user.gemeente
        } : {
          naam: user.naam
        })
      }
    };

    console.log('Login succesvol:', responseData); 
    res.json(responseData);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error bij inloggen' });
  }
});

module.exports = router;