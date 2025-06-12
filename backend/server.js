const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Routers
const homeRouter = require('./routes/home');
const registerRouter = require('./routes/register');
const newsletterRouter = require('./routes/newsletter');
const loginRouter = require('./routes/login');

// Correcte import bedrijvenmodule router (let op juiste bestandsnaam en extensie)
const bedrijvenModuleRouter = require('./routes/bedrijvenmodule');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Maak apiRouter aan
const apiRouter = express.Router();

// Koppel subroutes
apiRouter.use('/', homeRouter);
apiRouter.use('/register', registerRouter);
apiRouter.use('/newsletter', newsletterRouter);
apiRouter.use('/login', loginRouter);

// Gebruik bedrijvenmodule router onder /bedrijvenmodule
apiRouter.use('/bedrijvenmodule', bedrijvenModuleRouter);

// Optioneel: route /bedrijven (met alleen id en bedrijfsnaam)
apiRouter.get('/bedrijven', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, bedrijfsnaam FROM bedrijven');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen bedrijven' });
  }
});

app.use('/api', apiRouter);

// Root route
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
