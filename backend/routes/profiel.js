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
      return res.status(404).json({ error: "Profiel niet gevonden" });
    }

    const profiel = rows[0];
    delete profiel.wachtwoord; // Verwijder wachtwoord voor veiligheid
    
    // Parse JSON velden
    try {
      // Verwerk programmeertalen
      if (profiel.programmeertalen) {
        try {
          profiel.codeertalen = JSON.parse(profiel.programmeertalen);
          console.log("Geparsed programmeertalen:", profiel.codeertalen);
        } catch (e) {
          console.error("Fout bij parsen programmeertalen:", e);
          profiel.codeertalen = [];
        }
      } else {
        profiel.codeertalen = [];
      }
      
      // Zorg ervoor dat programmeertalen ook beschikbaar is voor compatibiliteit
      profiel.programmeertalen = profiel.codeertalen;
      
      // Verwerk andere velden...
    } catch (e) {
      console.error("Fout bij parsen van profiel data:", e);
      // Zet alles op lege arrays als er een fout optreedt
      profiel.softskills = [];
      profiel.hardskills = [];
      profiel.codeertalen = [];
      profiel.programmeertalen = [];
      profiel.talen = [];
    }

    res.json(profiel);
  } catch (err) {
    console.error("Fout bij ophalen profiel:", err);
    res.status(500).json({ error: err.message || "Interne serverfout" });
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
    
    // Parse alle skills
    profiel.softskills = JSON.parse(profiel.softskills || '[]');
    profiel.hardskills = JSON.parse(profiel.hardskills || '[]');
    profiel.codeertaal = JSON.parse(profiel.programmeertalen || '[]');
    profiel.talen = JSON.parse(profiel.talen || '[]');
    
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
      jobstudent,
      werkzoekend,
      stage_gewenst,
      bachelorproef_gewenst
    } = req.body;

    // Log de social media links
    console.log("Ontvangen social media links:", {
      github,
      linkedin
    });

    // Haal de skills uit de request body
    let { softskills, hardskills, codeertalen, talen } = req.body;
    
    console.log("Ontvangen softskills (raw):", typeof softskills, softskills);
    console.log("Ontvangen hardskills (raw):", typeof hardskills, hardskills);
    console.log("Ontvangen codeertalen (raw):", typeof codeertalen, codeertalen);
    console.log("Ontvangen talen (raw):", typeof talen, talen);
    console.log("Ontvangen voorkeuren:", {
      jobstudent,
      werkzoekend,
      stage_gewenst,
      bachelorproef_gewenst
    });
    
    // Verwerk de skills voor opslag in de database
    // Softskills verwerken
    let softskillsJSON = '[]';
    if (typeof softskills === 'string') {
      try {
        // Controleer of het al een JSON string is
        JSON.parse(softskills);
        softskillsJSON = softskills;
      } catch (e) {
        // Als het geen geldige JSON is, maak er dan een JSON string van
        softskillsJSON = JSON.stringify([]);
      }
    } else if (Array.isArray(softskills)) {
      softskillsJSON = JSON.stringify(softskills);
    }
    
    // Hardskills verwerken
    let hardskillsJSON = '[]';
    if (typeof hardskills === 'string') {
      try {
        JSON.parse(hardskills);
        hardskillsJSON = hardskills;
      } catch (e) {
        hardskillsJSON = JSON.stringify([]);
      }
    } else if (Array.isArray(hardskills)) {
      hardskillsJSON = JSON.stringify(hardskills);
    }
    
    // Codeertalen verwerken
    let codeertaalenJSON = '[]';
    if (typeof codeertalen === 'string') {
      try {
        JSON.parse(codeertalen);
        codeertaalenJSON = codeertalen;
      } catch (e) {
        codeertaalenJSON = JSON.stringify([]);
      }
    } else if (Array.isArray(codeertalen)) {
      codeertaalenJSON = JSON.stringify(codeertalen);
    }
    
    // Talen verwerken
    let talenJSON = '[]';
    if (typeof talen === 'string') {
      try {
        JSON.parse(talen);
        talenJSON = talen;
      } catch (e) {
        talenJSON = JSON.stringify([]);
      }
    } else if (Array.isArray(talen)) {
      talenJSON = JSON.stringify(talen);
    }
    
    console.log("Verwerkte softskills voor opslag:", softskillsJSON);
    console.log("Verwerkte hardskills voor opslag:", hardskillsJSON);
    console.log("Verwerkte codeertalen voor opslag:", codeertaalenJSON);
    console.log("Verwerkte talen voor opslag:", talenJSON);

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
          (naam, email, telefoon, aboutMe, foto_url, github_url, linkedin_url, studie, wachtwoord, 
           softskills, hardskills, programmeertalen, talen, jobstudent, werkzoekend, stage_gewenst, bachelorproef_gewenst)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          softskillsJSON,
          hardskillsJSON,
          codeertaalenJSON, // Opslaan als programmeertalen in de database
          talenJSON,
          jobstudent === 'true' || jobstudent === true ? 1 : 0,
          werkzoekend === 'true' || werkzoekend === true ? 1 : 0,
          stage_gewenst === 'true' || stage_gewenst === true ? 1 : 0,
          bachelorproef_gewenst === 'true' || bachelorproef_gewenst === true ? 1 : 0
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
      console.log("- programmeertalen:", rows[0].programmeertalen);
      console.log("- talen:", rows[0].talen);
      console.log("- github_url:", rows[0].github_url);
      console.log("- linkedin_url:", rows[0].linkedin_url);
      
      // Converteer boolean waarden naar 0/1 voor MySQL
      const jobstudentValue = jobstudent === 'true' || jobstudent === true ? 1 : 0;
      const werkzoekendValue = werkzoekend === 'true' || werkzoekend === true ? 1 : 0;
      const stageGewenstValue = stage_gewenst === 'true' || stage_gewenst === true ? 1 : 0;
      const bachelorproefGewenstValue = bachelorproef_gewenst === 'true' || bachelorproef_gewenst === true ? 1 : 0;
      
      // Log de query parameters
      console.log("UPDATE parameters:", [
        naam || rows[0].naam || null,
        telefoon || rows[0].telefoon || null,
        aboutMe || rows[0].aboutMe || null,
        finalFotoUrl,
        github || rows[0].github_url || null,
        linkedin || rows[0].linkedin_url || null,
        studie || rows[0].studie || null,
        softskillsJSON,
        hardskillsJSON,
        codeertaalenJSON,
        talenJSON,
        jobstudentValue,
        werkzoekendValue,
        stageGewenstValue,
        bachelorproefGewenstValue,
        email,
      ]);
      
      // UPDATE
      const updateResult = await pool.query(
        `UPDATE Studenten
         SET naam = ?, telefoon = ?, aboutMe = ?, foto_url = ?, github_url = ?, linkedin_url = ?, 
             studie = ?, softskills = ?, hardskills = ?, programmeertalen = ?, talen = ?,
             jobstudent = ?, werkzoekend = ?, stage_gewenst = ?, bachelorproef_gewenst = ?
         WHERE email = ?`,
        [
          naam || rows[0].naam || null,
          telefoon || rows[0].telefoon || null,
          aboutMe || rows[0].aboutMe || null,
          finalFotoUrl,
          github || rows[0].github_url || null,
          linkedin || rows[0].linkedin_url || null,
          studie || rows[0].studie || null,
          softskillsJSON,
          hardskillsJSON,
          codeertaalenJSON,
          talenJSON,
          jobstudentValue,
          werkzoekendValue,
          stageGewenstValue,
          bachelorproefGewenstValue,
          email,
        ]
      );
      console.log("Student bijgewerkt, update result:", updateResult);
    }

    console.log("Ophalen bijgewerkte student gegevens");
    const [updatedRows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
    const updatedStudent = updatedRows[0];
    delete updatedStudent.wachtwoord;
    
    console.log("Opgeslagen softskills:", updatedStudent.softskills);
    console.log("Opgeslagen hardskills:", updatedStudent.hardskills);
    console.log("Opgeslagen programmeertalen:", updatedStudent.programmeertalen);
    console.log("Opgeslagen talen:", updatedStudent.talen);
    
    // Parse de skills voor de response
    try {
      updatedStudent.softskills = JSON.parse(updatedStudent.softskills || '[]');
      updatedStudent.hardskills = JSON.parse(updatedStudent.hardskills || '[]');
      updatedStudent.codeertalen = JSON.parse(updatedStudent.programmeertalen || '[]');
      updatedStudent.talen = JSON.parse(updatedStudent.talen || '[]');
    } catch (e) {
      console.error("Fout bij parsen van opgeslagen skills:", e);
      updatedStudent.softskills = [];
      updatedStudent.hardskills = [];
      updatedStudent.codeertalen = [];
      updatedStudent.talen = [];
    }
    
    console.log("Geparsede softskills voor response:", updatedStudent.softskills);
    console.log("Geparsede hardskills voor response:", updatedStudent.hardskills);
    console.log("Geparsede codeertalen voor response:", updatedStudent.codeertalen);
    console.log("Geparsede talen voor response:", updatedStudent.talen);

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
    console.log("Ruwe programmeertalen in database:", student.programmeertalen);
    console.log("Ruwe talen in database:", student.talen);
    
    // Probeer de skills te parsen
    try {
      student.parsedSoftskills = JSON.parse(student.softskills || '[]');
      student.parsedHardskills = JSON.parse(student.hardskills || '[]');
      student.parsedCodeertaal = JSON.parse(student.programmeertalen || '[]');
      student.parsedTalen = JSON.parse(student.talen || '[]');
    } catch (e) {
      console.error("Fout bij parsen skills:", e);
      student.parsedSoftskills = [];
      student.parsedHardskills = [];
      student.parsedCodeertaal = [];
      student.parsedTalen = [];
    }
    
    // Stuur de ruwe en geparsede waarden terug
    res.json({
      student,
      rawSoftskills: student.softskills,
      rawHardskills: student.hardskills,
      rawProgrammeertalen: student.programmeertalen,
      rawTalen: student.talen,
      parsedSoftskills: student.parsedSoftskills,
      parsedHardskills: student.parsedHardskills,
      parsedCodeertaal: student.parsedCodeertaal,
      parsedTalen: student.parsedTalen
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

// PUT route voor het bijwerken van een profiel
router.put("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const {
      naam,
      telefoon,
      aboutMe,
      github,
      linkedin_url,
      studie,
      softskills,
      hardskills,
      programmeertalen,
      codeertalen, // Voeg codeertalen toe voor compatibiliteit
      talen,
      jobstudent,
      werkzoekend,
      stage_gewenst,
      bachelorproef_gewenst
    } = req.body;

    console.log("PUT request ontvangen voor email:", email);
    console.log("GitHub URL:", github);
    console.log("Programmeertalen:", programmeertalen);
    console.log("Codeertalen:", codeertalen);
    
    // Controleer of de student bestaat
    const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student niet gevonden" });
    }
    
    // Verwerk programmeertalen voor opslag
    // Gebruik codeertalen als programmeertalen niet beschikbaar is
    const talenToProcess = programmeertalen || codeertalen || [];
    let processedProgrammeertalen = '[]';
    
    if (typeof talenToProcess === 'string') {
      try {
        JSON.parse(talenToProcess);
        processedProgrammeertalen = talenToProcess;
      } catch (e) {
        processedProgrammeertalen = JSON.stringify([]);
      }
    } else if (Array.isArray(talenToProcess)) {
      processedProgrammeertalen = JSON.stringify(talenToProcess);
    }
    
    console.log("Verwerkte programmeertalen voor opslag:", processedProgrammeertalen);
    
    // Verwerk andere skills...
    
    // Update de student
    await pool.query(
      `UPDATE Studenten
       SET naam = ?, telefoon = ?, aboutMe = ?, github_url = ?, linkedin_url = ?, 
           studie = ?, softskills = ?, hardskills = ?, programmeertalen = ?, talen = ?,
           jobstudent = ?, werkzoekend = ?, stage_gewenst = ?, bachelorproef_gewenst = ?
       WHERE email = ?`,
      [
        naam || rows[0].naam,
        telefoon || rows[0].telefoon,
        aboutMe || rows[0].aboutMe,
        github || rows[0].github_url,
        linkedin_url || rows[0].linkedin_url,
        studie || rows[0].studie,
        // Verwerk andere skills...
        processedProgrammeertalen,
        // Andere velden...
        email
      ]
    );
    
    res.json({ message: "Profiel succesvol bijgewerkt" });
  } catch (err) {
    console.error("Fout bij bijwerken profiel:", err);
    res.status(500).json({ error: err.message || "Interne serverfout" });
  }
});

