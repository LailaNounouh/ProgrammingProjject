const express = require("express");
const router = express.Router();
const db = require("../db");
const crypto = require("crypto"); 

// zorgt voor de deelnemer check-in
router.post("/check-in", async (req, res) => {
    try {
        const { name, email, type } = req.body;

        // valideren van de gevraagde velden
        if (!name || !email || !type) {
            return res.status(400).json({ 
                error: "Ontbrekende vereiste velden: naam, e-mail, type" 
            });
        }

        // valideren van deelnemer type
        const validTypes = ["student", "werkzoekende", "visitor"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                error: "Ongeldig deelnemerstype. Moet zijn: student, werkzoekende of bezoeker" 
            });
        }

        // na kijken if de deelnemer al aanwezig is 
        const [existingAttendance] = await db.execute(
            "SELECT attendance_id FROM event_attendance WHERE participant_email = ?",
            [email]
        );

        if (existingAttendance.length > 0) {
            return res.status(400).json({ 
                error: "Deelnemer al ingecheckt",
                alreadyCheckedIn: true 
            });
        }

        // maken van een unieke id voor de deelnemer
        const participantId = crypto.randomBytes(16).toString("hex");

        // gegevens opslagen
        await db.execute(
            `INSERT INTO event_attendance 
             (participant_id, participant_name, participant_email, participant_type, is_checked_in) 
             VALUES (?, ?, ?, ?, true)`,
            [participantId, name, email, type]
        );

        res.json({
            success: true,
            message: "Successfully checked in to Career Launch Event",
            participantId: participantId,
            checkInTime: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error tijdens check-in", error);
        res.status(500).json({ error: "Check-in gefaald" });
    }
});

// in de aanwezigheid pagina opslagen
router.get("/stats", async (req, res) => {
    try {
        // Ttotaal aantal aanwezigheid
        const [totalResult] = await db.execute(
            "SELECT COUNT(*) as total FROM event_attendance WHERE is_checked_in = true"
        );

        // per type
        const [typeResult] = await db.execute(
            `SELECT participant_type, COUNT(*) as count 
             FROM event_attendance 
             WHERE is_checked_in = true 
             GROUP BY participant_type`
        );

        // recente check-ins (10 laatste)
        const [recentResult] = await db.execute(
            `SELECT participant_name, participant_email, participant_type, check_in_time 
             FROM event_attendance 
             WHERE is_checked_in = true 
             ORDER BY check_in_time DESC 
             LIMIT 10`
        );

        // chek-ins per uur 
        const [hourlyResult] = await db.execute(
            `SELECT HOUR(check_in_time) as hour, COUNT(*) as count 
             FROM event_attendance 
             WHERE is_checked_in = true 
             AND DATE(check_in_time) = CURDATE() 
             GROUP BY HOUR(check_in_time) 
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
            `SELECT attendance_id, participant_name, participant_email, participant_type, check_in_time 
             FROM event_attendance 
             WHERE is_checked_in = true 
             ORDER BY check_in_time DESC 
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        const [countResult] = await db.execute(
            "SELECT COUNT(*) as total FROM event_attendance WHERE is_checked_in = true"
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
