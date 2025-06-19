const express = require('express');
const router = express.Router();
const db = require('../db');

//haal alle sectoren op
router.get('/', async (req, res) => {
  try {
    const [sectoren] = await db.query('SELECT * FROM Sectoren');
    res.json(sectoren);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fout bij ophalen sectoren' });
  }
});

//voeg een nieuwe sector toe
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

    res.status(201).json({ id: result.insertId, naam, zichtbaar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fout bij toevoegen sector' });
  }
});

//verwijder een sector
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM Sectoren WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fout bij verwijderen sector' });
  }
});

//wijzig zichtbaar status
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { zichtbaar } = req.body;

  if (typeof zichtbaar !== 'boolean') {
    return res.status(400).json({ error: 'Zichtbaar moet true of false zijn' });
  }

  try {
    await db.query('UPDATE Sectoren SET zichtbaar = ? WHERE id = ?', [zichtbaar ? 1 : 0, id]);
    res.status(200).json({ id, zichtbaar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fout bij aanpassen zichtbaarheid' });
  }
});

module.exports = router;
