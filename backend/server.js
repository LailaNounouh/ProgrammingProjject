const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// API: Alle bedrijven ophalen
app.get('/api/bedrijven', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT company_id AS id, company_name AS name FROM companies');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen bedrijven' });
  }
});

// Bezoeker registreren (oude route, optioneel)
app.post('/register/visitor', async (req, res) => {
  try {
    const { email, passwordHash, name, phone, preferences } = req.body;

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, "visitor", ?)',
      [email, passwordHash, name]
    );
    const visitorId = result.insertId;

    await pool.query(
      'INSERT INTO visitor_profiles (visitor_id, phone, preferences) VALUES (?, ?, ?)',
      [visitorId, phone, preferences]
    );

    res.json({ message: 'Bezoeker geregistreerd', visitorId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fout bij registratie' });
  }
});

// Nieuwe algemene registratie route
app.post('/api/register', async (req, res) => {
  const { naam, email, wachtwoord, role } = req.body;

  if (!naam || !email || !wachtwoord || !role) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht' });
  }

  try {
    // Check of gebruiker al bestaat
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email is al geregistreerd' });
    }

    // Hash het wachtwoord
    const hashedPassword = await bcrypt.hash(wachtwoord, 10);

    // Voeg gebruiker toe
    await pool.query(
      'INSERT INTO users (naam, email, wachtwoord, role, is_verified) VALUES (?, ?, ?, ?, ?)',
      [naam, email, hashedPassword, role, 0]
    );

    res.json({ message: 'Registratie succesvol, wacht op verificatie' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Serverfout' });
  }
});

// Root-route
app.get('/', (req, res) => {
  res.send('✅ Backend server draait');
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('❌ Pagina niet gevonden');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
