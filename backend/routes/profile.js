const express = require("express");
const router = express.Router();
const { getProfielVanGebruiker } = require("../modules/profielmodule");


router.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "Email is vereist" });


    const profiel = await getProfielVanGebruiker(email);
    res.json(profiel);
  } catch (err) {
    console.error("Fout bij ophalen profiel:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});


module.exports = router;



