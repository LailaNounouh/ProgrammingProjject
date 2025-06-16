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
    delete student.wachtwoord; // Wachtwoord niet teruggeven
    res.json(student);
  } catch (err) {
    console.error("Fout bij ophalen profiel:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

// POST profiel bijwerken + foto uploaden
router.post("/", upload.single("profilePicture"), async (req, res) => {
  const { naam, email, telefoon, aboutMe, github, linkedin } = req.body;
  const foto_url = req.file ? req.file.path : null;

  if (!email) {
    return res.status(400).json({ error: "Email is verplicht" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);

    if (rows.length === 0) {
      // Nieuwe student: wachtwoord verplicht, hier tijdelijk default wachtwoord
      const defaultPassword = "geheim123"; // Pas aan of behandel dit beter in registratieproces

      await pool.query(
        `INSERT INTO Studenten 
          (naam, email, telefoon, aboutMe, foto_url, github_url, linkedin_url, wachtwoord)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          naam || null,
          email,
          telefoon || null,
          aboutMe || null,
          foto_url,
          github || null,
          linkedin || null,
          defaultPassword,
        ]
      );
    } else {
      // Update bestaande student
      if (foto_url) {
        await pool.query(
          `UPDATE Studenten
           SET naam = ?, telefoon = ?, aboutMe = ?, foto_url = ?, github_url = ?, linkedin_url = ?
           WHERE email = ?`,
          [
            naam || null,
            telefoon || null,
            aboutMe || null,
            foto_url,
            github || null,
            linkedin || null,
            email,
          ]
        );
      } else {
        await pool.query(
          `UPDATE Studenten
           SET naam = ?, telefoon = ?, aboutMe = ?, github_url = ?, linkedin_url = ?, updated_at = NOW()
           WHERE email = ?`,
          [
            naam || null,
            telefoon || null,
            aboutMe || null,
            github || null,
            linkedin || null,
            email,
          ]
        );
      }
    }

    res.json({ success: true, message: "Profiel opgeslagen" });
  } catch (err) {
    console.error("Fout bij opslaan profiel:", err);
    res.status(500).json({ error: err.message || "Fout bij opslaan profiel" });
  }
});

module.exports = router;
