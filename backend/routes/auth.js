const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'Registratie mislukt' });
    }
    res.status(201).json({ message: 'Registratie succesvol' });
  });
});

module.exports = router;
