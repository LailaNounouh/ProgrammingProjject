const db = require("../db");

async function getAlleBedrijven() {
  const sql = `
    SELECT 
      b.bedrijf_id, 
      b.naam, 
      b.straat, 
      b.nummer, 
      b.postcode, 
      b.gemeente, 
      b.logo_url,
      GROUP_CONCAT(s.naam SEPARATOR ', ') AS sectoren
    FROM Bedrijven b
    LEFT JOIN Bedrijf_Sector bs ON b.bedrijf_id = bs.bedrijf_id
    LEFT JOIN Sectoren s ON bs.sector_id = s.sector_id
    GROUP BY b.bedrijf_id, b.naam, b.straat, b.nummer, b.postcode, b.gemeente, b.logo_url
    ORDER BY b.naam;
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
