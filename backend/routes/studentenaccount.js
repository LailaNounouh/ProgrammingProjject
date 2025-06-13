// routes/studentenaccount.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Studenten WHERE email = ?", 
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Student niet gevonden" });
    }

    const student = rows[0];
    delete student.wachtwoord;
    res.json(student);
  } catch (err) {
    console.error("Fout bij ophalen student:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

module.exports = router;