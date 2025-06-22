require('dotenv').config();
const express = require('express');
const pool = require('./db');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');

// Import security middleware and configuration
const { sanitizeInputs } = require('./middleware/validation');
const securityConfig = require('./config/security');

// Routers
const homeRouter = require('./routes/home');
const registerRouter = require('./routes/register');
const newsletterRouter = require('./routes/newsletter');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const wachtwoordVergetenRouter = require('./routes/wachtwoordVergeten');
const bedrijvenModuleRouter = require('./routes/bedrijvenmodule');
const sectorenRouter = require('./routes/sectoren');
const profielRouter = require('./routes/profiel');
const adminRouter = require('./routes/admin');
const afsprakenRouter = require('./routes/afspraken');
//const codeertaalRouter = require('./routes/codeertalen');
const usersRouter = require('./routes/users');
const statistiekenRouter = require('./routes/Statistieken');
const attendanceRouter = require('./routes/attendance');
const betalingRouter = require('./routes/betaling');
const notificationsRouter = require('./routes/notifications');


console.log('server.js: Alle routers geïmporteerd.');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { 
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Security middleware (simplified for development)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: securityConfig.csp.directives,
    },
    crossOriginEmbedderPolicy: false
  }));

  // Rate limiting (only in production)
  const generalLimiter = rateLimit({
    windowMs: securityConfig.rateLimiting.windowMs,
    max: securityConfig.rateLimiting.maxRequests,
    message: {
      error: 'Te veel verzoeken van dit IP. Probeer later opnieuw.'
    }
  });

  app.use('/api', generalLimiter);
} else {
  // Development mode - basic helmet only
  app.use(helmet({ contentSecurityPolicy: false }));
}

app.use(cors(securityConfig.cors));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply input sanitization to all routes
app.use(sanitizeInputs);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Multer configuratie voor profielfoto upload ---
// (deze is niet meer nodig in server.js zelf, want upload gebeurt in routes/profiel.js)

// Verwijderde POST /api/studentenaccount route!

// Socket.IO connection setup
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a room for a specific company and date
  socket.on('joinAppointmentRoom', ({ bedrijfId, datum }) => {
    const roomName = `appointments-${bedrijfId}-${datum}`;
    socket.join(roomName);
    console.log(`Client joined room: ${roomName}`);
  });
  
  // Leave a room
  socket.on('leaveAppointmentRoom', ({ bedrijfId, datum }) => {
    const roomName = `appointments-${bedrijfId}-${datum}`;
    socket.leave(roomName);
    console.log(`Client left room: ${roomName}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Maak apiRouter aan
const apiRouter = express.Router();

// Koppel subroutes
apiRouter.use('/', homeRouter);
apiRouter.use('/register', registerRouter);
apiRouter.use('/newsletter', newsletterRouter);
apiRouter.use('/login', loginRouter);
apiRouter.use('/logout', logoutRouter);
apiRouter.use('/wachtwoord-vergeten', wachtwoordVergetenRouter);
apiRouter.use('/bedrijvenmodule', bedrijvenModuleRouter);
apiRouter.use('/sectoren', sectorenRouter);
apiRouter.use('/profiel', profielRouter); // <-- Hier wordt je profiel-router gebruikt!
apiRouter.use('/admin', adminRouter);
apiRouter.use('/afspraken', afsprakenRouter);
//apiRouter.use('/codeertaal', codeertaalRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/statistieken', statistiekenRouter);
apiRouter.use('/attendance', attendanceRouter);
apiRouter.use('/betaling', betalingRouter);
apiRouter.use('/notifications', notificationsRouter);


app.use('/api', apiRouter);

// De conflict tussen de vite.config en server vermijden, tweede ingang
const viteProxyRouter = express.Router();

viteProxyRouter.use('/admin', adminRouter);
viteProxyRouter.use('/attendance', attendanceRouter);

app.use('/', viteProxyRouter);

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend server draait');
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('❌ Pagina niet gevonden');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
