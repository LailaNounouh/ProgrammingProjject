const express = require("express");
const router = express.Router();
const { getAlleBedrijven } = require("../modules/bedrijfsmodule");
const upload = require("../middleware/upload"); // Multer middleware
const pool = require("../db"); // Nodig om de database te updaten

// Haalt alle bedrijven op
router.get("/", async (req, res) => {
  try {
    const bedrijven = await getAlleBedrijven();
    res.json(bedrijven);
  } catch (err) {
    console.error("Fout bij ophalen bedrijven:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

// Upload bedrijfslogo en update logo_url in database
router.post("/upload-logo/:bedrijfId", upload.single("logo"), async (req, res) => {
  try {
    const { bedrijfId } = req.params;
    const logoPath = `/uploads/${req.file.filename}`; // relatieve URL

    await pool.query(
      "UPDATE Bedrijven SET logo_url = ? WHERE bedrijf_id = ?",
      [logoPath, bedrijfId]
    );

    res.json({ message: "Logo succesvol geüpload", logo_url: logoPath });
  } catch (err) {
    console.error("Fout bij uploaden logo:", err);
    res.status(500).json({ error: "Fout bij uploaden logo" });
  }
});

module.exports = router;