// Debug route om te controleren wat er in de database staat
router.get("/debug-programmeertalen/:email", async (req, res) => {
  try {
    const { email } = req.params;
    
    console.log("Debug programmeertalen route aangeroepen voor email:", email);
    
    // Haal de huidige waarden op uit de database
    const [rows] = await pool.query("SELECT programmeertalen FROM Studenten WHERE email = ?", [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student niet gevonden" });
    }
    
    const rawProgrammeertalen = rows[0].programmeertalen;
    console.log("Ruwe programmeertalen in database:", rawProgrammeertalen);
    
    // Probeer de programmeertalen te parsen
    let parsedProgrammeertalen = [];
    try {
      parsedProgrammeertalen = JSON.parse(rawProgrammeertalen || '[]');
    } catch (e) {
      console.error("Fout bij parsen programmeertalen:", e);
    }
    
    res.json({
      rawProgrammeertalen,
      parsedProgrammeertalen
    });
  } catch (err) {
    console.error("Fout bij debug programmeertalen route:", err);
    res.status(500).json({ error: err.message || "Interne serverfout" });
  }
});

// POST route voor het bijwerken van alleen de programmeertalen
router.post("/update-programmeertalen/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { programmeertalen } = req.body;

    console.log("POST request ontvangen voor bijwerken programmeertalen voor email:", email);
    console.log("Programmeertalen:", programmeertalen);
    
    // Verwerk programmeertalen voor opslag
    let processedProgrammeertalen = '[]';
    if (typeof programmeertalen === 'string') {
      try {
        JSON.parse(programmeertalen);
        processedProgrammeertalen = programmeertalen;
      } catch (e) {
        processedProgrammeertalen = JSON.stringify([]);
      }
    } else if (Array.isArray(programmeertalen)) {
      processedProgrammeertalen = JSON.stringify(programmeertalen);
    }
    
    console.log("Verwerkte programmeertalen voor opslag:", processedProgrammeertalen);
    
    // Update alleen de programmeertalen
    const [result] = await pool.query(
      "UPDATE Studenten SET programmeertalen = ? WHERE email = ?",
      [processedProgrammeertalen, email]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student niet gevonden" });
    }
    
    res.json({ message: "Programmeertalen succesvol bijgewerkt" });
  } catch (err) {
    console.error("Fout bij bijwerken programmeertalen:", err);
    res.status(500).json({ error: err.message || "Interne serverfout" });
  }
});

// (Zoek de upload/profielfoto route, vervang door:)
router.post('/upload-foto/:id', (req, res) => {
  return res.status(410).json({ error: 'Profielfoto upload tijdelijk uitgeschakeld' });
});

module.exports = router;


