const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

// Opslaginstellingen profielfoto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Zorg dat deze map bestaat
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET profiel ophalen via e-mail
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ error: "Student niet gevonden" });

    const student = rows[0];
    delete student.wachtwoord;
    res.json(student);
  } catch (err) {
    console.error("Fout bij ophalen profiel:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

// POST profiel bijwerken + foto uploaden
router.post("/", upload.single("profilePicture"), async (req, res) => {
  const { naam, email, telefoon, aboutMe } = req.body;
  const foto_url = req.file ? req.file.path : null; // aangepast naar foto_url

  if (!email) {
    return res.status(400).json({ error: "Email is verplicht" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);

    if (rows.length === 0) {
      // Insert nieuwe student
      await pool.query(
        `INSERT INTO Studenten (naam, email, telefoon, aboutMe, foto_url)
         VALUES (?, ?, ?, ?, ?)`,
        [naam, email, telefoon, aboutMe, foto_url]
      );
    } else {
      // Update bestaande student
      if (foto_url) {
        await pool.query(
          `UPDATE Studenten
           SET naam = ?, telefoon = ?, aboutMe = ?, foto_url = ?, updated_at = NOW()
           WHERE email = ?`,
          [naam, telefoon, aboutMe, foto_url, email]
        );
      } else {
        await pool.query(
          `UPDATE Studenten
           SET naam = ?, telefoon = ?, aboutMe = ?, updated_at = NOW()
           WHERE email = ?`,
          [naam, telefoon, aboutMe, email]
        );
      }
    }

    res.json({ success: true, message: "Profiel opgeslagen" });
  } catch (err) {
    console.error("Fout bij opslaan profiel:", err);
    res.status(500).json({ error: "Fout bij opslaan profiel" });
  }
});

module.exports = router;
