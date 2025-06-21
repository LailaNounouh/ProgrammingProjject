const express = require("express");
const router = express.Router();
const pool = require("../db"); // database connectie

// Haal alle bedrijven op
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Bedrijven");
    res.json(rows);
  } catch (err) {
    console.error("Fout bij ophalen bedrijven:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

// Nieuwe route: haal één bedrijf op basis van bedrijfId
router.get("/:bedrijfId", async (req, res) => {
  try {
    const { bedrijfId } = req.params;
    const [rows] = await pool.query("SELECT * FROM Bedrijven WHERE bedrijf_id = ?", [bedrijfId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Bedrijf niet gevonden" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Fout bij ophalen bedrijf:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

module.exports = router;
