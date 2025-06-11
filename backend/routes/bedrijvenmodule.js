// modules/bedrijfsmodule.js
const db = require("../db");

async function getAlleBedrijven() {
  const sql = `
    SELECT 
      id, 
      bedrijfsnaam, 
      straat, 
      nummer, 
      postcode, 
      gemeente, 
      beschrijving, 
      logo_url,
      sector_naam
    FROM bedrijven
  `;

  try {
    const [rows] = await db.query(sql);
    return rows;
  } catch (err) {
    console.error("Fout bij ophalen bedrijven uit database:", err);
    throw err;
  }
}

module.exports = {
  getAlleBedrijven,
};
