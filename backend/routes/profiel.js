const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

// Multer setup voor profielfoto
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST: profiel opslaan of bijwerken
router.post("/", upload.single("profilePicture"), async (req, res) => {
  const {
    naam,
    email,
    telefoon,
    aboutMe,
    github,
    linkedin,
    studie,
    jobstudent,
    werkzoekend,
    stage_gewenst,
  } = req.body;

  const foto_url = req.file ? req.file.path : null;

  if (!email) {
    return res.status(400).json({ error: "Email is verplicht" });
  }

  try {
    // Check of student al bestaat
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);

    if (rows.length === 0) {
      // ✅ INSERT nieuw profiel
      const columns = ["email"];
      const values = [email];

      if (naam) columns.push("naam"), values.push(naam);
      if (telefoon) columns.push("telefoon"), values.push(telefoon);
      if (aboutMe) columns.push("aboutMe"), values.push(aboutMe);
      if (studie) columns.push("studie"), values.push(studie);
      if (foto_url) columns.push("foto_url"), values.push(foto_url);
      if (github) columns.push("github_url"), values.push(github);
      if (linkedin) columns.push("linkedin_url"), values.push(linkedin);
      if (jobstudent !== undefined) columns.push("jobstudent"), values.push(jobstudent);
      if (werkzoekend !== undefined) columns.push("werkzoekend"), values.push(werkzoekend);
      if (stage_gewenst !== undefined) columns.push("stage_gewenst"), values.push(stage_gewenst);

      // ❗ tijdelijk wachtwoord aanmaken als placeholder (je kan dit vervangen met echte login flow)
      columns.push("wachtwoord");
      values.push("placeholder");

      const placeholders = columns.map(() => "?").join(", ");
      const sql = `INSERT INTO Studenten (${columns.join(", ")}) VALUES (${placeholders})`;
      await pool.query(sql, values);
    } else {
      // ✅ UPDATE bestaand profiel
      const updates = [];
      const values = [];

      if (naam) updates.push("naam = ?"), values.push(naam);
      if (telefoon) updates.push("telefoon = ?"), values.push(telefoon);
      if (aboutMe) updates.push("aboutMe = ?"), values.push(aboutMe);
      if (studie) updates.push("studie = ?"), values.push(studie);
      if (foto_url) updates.push("foto_url = ?"), values.push(foto_url);
      if (github) updates.push("github_url = ?"), values.push(github);
      if (linkedin) updates.push("linkedin_url = ?"), values.push(linkedin);
      if (jobstudent !== undefined) updates.push("jobstudent = ?"), values.push(jobstudent);
      if (werkzoekend !== undefined) updates.push("werkzoekend = ?"), values.push(werkzoekend);
      if (stage_gewenst !== undefined) updates.push("stage_gewenst = ?"), values.push(stage_gewenst);

      if (updates.length > 0) {
        const sql = `UPDATE Studenten SET ${updates.join(", ")} WHERE email = ?`;
        values.push(email);
        await pool.query(sql, values);
      }
    }

    res.json({ success: true, message: "Profiel opgeslagen" });
  } catch (err) {
    console.error("Fout bij profiel opslaan:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

module.exports = router;
