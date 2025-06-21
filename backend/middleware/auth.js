const jwt = require('jsonwebtoken');
const securityConfig = require('../config/security');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // Also check for token in cookies
  const cookieToken = req.cookies?.auth_token;
  
  const finalToken = token || cookieToken;

  if (!finalToken) {
    return res.status(401).json({ error: 'Toegang geweigerd. Geen token opgegeven.' });
  }

  try {
    const decoded = jwt.verify(finalToken, securityConfig.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token verlopen. Log opnieuw in.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Ongeldig token.' });
    } else {
      return res.status(500).json({ error: 'Token verificatie mislukt.' });
    }
  }
};

// Middleware to check if user has specific role
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Niet geautoriseerd' });
    }

    if (!allowedRoles.includes(req.user.type)) {
      return res.status(403).json({ error: 'Onvoldoende rechten' });
    }

    next();
  };
};

// Middleware to check if user owns the resource
const requireOwnership = (req, res, next) => {
  const resourceId = req.params.id;
  const userId = req.user.id;

  if (resourceId != userId && req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Toegang geweigerd. U kunt alleen uw eigen gegevens bekijken.' });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnership
};
