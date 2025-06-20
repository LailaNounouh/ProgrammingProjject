const express = require("express");
const router = express.Router();
const db = require("../db");
const crypto = require("crypto"); 


// zorgt voor de deelnemer check-in Post/api/attendance/check-in
router.post("/check-in", async (req, res) => {
    try {
        const { name, email, type } = req.body;


        // Valideren van de velden
        if (!name || !email || !type) {
            return res.status(400).json({ 
                error: "Ontbrekende vereiste velden: naam, e-mail, type" 
            });
        }

        const validTypes = ["student", "werkzoekende", "bezoeker"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                error: "Ongeldig deelnemerstype. Moet zijn: student, werkzoekende of bezoeker" 
            });
        }

        // Controleren of deelnemer vandaag al ingecheckt is
        const [existing] = await db.execute(
            `SELECT id FROM checkins 
             WHERE email = ? AND type = ? AND DATE(created_at) = CURDATE()`,
            [email, type]
        );

        console.log('Check if already checked in:', existing);

        if (existing.length > 0) {
            return res.status(400).json({ 
                error: "Deelnemer is vandaag al ingecheckt",
                alreadyCheckedIn: true 
            });
        }

        // Gegevens opslaan in checkins tabel
       const [result] =  await db.execute(
            `INSERT INTO checkins (name, email, type, status) 
             VALUES (?, ?, ?, 'checked_in')`,
            [name, email, type]
        );
        console.log('Insert result:', result);

        res.json({
            success: true,
            message: "Check-in succesvol geregistreerd",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error tijdens check-in", error.message,error.stack);
        res.status(500).json({ error: error.message });
    }
});


// in de aanwezigheid pagina opslagen
router.get("/stats", async (req, res) => {
    try {
        // Ttotaal aantal aanwezigheid
       const [totalResult] = await db.execute(
    "SELECT COUNT(*) as total FROM checkins WHERE status = 'checked_in'"
);

        // per type
       const [typeResult] = await db.execute(
    `SELECT type as participant_type, COUNT(*) as count 
     FROM checkins 
     WHERE status = 'checked_in' 
     GROUP BY type`
);

        // recente check-ins (10 laatste)
      const [recentResult] = await db.execute(
    `SELECT name as participant_name, email as participant_email, type as participant_type, created_at as check_in_time 
     FROM checkins 
     WHERE status = 'checked_in' 
     ORDER BY created_at DESC 
     LIMIT 10`
);

        // chek-ins per uur 
    const [hourlyResult] = await db.execute(
    `SELECT HOUR(created_at) as hour, COUNT(*) as count 
     FROM checkins 
     WHERE status = 'checked_in' AND DATE(created_at) = CURDATE() 
     GROUP BY HOUR(created_at) 
     ORDER BY hour`
);

        res.json({
            success: true,
            stats: {
                total: totalResult[0].total,
                byType: typeResult,
                recent: recentResult,
                hourly: hourlyResult
            }
        });

    } catch (error) {
        console.error("Statistiekfout:", error.message, error.stack);
        res.status(500).json({ error: "deelnemers statistiek gefaald" });
    }
});

// voor admin dashboard
router.get("/attendees", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

       const [attendees] = await db.execute(
    `SELECT id, name as participant_name, email as participant_email, type as participant_type, created_at as check_in_time 
     FROM checkins 
     WHERE status = 'checked_in' 
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset]
);

        const [countResult] = await db.execute(
    "SELECT COUNT(*) as total FROM checkins WHERE status = 'checked_in'"
);

        res.json({
            success: true,
            attendees: attendees,
            pagination: {
                page: page,
                limit: limit,
                total: countResult[0].total,
                totalPages: Math.ceil(countResult[0].total / limit)
            }
        });

    } catch (error) {
        console.error("Error bij het ophalen van deelnemers:", error);
        res.status(500).json({ error: "deelnemers-lijst opnamen mislukt" });
    }
});



module.exports = router;