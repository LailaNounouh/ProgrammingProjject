// routes/bedrijven.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const sql = "SELECT id, naam FROM bedrijven";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fout bij ophalen bedrijven:", err);
      return res.status(500).json({ error: "Interne serverfout" });
    }

    res.json(results);
  });
});

module.exports = router;
