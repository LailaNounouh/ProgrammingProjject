const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📁 Opslagconfiguratie voor profielfoto's
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads", "profile-pictures");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `profile-${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

// 🔹 GET: profiel ophalen
router.get("/", async (req, res) => {
  const { email, rol } = req.query;

  if (!email || !rol) {
    return res.status(400).json({ error: "Email en rol zijn verplicht" });
  }

  try {
    let query = "";
    if (rol === "student") {
      query = "SELECT * FROM Studenten WHERE email = ?";
    } else if (rol === "werkzoekende") {
      query = "SELECT * FROM Werkzoekenden WHERE email = ?";
    } else {
      return res.status(400).json({ error: "Ongeldige rol" });
    }

    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profiel niet gevonden" });
    }

    const profiel = rows[0];
    delete profiel.wachtwoord;
    res.json(profiel);
  } catch (err) {
    console.error("Fout bij ophalen profiel:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

// 🔹 POST: profiel bijwerken
router.post("/", upload.single("profilePicture"), async (req, res) => {
  const { naam, email, telefoon, aboutMe, rol } = req.body;

  if (!email || !rol) {
    return res.status(400).json({ error: "Email en rol zijn verplicht" });
  }

  try {
    const fotoUrl = req.file ? `/uploads/profile-pictures/${req.file.filename}` : null;

    let query = "";
    const params = [naam, telefoon, aboutMe];

    if (fotoUrl) {
      query = rol === "student"
        ? "UPDATE Studenten SET naam = ?, telefoon = ?, aboutMe = ?, foto_url = ? WHERE email = ?"
        : "UPDATE Werkzoekenden SET naam = ?, telefoon = ?, aboutMe = ?, foto_url = ? WHERE email = ?";
      params.push(fotoUrl, email);
    } else {
      query = rol === "student"
        ? "UPDATE Studenten SET naam = ?, telefoon = ?, aboutMe = ? WHERE email = ?"
        : "UPDATE Werkzoekenden SET naam = ?, telefoon = ?, aboutMe = ? WHERE email = ?";
      params.push(email);
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Gebruiker niet gevonden" });
    }

    res.json({ success: true, message: "Profiel bijgewerkt" });
  } catch (err) {
    console.error("Fout bij updaten profiel:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

module.exports = router;
