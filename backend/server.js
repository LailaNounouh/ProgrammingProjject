const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Routers
const homeRouter = require('./routes/home');
const registerRouter = require('./routes/register');
const newsletterRouter = require('./routes/newsletter');

const app = express();
app.use(cors());
app.use(express.json());

// Routers gebruiken
app.use('/api', homeRouter);
app.use('/api/register', registerRouter);
app.use('/api/newsletter', newsletterRouter);

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

// Oude visitor registratie route is verwijderd omdat dit nu in registerRouter zit

// Testroute
app.get('/', (req, res) => {
  res.send('✅ Backend server draait');
});

// Fallback 404
app.use((req, res) => {
  res.status(404).send('❌ Pagina niet gevonden');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
