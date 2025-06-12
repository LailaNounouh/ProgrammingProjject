require('dotenv').config(); // Vergeet deze niet om env variabelen te laden
const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Routers
const homeRouter = require('./routes/home');
const registerRouter = require('./routes/register');
const newsletterRouter = require('./routes/newsletter');
const loginRouter = require('./routes/login');

// Import bedrijvenmodule router (zorg dat dit pad klopt)
const bedrijvenModuleRouter = require('./routes/bedrijvenmodule');

const app = express();

// CORS met opties
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Gebruik een express Router voor de base API path
const apiRouter = express.Router();

// Koppel subroutes aan de apiRouter
apiRouter.use('/', homeRouter);
apiRouter.use('/register', registerRouter);
apiRouter.use('/newsletter', newsletterRouter);
apiRouter.use('/login', loginRouter);

// Gebruik bedrijvenmodule voor alles met /bedrijvenmodule
apiRouter.use('/bedrijvenmodule', bedrijvenModuleRouter);

// Optioneel: oude route vervangen zodat /bedrijven ook werkt (met minimaal id en naam)
apiRouter.get('/bedrijven', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT id, bedrijfsnaam FROM bedrijven');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen bedrijven' });
  }
});

// Koppel de apiRouter aan base path /api
app.use('/api', apiRouter);

// Testroute (root van je server)
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
