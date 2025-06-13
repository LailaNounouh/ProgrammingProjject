const express = require('express');
const pool = require('./db');
const cors = require('cors');

// Routers
const homeRouter = require('./routes/home');
const registerRouter = require('./routes/register');
const newsletterRouter = require('./routes/newsletter');
const loginRouter = require('./routes/login');
const studentenaccountRouter = require('./routes/studentenaccount');
const bedrijvenModuleRouter = require('./bedrijvenmodule'); // ✅ correcte pad!
const profielRouter = require('./routes/profiel');

const app = express();

// CORS-configuratie
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// API-routes groeperen onder /api
const apiRouter = express.Router();
apiRouter.use('/', homeRouter);
apiRouter.use('/register', registerRouter);
apiRouter.use('/newsletter', newsletterRouter);
apiRouter.use('/login', loginRouter);
apiRouter.use('/studentenaccount', studentenaccountRouter);
apiRouter.use('/bedrijvenmodule', bedrijvenModuleRouter); // ✅ correcte pad!
apiRouter.use('/profiel', profielRouter);

app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend server draait');
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('❌ Pagina niet gevonden');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
