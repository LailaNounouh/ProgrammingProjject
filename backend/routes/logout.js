const express = require('express');
const router = express.Router();

// POST /logout - Clear authentication cookies
router.post('/', (req, res) => {
  try {
    // Clear the auth token cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({ message: 'Succesvol uitgelogd' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Fout bij uitloggen' });
  }
});

module.exports = router;
