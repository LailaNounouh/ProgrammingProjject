const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

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
  console.log("=== PROFIEL GET ROUTE AANGEROEPEN ===");
  console.log("Ophalen profiel voor email:", email);
  
  try {
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
    if (rows.length === 0) {
      console.log("Student niet gevonden");
      return res.status(404).json({ error: "Student niet gevonden" });
    }

    const student = rows[0];
    delete student.wachtwoord;
    
    console.log("Opgehaalde softskills (raw):", student.softskills);
    console.log("Opgehaalde hardskills (raw):", student.hardskills);
    
    // Zorg ervoor dat de skills correct worden geparsed
    try {
      student.softskills = JSON.parse(student.softskills || '[]');
    } catch (e) {
      console.error("Fout bij parsen softskills:", e);
      student.softskills = [];
    }
    
    try {
      student.hardskills = JSON.parse(student.hardskills || '[]');
    } catch (e) {
      console.error("Fout bij parsen hardskills:", e);
      student.hardskills = [];
    }
    
    console.log("Geparsede softskills:", student.softskills);
    console.log("Geparsede hardskills:", student.hardskills);

    res.json(student);
  } catch (err) {
    console.error("Fout bij ophalen profiel:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});

// GET profiel ophalen via ID
router.get("/id/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE student_id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Profiel niet gevonden" });
    }
    const profiel = rows[0];
    delete profiel.wachtwoord;
    profiel.softskills = JSON.parse(profiel.softskills || '[]');
    profiel.hardskills = JSON.parse(profiel.hardskills || '[]');
    res.json(profiel);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST profiel bijwerken + foto uploaden
