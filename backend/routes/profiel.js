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
 try {
   const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
   if (rows.length === 0) return res.status(404).json({ error: "Student niet gevonden" });


   const student = rows[0];
   delete student.wachtwoord;
   student.softskills = JSON.parse(student.softskills || '[]');
   student.hardskills = JSON.parse(student.hardskills || '[]');


   res.json(student);
 } catch (err) {
   console.error("Fout bij ophalen profiel:", err);
   res.status(500).json({ error: "Interne serverfout" });
 }
});


// GET profiel ophalen via ID
router.get("/id/:id", async (req, res) => {
 try {
   const [rows] = await pool.query("SELECT * FROM Studenten WHERE id = ?", [req.params.id]);


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
 const {
   naam,
   email,
   telefoon,
   aboutMe,
   github,
   linkedin,
   studie,
   softskills,
   hardskills,
 } = req.body;


 const nieuweFotoUrl = req.file ? req.file.path : null;
 const parsedSoftskills = Array.isArray(softskills) ? JSON.stringify(softskills) : '[]';
 const parsedHardskills = Array.isArray(hardskills) ? JSON.stringify(hardskills) : '[]';


 if (!email) {
   return res.status(400).json({ error: "Email is verplicht" });
 }


 try {
   const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
   let finalFotoUrl = nieuweFotoUrl;


   if (rows.length === 0) {
     const defaultPassword = "geheim123";


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
         parsedSoftskills,
         parsedHardskills,
       ]
     );
   } else {
     if (!finalFotoUrl) {
       finalFotoUrl = rows[0].foto_url;
     }


     await pool.query(
       `UPDATE Studenten
        SET naam = ?, telefoon = ?, aboutMe = ?, foto_url = ?, github_url = ?, linkedin_url = ?, studie = ?, softskills = ?, hardskills = ?
        WHERE email = ?`,
       [
         naam || null,
         telefoon || null,
         aboutMe || null,
         finalFotoUrl,
         github || null,
         linkedin || null,
         studie || null,
         parsedSoftskills,
         parsedHardskills,
         email,
       ]
     );
   }


   const [updatedRows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);
   const updatedStudent = updatedRows[0];
   delete updatedStudent.wachtwoord;
   updatedStudent.softskills = JSON.parse(updatedStudent.softskills || '[]');
   updatedStudent.hardskills = JSON.parse(updatedStudent.hardskills || '[]');


   res.json({ success: true, student: updatedStudent });
 } catch (err) {
   console.error("Fout bij opslaan profiel:", err);
   res.status(500).json({ error: err.message || "Fout bij opslaan profiel" });
 }
});


module.exports = router;


