const express = require("express");
const router = express.Router();
const pool = require("../db");
router.get("/", async (req, res) => {
  try {
    const [bedrijven] = await pool.query("SELECT COUNT(*) AS count FROM Bedrijven");
    const [studenten] = await pool.query("SELECT COUNT(*) AS count FROM Studenten");
    const [werkzoekenden] = await pool.query("SELECT COUNT(*) AS count FROM Werkzoekenden");
    const [afspraken] = await pool.query("SELECT COUNT(*) AS count FROM Afspraken WHERE actief = 1");

    res.json({
      bedrijven: bedrijven[0].count,
      studenten: studenten[0].count,
      werkzoekenden: werkzoekenden[0].count,
      afspraken: afspraken[0].count,
    });
  } catch (err) {
    console.error("Fout bij ophalen statistieken:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

module.exports = router;
