const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');


// Routers
const homeRouter = require('./routes/home');
const registerRouter = require('./routes/register');
const newsletterRouter = require('./routes/newsletter');
const loginRouter = require('./routes/login');
const bedrijvenModuleRouter = require('./routes/bedrijvenmodule');
const sectorenRouter = require('./routes/sectoren');
const profielRouter = require('./routes/profiel');
const adminRouter = require('./routes/admin');
const afsprakenRouter = require('./routes/afspraken')
const codeertaalRouter = require('./routes/codeertalen');
const usersRouter = require('./routes/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust according to your security needs
    methods: ["GET", "POST"]
  }
});

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Statische map voor uploads (foto's e.d.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Multer configuratie voor profielfoto upload ---
const uploadFolder = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Alleen afbeeldingen toestaan
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Alleen afbeeldingen zijn toegestaan!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

// --- Nieuwe route voor profiel opslaan inclusief upload ---
app.post('/api/studentenaccount', upload.single('profilePicture'), async (req, res) => {
  try {
    // Uit formData:
    const { naam, email, telefoon, aboutMe, github, linkedin, type } = req.body;
    let profilePictureUrl = null;

    // URL van de geüploade afbeelding
    if (req.file) {
      profilePictureUrl = `/uploads/${req.file.filename}`;
    }

    res.status(200).json({ message: 'Profiel succesvol opgeslagen!' });
  } catch (error) {
    console.error('Fout bij opslaan profiel:', error);
    res.status(500).json({ error: 'Er ging iets mis bij het opslaan van het profiel.' });
  }
});
// Set up Socket.IO connection
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
apiRouter.use('/bedrijvenmodule', bedrijvenModuleRouter);
apiRouter.use('/sectoren', sectorenRouter);
apiRouter.use('/profiel', profielRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/afspraken', afsprakenRouter)
apiRouter.use('/codeertaal', codeertaalRouter);
apiRouter.use('/users', usersRouter);

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
server.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
