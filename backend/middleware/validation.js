const validator = require('validator');

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim(); // Remove leading/trailing whitespace
};

// Validate email format
const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Validate password strength
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Wachtwoord moet minimaal 8 karakters lang zijn' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Wachtwoord moet minimaal één kleine letter bevatten' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Wachtwoord moet minimaal één hoofdletter bevatten' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Wachtwoord moet minimaal één cijfer bevatten' };
  }
  
  return { valid: true };
};

// Validate phone number (Belgian format)
const validatePhoneNumber = (phone) => {
  if (!phone) return true; // Optional field
  
  const phoneRegex = /^(\+32|0)[1-9]\d{7,8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validate postal code (Belgian format)
const validatePostalCode = (postalCode) => {
  if (!postalCode) return true; // Optional field
  
  const postalCodeRegex = /^\d{4}$/;
  return postalCodeRegex.test(postalCode);
};

// Validate BTW number (Belgian format)
const validateBTWNumber = (btwNumber) => {
  if (!btwNumber) return true; // Optional field
  
  const btwRegex = /^BE\d{10}$/;
  return btwRegex.test(btwNumber.replace(/\s/g, ''));
};

// Middleware to sanitize all string inputs
const sanitizeInputs = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) {
    sanitizeObject(req.body);
  }
  
  if (req.query) {
    sanitizeObject(req.query);
  }
  
  if (req.params) {
    sanitizeObject(req.params);
  }

  next();
};

// Validate registration input
const validateRegistration = (req, res, next) => {
  const { email, password, naam, type } = req.body;

  // Required fields
  if (!email || !password || !naam || !type) {
    return res.status(400).json({ 
      error: 'Email, wachtwoord, naam en type zijn verplicht' 
    });
  }

  // Email validation
  if (!validateEmail(email)) {
    return res.status(400).json({ 
      error: 'Ongeldig email formaat' 
    });
  }

  // Password validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ 
      error: passwordValidation.message 
    });
  }

  // Name validation
  if (naam.length < 2 || naam.length > 100) {
    return res.status(400).json({ 
      error: 'Naam moet tussen 2 en 100 karakters lang zijn' 
    });
  }

  // Type validation
  const allowedTypes = ['student', 'bedrijf', 'werkzoekende'];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ 
      error: 'Ongeldig account type' 
    });
  }

  next();
};

module.exports = {
  sanitizeInput,
  sanitizeInputs,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validatePostalCode,
  validateBTWNumber,
  validateRegistration
};