router.post("/", upload.single("profilePicture"), async (req, res) => {
  try {
    console.log("=== PROFIEL POST ROUTE AANGEROEPEN ===");
    console.log("Request body:", JSON.stringify(req.body));
    console.log("Request file:", req.file);

    const {
      naam,
      email,
      telefoon,
      aboutMe,
      github,
      linkedin,
      studie,
    } = req.body;

    // Haal de skills uit de request body
    let { softskills, hardskills } = req.body;
    
    console.log("Ontvangen softskills (raw):", typeof softskills, softskills);
    console.log("Ontvangen hardskills (raw):", typeof hardskills, hardskills);
    
    // Zorg ervoor dat de skills correct worden verwerkt
    try {
      // Als softskills een string is, probeer het te parsen als JSON
      if (typeof softskills === 'string') {
        try {
          // Probeer te parsen als JSON
          const parsedSoftskills = JSON.parse(softskills);
          console.log("Geparsed softskills:", parsedSoftskills);
          // Als het succesvol is geparsed, zet het terug naar een string voor opslag
          softskills = JSON.stringify(parsedSoftskills);
          console.log("Softskills geparsed van string naar JSON en terug:", softskills);
        } catch (e) {
          console.error("Fout bij parsen softskills:", e);
          // Als het geen geldige JSON is, maak er een lege array van
          softskills = "[]";
        }
      } else if (Array.isArray(softskills)) {
        // Als het al een array is, zet het om naar een JSON string
        console.log("Softskills is een array, wordt omgezet naar JSON string:", JSON.stringify(softskills));
        softskills = JSON.stringify(softskills);
      } else if (softskills === undefined || softskills === null) {
        // Als het undefined of null is, maak er een lege array van
        softskills = "[]";
      }
      
      // Hetzelfde voor hardskills
      if (typeof hardskills === 'string') {
        try {
          const parsedHardskills = JSON.parse(hardskills);
          console.log("Geparsed hardskills:", parsedHardskills);
          hardskills = JSON.stringify(parsedHardskills);
          console.log("Hardskills geparsed van string naar JSON en terug:", hardskills);
        } catch (e) {
          console.error("Fout bij parsen hardskills:", e);
          hardskills = "[]";
        }
      } else if (Array.isArray(hardskills)) {
        console.log("Hardskills is een array, wordt omgezet naar JSON string:", JSON.stringify(hardskills));
        hardskills = JSON.stringify(hardskills);
      } else if (hardskills === undefined || hardskills === null) {
        hardskills = "[]";
      }
    } catch (e) {
      console.error("Fout bij verwerken skills:", e);
      softskills = "[]";
      hardskills = "[]";
    }
    
    console.log("Verwerkte softskills voor opslag:", softskills);
    console.log("Verwerkte hardskills voor opslag:", hardskills);

    const nieuweFotoUrl = req.file ? req.file.path : null;

    if (!email) {
      console.error("Email ontbreekt in request");
      return res.status(400).json({ error: "Email is verplicht" });
    }

    console.log("Zoeken naar bestaande student met email:", email);
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
    console.log("Gevonden rijen:", rows.length);
    
    let finalFotoUrl = nieuweFotoUrl;

    if (rows.length === 0) {
      console.log("Student niet gevonden, nieuwe student aanmaken");
      const defaultPassword = "geheim123";
      // INSERT
      await pool.query(
        `INSERT INTO Studenten
          (naam, email, telefoon, aboutMe, foto_url, github_url, linkedin_url, studie, wachtwoord, softskills, hardskills)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          naam || null,
          email,
          telefoon || null,
          aboutMe || null,
          finalFotoUrl,
          github || null,
          linkedin || null,
          studie || null,
          defaultPassword,
          softskills,
          hardskills,
        ]
      );
      console.log("Nieuwe student aangemaakt");
    } else {
      console.log("Bestaande student gevonden, bijwerken");
      if (!finalFotoUrl) {
        finalFotoUrl = rows[0].foto_url;
      }
      
      // Log de huidige waarden in de database
      console.log("Huidige waarden in database:");
      console.log("- softskills:", rows[0].softskills);
      console.log("- hardskills:", rows[0].hardskills);
      
      // Log de query parameters
      console.log("UPDATE parameters:", [
        naam || rows[0].naam || null,
        telefoon || rows[0].telefoon || null,
        aboutMe || rows[0].aboutMe || null,
        finalFotoUrl,
        github || rows[0].github_url || null,
        linkedin || rows[0].linkedin_url || null,
        studie || rows[0].studie || null,
        softskills,
        hardskills,
        email,
      ]);
      
      // UPDATE
      const updateResult = await pool.query(
        `UPDATE Studenten
         SET naam = ?, telefoon = ?, aboutMe = ?, foto_url = ?, github_url = ?, linkedin_url = ?, studie = ?, softskills = ?, hardskills = ?
         WHERE email = ?`,
        [
          naam || rows[0].naam || null,
          telefoon || rows[0].telefoon || null,
          aboutMe || rows[0].aboutMe || null,
          finalFotoUrl,
          github || rows[0].github_url || null,
          linkedin || rows[0].linkedin_url || null,
          studie || rows[0].studie || null,
          softskills,
          hardskills,
          email,
        ]
      );
      console.log("Student bijgewerkt, update result:", updateResult);
      
      // Controleer direct na de update wat er in de database staat
      const [checkRows] = await pool.query("SELECT softskills, hardskills FROM Studenten WHERE email = ?", [email]);
      console.log("Direct na update, waarden in database:");
      console.log("- softskills:", checkRows[0].softskills);
      console.log("- hardskills:", checkRows[0].hardskills);
    }

    console.log("Ophalen bijgewerkte student gegevens");
    const [updatedRows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
    const updatedStudent = updatedRows[0];
    delete updatedStudent.wachtwoord;
    
    console.log("Opgeslagen softskills:", updatedStudent.softskills);
    console.log("Opgeslagen hardskills:", updatedStudent.hardskills);
    
    // Parse de skills voor de response
    try {
      updatedStudent.softskills = JSON.parse(updatedStudent.softskills || '[]');
      updatedStudent.hardskills = JSON.parse(updatedStudent.hardskills || '[]');
    } catch (e) {
      console.error("Fout bij parsen van opgeslagen skills:", e);
      updatedStudent.softskills = [];
      updatedStudent.hardskills = [];
    }
    
    console.log("Geparsede softskills voor response:", updatedStudent.softskills);
    console.log("Geparsede hardskills voor response:", updatedStudent.hardskills);

    res.json({ success: true, student: updatedStudent });
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
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student niet gevonden" });
    }
    
    const student = rows[0];
    delete student.wachtwoord;
    
    // Log de ruwe waarden
    console.log("Ruwe softskills in database:", student.softskills);
    console.log("Ruwe hardskills in database:", student.hardskills);
    
    // Probeer de skills te parsen
    try {
      student.parsedSoftskills = JSON.parse(student.softskills || '[]');
      student.parsedHardskills = JSON.parse(student.hardskills || '[]');
    } catch (e) {
      console.error("Fout bij parsen skills:", e);
      student.parsedSoftskills = [];
      student.parsedHardskills = [];
    }
    
    // Stuur de ruwe en geparsede waarden terug
    res.json({
      student,
      rawSoftskills: student.softskills,
      rawHardskills: student.hardskills,
      parsedSoftskills: student.parsedSoftskills,
      parsedHardskills: student.parsedHardskills
    });
  } catch (err) {
    console.error("Fout bij debug route:", err);
    res.status(500).json({ error: err.message || "Interne serverfout" });
  }
});

// Voeg een nieuwe route toe om de skills direct bij te werken
router.post("/update-skills/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { softskills, hardskills } = req.body;
    
    console.log("Update skills route aangeroepen voor email:", email);
    console.log("Nieuwe softskills:", softskills);
    console.log("Nieuwe hardskills:", hardskills);
    
    // Zorg ervoor dat de skills arrays zijn
    const softskillsArray = Array.isArray(softskills) ? softskills : [];
    const hardskillsArray = Array.isArray(hardskills) ? hardskills : [];
    
    // Zet de arrays om naar JSON strings
    const softskillsJson = JSON.stringify(softskillsArray);
    const hardskillsJson = JSON.stringify(hardskillsArray);
    
    console.log("Softskills JSON voor update:", softskillsJson);
    console.log("Hardskills JSON voor update:", hardskillsJson);
    
    // Update de skills in de database
    const updateResult = await pool.query(
      "UPDATE Studenten SET softskills = ?, hardskills = ? WHERE email = ?",
      [softskillsJson, hardskillsJson, email]
    );
    
    console.log("Update result:", updateResult);
    
    // Controleer of de update is gelukt
    const [rows] = await pool.query("SELECT softskills, hardskills FROM Studenten WHERE email = ?", [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student niet gevonden" });
    }
    
    console.log("Na update, waarden in database:");
    console.log("- softskills:", rows[0].softskills);
    console.log("- hardskills:", rows[0].hardskills);
    
    // Parse de skills voor de response
    let parsedSoftskills = [];
    let parsedHardskills = [];
    
    try {
      parsedSoftskills = JSON.parse(rows[0].softskills || '[]');
      parsedHardskills = JSON.parse(rows[0].hardskills || '[]');
    } catch (e) {
      console.error("Fout bij parsen skills na update:", e);
    }
    
    res.json({
      success: true,
      rawSoftskills: rows[0].softskills,
      rawHardskills: rows[0].hardskills,
      parsedSoftskills,
      parsedHardskills
    });
  } catch (err) {
    console.error("Fout bij update skills:", err);
    res.status(500).json({ error: err.message || "Interne serverfout" });
  }
});

module.exports = router;


