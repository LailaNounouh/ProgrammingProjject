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

// GET profiel ophalen via ID
router.get("/:id", async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        naam,
        email,
        studie,
        created_at
      FROM Studenten
      WHERE id = ?
    `;

    const [student] = await db.query(query, [req.params.id]);

    if (student.length === 0) {
      return res.status(404).json({ error: "Profiel niet gevonden" });
    }

    res.json(student[0]);
  } catch (error) {
    console.error("Error bij ophalen profiel:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST profiel bijwerken + foto uploaden
router.post("/", upload.single("profilePicture"), async (req, res) => {
  const { naam, email, telefoon, aboutMe, github, linkedin } = req.body;
  const nieuweFotoUrl = req.file ? req.file.path : null;

  if (!email) {
    return res.status(400).json({ error: "Email is verplicht" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);

    let finalFotoUrl = nieuweFotoUrl;

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
          finalFotoUrl,
          github || null,
          linkedin || null,
          defaultPassword,
        ]
      );
    } else {
      // Bestaande student, foto behouden indien niet meegegeven
      if (!finalFotoUrl) {
        finalFotoUrl = rows[0].foto_url; // behoud huidige foto
      }

      await pool.query(
        `UPDATE Studenten
         SET naam = ?, telefoon = ?, aboutMe = ?, foto_url = ?, github_url = ?, linkedin_url = ?
         WHERE email = ?`,
        [
          naam || null,
          telefoon || null,
          aboutMe || null,
          finalFotoUrl,
          github || null,
          linkedin || null,
          email,
        ]
      );
    }

    const [updatedRows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
    const updatedStudent = updatedRows[0];
    delete updatedStudent.wachtwoord;

    res.json({ success: true, student: updatedStudent });
  } catch (err) {
    console.error("Fout bij opslaan profiel:", err);
    res.status(500).json({ error: err.message || "Fout bij opslaan profiel" });
  }
});

module.exports = router;
