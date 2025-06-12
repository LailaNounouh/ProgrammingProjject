const express = require("express");
const router = express.Router();
const { getAlleBedrijven } = require("../modules/bedrijfsmodule");

router.get("/", async (req, res) => {
  try {
    const bedrijven = await getAlleBedrijven();
    res.json(bedrijven);
  } catch (err) {
    console.error("Fout bij ophalen bedrijven:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

module.exports = router;
