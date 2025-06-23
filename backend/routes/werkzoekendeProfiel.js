const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

// Test route to check if API is working
router.get("/test", (req, res) => {
  console.log("=== WERKZOEKENDE TEST ROUTE AANGEROEPEN ===");
  res.json({
    success: true,
    message: "Werkzoekende API is working!",
    timestamp: new Date().toISOString()
  });
});

// Opslaginstellingen profielfoto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
  console.log("=== WERKZOEKENDE GET ROUTE AANGEROEPEN ===");
  console.log("Ophalen profiel voor email:", email);
  
  try {
    console.log("Executing query: SELECT * FROM Werkzoekenden WHERE email = ?", [email]);
    const [rows] = await pool.query("SELECT * FROM Werkzoekenden WHERE email = ?", [email]);
    console.log(`Query result: Found ${rows.length} rows`);

    if (rows.length === 0) {
      console.log("No werkzoekende found for email:", email);
      return res.status(404).json({ error: "Profiel niet gevonden" });
    }

    const profiel = rows[0];
    console.log("Found werkzoekende profile:", {
      id: profiel.werkzoekende_id,
      naam: profiel.naam,
      email: profiel.email
    });

    delete profiel.wachtwoord; // Verwijder wachtwoord voor veiligheid

    console.log("Sending profile data to frontend");
    res.json(profiel);
  } catch (err) {
    console.error("Database error bij ophalen profiel:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    });
    res.status(500).json({
      error: err.message || "Interne serverfout",
      details: err.code || "Unknown error"
    });
  }
});

// GET profiel ophalen via ID
router.get("/id/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Werkzoekenden WHERE werkzoekende_id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Profiel niet gevonden" });
    }
    const profiel = rows[0];
    delete profiel.wachtwoord;
    

    
    res.json(profiel);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST profiel bijwerken + foto uploaden
router.post("/", upload.single("profilePicture"), async (req, res) => {
  try {
    console.log("=== WERKZOEKENDE POST ROUTE AANGEROEPEN ===");
    console.log("Request body:", JSON.stringify(req.body));
    console.log("Request file:", req.file);

    const {
      naam,
      email,
      linkedin_url,
      resetToken,
      resetTokenExpires
    } = req.body;

    // Log de social media links
    console.log("Ontvangen social media links:", {
      linkedin_url
    });

    const nieuweFotoUrl = req.file ? req.file.path : null;

    if (!email) {
      console.error("Email ontbreekt in request");
      return res.status(400).json({ error: "Email is verplicht" });
    }

    console.log("Zoeken naar bestaande werkzoekende met email:", email);
    const [rows] = await pool.query("SELECT * FROM Werkzoekenden WHERE email = ?", [email]);
    console.log("Gevonden rijen:", rows.length);
    
    let finalFotoUrl = nieuweFotoUrl;

    if (rows.length === 0) {
      console.log("Werkzoekende niet gevonden, nieuwe werkzoekende aanmaken");
      const defaultPassword = "geheim123"; // Of genereer een veilig wachtwoord
      // INSERT
      await pool.query(
        `INSERT INTO Werkzoekenden
          (naam, email, wachtwoord, foto_url, linkedin_url, resetToken, resetTokenExpires)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          naam || null,
          email,
          defaultPassword,
          finalFotoUrl,
          linkedin_url || null,
          resetToken || null,
          resetTokenExpires || null
        ]
      );
      console.log("Nieuwe werkzoekende aangemaakt");
    } else {
      console.log("Bestaande werkzoekende gevonden, bijwerken");
      if (!finalFotoUrl) {
        finalFotoUrl = rows[0].foto_url;
      }
      
      // Log de huidige waarden in de database
      console.log("Huidige waarden in database:");
      console.log("- foto_url:", rows[0].foto_url);
      console.log("- linkedin_url:", rows[0].linkedin_url);
      console.log("- resetToken:", rows[0].resetToken);
      console.log("- resetTokenExpires:", rows[0].resetTokenExpires);
      
      // UPDATE
      const updateResult = await pool.query(
        `UPDATE Werkzoekenden
         SET naam = ?, foto_url = ?, linkedin_url = ?, resetToken = ?, resetTokenExpires = ?
         WHERE email = ?`,
        [
          naam || rows[0].naam || null,
          finalFotoUrl,
          linkedin_url || rows[0].linkedin_url || null,
          resetToken || rows[0].resetToken || null,
          resetTokenExpires || rows[0].resetTokenExpires || null,
          email,
        ]
      );
      console.log("Werkzoekende bijgewerkt, update result:", updateResult);
    }

    console.log("Ophalen bijgewerkte werkzoekende gegevens");
    const [updatedRows] = await pool.query("SELECT * FROM Werkzoekenden WHERE email = ?", [email]);
    const updatedWerkzoekende = updatedRows[0];
    delete updatedWerkzoekende.wachtwoord;
    
    res.json({ success: true, werkzoekende: updatedWerkzoekende });
  } catch (err) {
    console.error("Fout bij opslaan profiel:", err);
    res.status(500).json({ error: err.message || "Fout bij opslaan profiel" });
  }
});

// Voeg een nieuwe route toe om de database direct te controleren
router.get("/debug/:email", async (req, res) => {
  try {
    const email = req.params.email;
    console.log("Debug route aangeroepen voor email:", email);
    
    // Haal de huidige waarden op uit de database
    const [rows] = await pool.query("SELECT * FROM Werkzoekenden WHERE email = ?", [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Werkzoekende niet gevonden" });
    }
    
    const werkzoekende = rows[0];
    delete werkzoekende.wachtwoord;
    
    res.json({
      werkzoekende
    });
  } catch (err) {
    console.error("Fout bij debug route:", err);
    res.status(500).json({ error: err.message || "Interne serverfout" });
  }
});

// Route om wachtwoord reset token bij te werken
router.post("/update-reset-token/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { resetToken, resetTokenExpires } = req.body;
    
    console.log("Update reset token route aangeroepen voor email:", email);
    console.log("Nieuwe resetToken:", resetToken);
    console.log("Nieuwe resetTokenExpires:", resetTokenExpires);
    
    // Update de reset token in de database
    const updateResult = await pool.query(
      "UPDATE werkzoekende SET resetToken = ?, resetTokenExpires = ? WHERE email = ?",
      [resetToken || null, resetTokenExpires || null, email]
    );
    
    console.log("Update result:", updateResult);
    
    // Controleer of de update is gelukt
    const [rows] = await pool.query("SELECT resetToken, resetTokenExpires FROM werkzoekende WHERE email = ?", [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Werkzoekende niet gevonden" });
    }
    
    console.log("Na update, waarden in database:");
    console.log("- resetToken:", rows[0].resetToken);
    console.log("- resetTokenExpires:", rows[0].resetTokenExpires);
    
    res.json({ success: true, resetToken: rows[0].resetToken, resetTokenExpires: rows[0].resetTokenExpires });
  } catch (err) {
    console.error("Fout bij update reset token route:", err);
    res.status(500).json({ error: err.message || "Interne serverfout" });
  }
});

module.exports = router;