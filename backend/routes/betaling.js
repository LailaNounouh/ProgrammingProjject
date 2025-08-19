const express = require('express');
const router = express.Router();
const pool = require('../db'); // mysql2/promise pool

// Helper: format date -> ISO string or null
const toIso = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

// POST /api/betaling
// Maak een nieuwe betaling aan
router.post('/', async (req, res) => {
  const {
    bedrijf_id,
    bedrag,
    methode,
    status,
    factuur_pdf,
    factuur_naam,
    datum,
    factuur_verzonden_datum,
    in_behandeling_datum,
    ontvangen_datum,
    verwerkt_datum
  } = req.body;

  if (!bedrijf_id || bedrag == null || !methode || !status || !factuur_naam) {
    return res.status(400).json({ message: 'Verplichte velden ontbreken: bedrijf_id, bedrag, methode, status, factuur_naam' });
  }

  try {
    const sql = `INSERT INTO betalingen
      (bedrijf_id, bedrag, methode, status, factuur_pdf, factuur_naam, datum,
       factuur_verzonden_datum, in_behandeling_datum, ontvangen_datum, verwerkt_datum, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    const params = [
      Number(bedrijf_id),
      Number(bedrag),
      methode,
      status,
      factuur_pdf || null,
      factuur_naam,
      datum || null,
      factuur_verzonden_datum || null,
      in_behandeling_datum || null,
      ontvangen_datum || null,
      verwerkt_datum || null
    ];

    const [result] = await pool.query(sql, params);
    return res.status(201).json({ message: 'Betaling toegevoegd', insertId: result.insertId });
  } catch (err) {
    console.error('Fout bij toevoegen betaling:', err);
    return res.status(500).json({ message: 'Fout bij toevoegen betaling.' });
  }
});

// GET /api/betaling/:bedrijf_id
// Haal laatste betaling en samenvatting voor een bedrijf
router.get('/:bedrijf_id', async (req, res) => {
  const { bedrijf_id } = req.params;

  try {
    // meest recente betaling (voorkeur: datum, anders created_at of factuur_verzonden_datum)
    const [latestRows] = await pool.query(
      `SELECT *
       FROM betalingen
       WHERE bedrijf_id = ?
       ORDER BY COALESCE(datum, created_at, factuur_verzonden_datum) DESC
       LIMIT 1`,
      [bedrijf_id]
    );

    if (!latestRows || latestRows.length === 0) {
      return res.status(404).json({ message: 'Geen betaling gevonden.' });
    }

    const betaling = latestRows[0];

    // totals over alle betalingen van dit bedrijf
    const [allPayments] = await pool.query(
      'SELECT bedrag, status FROM betalingen WHERE bedrijf_id = ?',
      [bedrijf_id]
    );

    const alle_betalingen_totaal = allPayments.reduce((s, p) => s + Number(p.bedrag || 0), 0);

    const paidStatuses = ['verwerkt', 'ontvangen', 'betaald'];
    const betaald_bedrag = allPayments.reduce((s, p) =>
      s + (paidStatuses.includes(String(p.status).toLowerCase()) ? Number(p.bedrag || 0) : 0)
    , 0);

    const totaal_bedrag = Number(betaling.bedrag || 0);
    const openstaand_bedrag = Math.max(0, totaal_bedrag - betaald_bedrag);

    // bouw statusen array gebaseerd op datumvelden
    const statusen = [
      { name: 'factuur_verzonden', completed: !!betaling.factuur_verzonden_datum, date: toIso(betaling.factuur_verzonden_datum) },
      { name: 'in_behandeling', completed: !!betaling.in_behandeling_datum, date: toIso(betaling.in_behandeling_datum) },
      { name: 'ontvangen', completed: !!betaling.ontvangen_datum, date: toIso(betaling.ontvangen_datum) },
      { name: 'verwerkt', completed: !!betaling.verwerkt_datum, date: toIso(betaling.verwerkt_datum) }
    ];

    const response = {
      betaling_id: betaling.betaling_id || null,
      bedrag: Number(betaling.bedrag || 0),
      methode: betaling.methode || null,
      status: betaling.status || null,
      factuur_naam: betaling.factuur_naam || null,
      factuur_url: betaling.factuur_naam ? `/uploads/${betaling.factuur_naam}` : null,
      datum: toIso(betaling.datum || betaling.created_at || null),
      statusen,
      betaald_bedrag: Number(betaald_bedrag),
      totaal_bedrag: Number(totaal_bedrag),
      openstaand_bedrag: Number(openstaand_bedrag),
      alle_betalingen_totaal: Number(alle_betalingen_totaal)
    };

    return res.json(response);
  } catch (err) {
    console.error('Fout bij ophalen betaling:', err);
    return res.status(500).json({ message: 'Fout bij ophalen betaling.' });
  }
});

// GET /api/betaling/list/:bedrijf_id
// (optioneel) Haal alle betalingen voor het bedrijf - handig voor admin/overzicht
router.get('/list/:bedrijf_id', async (req, res) => {
  const { bedrijf_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT betaling_id, bedrijf_id, bedrag, methode, status, factuur_naam, datum, created_at,
              factuur_verzonden_datum, in_behandeling_datum, ontvangen_datum, verwerkt_datum
       FROM betalingen
       WHERE bedrijf_id = ?
       ORDER BY COALESCE(datum, created_at) DESC`,
      [bedrijf_id]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Fout bij ophalen betalingenlijst:', err);
    return res.status(500).json({ message: 'Fout bij ophalen betalingenlijst.' });
  }
});

// PUT /api/betaling/:betaling_id
// Update velden van een betaling (status/datum/bedrag/methode/factuur_naam)
router.put('/:betaling_id', async (req, res) => {
  const { betaling_id } = req.params;
  const updateFields = req.body || {};

  const allowed = new Set([
    'status', 'factuur_verzonden_datum', 'in_behandeling_datum',
    'ontvangen_datum', 'verwerkt_datum', 'methode', 'factuur_naam', 'factuur_pdf', 'bedrag', 'datum'
  ]);

  const sets = [];
  const params = [];

  for (const [k, v] of Object.entries(updateFields)) {
    if (!allowed.has(k)) continue;
    sets.push(`${k} = ?`);
    params.push(v);
  }

  if (sets.length === 0) {
    return res.status(400).json({ message: 'Geen geldige velden om te updaten.' });
  }

  params.push(betaling_id);

  try {
    const sql = `UPDATE betalingen SET ${sets.join(', ')} WHERE betaling_id = ?`;
    const [result] = await pool.query(sql, params);
    return res.json({ message: 'Betaling bijgewerkt', affectedRows: result.affectedRows });
  } catch (err) {
    console.error('Fout bij updaten betaling:', err);
    return res.status(500).json({ message: 'Fout bij updaten betaling.' });
  }
});

module.exports = router;
