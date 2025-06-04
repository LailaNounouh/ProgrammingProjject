// backend/routes/auth.routes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role, name } = req.body;
  if (!email || !password) return res.status(400).send('Email en wachtwoord zijn verplicht.');

  const hashed = await bcrypt.hash(password, 10);

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).send('Databasefout');
    if (row) return res.status(400).send('Email bestaat al');

    db.run(
      'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
      [email, hashed, role || 'student', name || null],
      function (err) {
        if (err) return res.status(500).send('Fout bij opslaan');
        const token = jwt.sign({ id: this.lastID, role: role || 'student' }, process.env.JWT_SECRET || 'secretkey');
        res.status(201).json({ token });
      }
    );
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Email en wachtwoord zijn verplicht.');

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).send('Databasefout');
    if (!user) return res.status(401).send('Ongeldige login');

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).send('Ongeldige login');

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secretkey');
    res.json({ token });
  });
});

module.exports = router;
