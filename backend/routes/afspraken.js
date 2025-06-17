const express = require('express');
const router = express.Router();
const pool = require("../db");

// GET /api/afspraken/beschikbaar/:bedrijfId
router.get('/beschikbaar/:bedrijfId', async (req, res) => {
    const { bedrijfId } = req.params;
    const datum = req.query.datum || '2025-06-17';

    console.log('Ophalen tijdsloten voor bedrijf:', bedrijfId, 'datum:', datum);

    try {
        // Haal eerst het bedrijf op om te controleren of het bestaat
        const [bedrijven] = await pool.query(
            'SELECT * FROM Bedrijven WHERE bedrijf_id = ?',
            [bedrijfId]
        );

        if (bedrijven.length === 0) {
            return res.status(404).json({
                error: 'Bedrijf niet gevonden',
                bedrijf_id: bedrijfId
            });
        }

        const bedrijf = bedrijven[0];

        // Haal de afspraken op voor deze datum
        const [afspraken] = await pool.query(
            `SELECT tijdslot FROM Afspraken 
             WHERE bedrijf_id = ? AND datum = ?`,
            [bedrijfId, datum]
        );

        // Bepaal beschikbare en bezette tijdsloten
        let alleTijdsloten = [];
        if (bedrijf.beschikbare_tijdsloten) {
            try {
                alleTijdsloten = JSON.parse(bedrijf.beschikbare_tijdsloten);
            } catch (e) {
                console.error('Error parsing tijdsloten:', e);
                alleTijdsloten = [
                    "13:30", "13:45", "14:00", "14:15", "14:30", "14:45",
                    "15:00", "15:15", "15:30", "15:45", "16:00", "16:15"
                ];
            }
        } else {
            alleTijdsloten = [
                "13:30", "13:45", "14:00", "14:15", "14:30", "14:45",
                "15:00", "15:15", "15:30", "15:45", "16:00", "16:15"
            ];
        }

        const bezetteTijdsloten = afspraken.map(a => a.tijdslot);
        const beschikbareTijdsloten = alleTijdsloten.filter(
            tijd => !bezetteTijdsloten.includes(tijd)
        );

        res.json({
            beschikbaar: beschikbareTijdsloten,
            bezet: bezetteTijdsloten,
            alle: alleTijdsloten
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            error: 'Fout bij ophalen tijdsloten',
            message: err.message
        });
    }
});

// POST /api/afspraken/nieuw
router.post('/nieuw', async (req, res) => {
    const { student_id, bedrijf_id, tijdslot, datum } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO Afspraken (student_id, bedrijf_id, tijdslot, datum) 
             VALUES (?, ?, ?, ?)`,
            [student_id, bedrijf_id, tijdslot, datum]
        );

        res.status(201).json({
            message: 'Afspraak succesvol aangemaakt',
            afspraak_id: result.insertId
        });
    } catch (err) {
        console.error('Fout bij maken afspraak:', err);
        res.status(500).json({
            error: 'Fout bij maken afspraak',
            message: err.message
        });
    }
});

module.exports = router;