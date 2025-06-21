const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const securityConfig = require('../config/security');

// Rate limiting for login attempts (lenient in development)
const loginLimiter = rateLimit({
  windowMs: securityConfig.rateLimiting.windowMs,
  max: process.env.NODE_ENV === 'production' ? 5 : 100, // More lenient in development
  message: {
    error: 'Te veel inlogpogingen. Probeer over 15 minuten opnieuw.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: process.env.NODE_ENV === 'development' // Skip rate limiting in development
});

router.post('/', loginLimiter, async (req, res) => {
  const { email, password, type } = req.body;

  // Input validation
  if (!email || !password || !type) {
    return res.status(400).json({ error: 'Email, wachtwoord en type zijn verplicht' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Ongeldig email formaat' });
  }

  console.log('Login poging details:', { email: email.toLowerCase(), type });

  try {
    let tableName, idColumn;
    switch (type) {
      case 'student':
        tableName = 'Studenten';
        idColumn = 'student_id';
        break;
      case 'bedrijf':
        tableName = 'Bedrijven';
        idColumn = 'bedrijf_id';
        break;
      case 'admin':
        tableName = 'Admins';
        idColumn = 'admin_id';

        break;
      case 'werkzoekende':
        tableName = 'Werkzoekenden';
        idColumn = 'werkzoekende_id';
        break;
      default:
        return res.status(400).json({ error: 'Ongeldig account type' });
    }

    const query = `
      SELECT
      ${idColumn} AS id,
        email,
        wachtwoord,
        naam
      FROM ${tableName}
      WHERE LOWER(email) = LOWER(?)
    `;

    const [rows] = await db.query(query, [email.toLowerCase()]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.wachtwoord);

    if (!validPassword) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: type
      },
      securityConfig.jwt.secret,
      {
        expiresIn: securityConfig.jwt.expiresIn,
        issuer: securityConfig.jwt.issuer,
        audience: securityConfig.jwt.audience
      }
    );

    // Remove password from response
    delete user.wachtwoord;

    const responseData = {
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        naam: user.naam,
        type: type
      }
    };

    // Set secure HTTP-only cookie
    res.cookie('auth_token', token, securityConfig.cookies);

    res.json(responseData);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error bij inloggen' });
  }
});

module.exports = router;