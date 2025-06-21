// Security configuration
require('dotenv').config();

const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-minimum-32-characters-long-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: 'careerlaunch-app',
    audience: 'careerlaunch-users'
  },

  // Rate Limiting Configuration
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    loginMaxAttempts: parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 5
  },

  // Password Configuration
  password: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false // Optional for now
  },

  // Cookie Configuration
  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },

  // CORS Configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : 
      ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  },

  // File Upload Configuration
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    uploadPath: process.env.UPLOAD_PATH || './uploads'
  },

  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    }
  },

  // Validation Rules
  validation: {
    email: {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 255
    },
    phone: {
      regex: /^(\+32|0)[1-9]\d{7,8}$/, // Belgian phone format
      maxLength: 20
    },
    postalCode: {
      regex: /^\d{4}$/, // Belgian postal code
      length: 4
    },
    btwNumber: {
      regex: /^BE\d{10}$/, // Belgian BTW format
      length: 12
    },
    name: {
      minLength: 2,
      maxLength: 100
    }
  }
};

module.exports = securityConfig;
