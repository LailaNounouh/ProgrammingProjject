const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json()); // voor JSON body parsing

// Eenvoudige route om alle bedrijven op te halen
app.get('/companies', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM companies');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout' });
  }
});

// Route om een nieuwe bezoeker te registreren
app.post('/register/visitor', async (req, res) => {
  try {
    const { email, passwordHash, name, phone, preferences } = req.body;

    // Maak gebruiker aan in users
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, "visitor", ?)',
      [email, passwordHash, name]
    );
    const visitorId = result.insertId;

    // Maak profiel aan in visitor_profiles
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

// Root-route
app.get('/', (req, res) => {
  res.send('✅ Backend server draait');
});

// Voorbeeldroute: alle bedrijven ophalen
app.get('/companies', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM companies');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout' });
  }
});

// Fallback-route voor niet-gedefinieerde routes
app.get('*', (req, res) => {
  res.status(404).send('❌ Pagina niet gevonden');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
