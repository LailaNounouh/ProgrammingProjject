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
          bedrijf_id AS id,
          email,
          wachtwoord,
          naam AS bedrijfsnaam,
          sector,
          website_of_linkedin,
          telefoonnummer,
          gemeente
        FROM Bedrijven 
        WHERE email = ?
      `;
    } else if (type === 'student') {
      query = `
        SELECT 
          student_id AS id, 
          email, 
          wachtwoord, 
          naam 
        FROM Studenten 
        WHERE email = ?
      `;
    } else if (type === 'werkzoekende') {
      query = `
        SELECT 
          werkzoekende_id AS id,  -- Pas aan als dit in je DB anders heet
          email, 
          wachtwoord, 
          naam 
        FROM Werkzoekenden 
        WHERE email = ?
      `;
    } else if (type === 'admin') {
      query = `
        SELECT 
          admin_id AS id,  -- Pas aan als dit in je DB anders heet
          email, 
          wachtwoord, 
          naam 
        FROM Admins 
        WHERE email = ?
      `;
    } else {
      return res.status(400).json({ error: 'Ongeldig type gebruiker' });
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
        ...(type === 'bedrijf'
          ? {
              bedrijfsnaam: user.bedrijfsnaam,
              sector: user.sector,
              website: user.website_of_linkedin,
              telefoonnummer: user.telefoonnummer,
              gemeente: user.gemeente,
            }
          : {
              naam: user.naam,
            }),
      },
    };

    console.log('Login succesvol:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error bij inloggen' });
  }
});

module.exports = router;
