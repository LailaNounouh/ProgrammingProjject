// backend/middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Map waar uploads worden opgeslagen
const uploadFolder = "uploads/";

// Configuratie van opslag
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // Unieke bestandsnaam maken
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter voor alleen afbeeldingen (optioneel)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Alleen afbeeldingen zijn toegestaan!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Max 5MB
  },
});

module.exports = upload;
