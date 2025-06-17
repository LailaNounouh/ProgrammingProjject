const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/codeertalen", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT name, tag FROM Student_Programmeertalen");
    res.json(rows);
  } catch (err) {
    console.error("Fout bij ophalen codeertalen:", err.message);
    res.status(500).json({ error: "Databasefout" });
  }
});

module.exports = router;