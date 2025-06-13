// routes/profiel.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Middleware om de ingelogde gebruiker op basis van email en rol op te halen
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
    delete profiel.wachtwoord; // beveiliging

    res.json(profiel);
  } catch (err) {
    console.error("Fout bij ophalen profiel:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

module.exports = router;
