const express = require('express');
const router = express.Router();
const db = require('../db');

// Haal alle sectoren op
router.get('/', async (req, res) => {
  try {
    const [sectoren] = await db.query('SELECT * FROM Sectoren');
    res.json(sectoren);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fout bij ophalen sectoren' });
  }
});

// Voeg een nieuwe sector toe
router.post('/', async (req, res) => {
  const { naam, zichtbaar } = req.body;

  if (!naam) {
    return res.status(400).json({ error: 'Naam is verplicht' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Sectoren (naam, zichtbaar) VALUES (?, ?)',
      [naam, zichtbaar ? 1 : 0]
    );

    res.status(201).json({
      sector_id: result.insertId,
      naam,
      zichtbaar
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fout bij toevoegen sector' });
  }
});

// Verwijder een sector
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if sector is referenced by companies
    const [references] = await db.query(
      'SELECT COUNT(*) as count FROM Bedrijf_Sector WHERE sector_id = ?',
      [id]
    );

    if (references[0].count > 0) {
      return res.status(400).json({
        error: `Kan sector niet verwijderen: ${references[0].count} bedrijf(ven) gebruiken deze sector nog. Verwijder eerst de bedrijven of wijzig hun sector.`
      });
    }

    const [result] = await db.query('DELETE FROM Sectoren WHERE sector_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sector niet gevonden' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).json({
        error: 'Kan sector niet verwijderen: er zijn nog bedrijven gekoppeld aan deze sector. Verwijder eerst de bedrijven of wijzig hun sector.'
      });
    } else {
      res.status(500).json({ error: 'Fout bij verwijderen sector' });
    }
  }
});

// Wijzig zichtbaar-status
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { zichtbaar } = req.body;

  if (typeof zichtbaar !== 'boolean') {
    return res.status(400).json({ error: 'Zichtbaar moet true of false zijn' });
  }

  try {
    const [result] = await db.query(
      'UPDATE Sectoren SET zichtbaar = ? WHERE sector_id = ?',
      [zichtbaar ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sector niet gevonden' });
    }

    res.status(200).json({ sector_id: id, zichtbaar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fout bij aanpassen zichtbaarheid' });
  }
});

module.exports = router;
