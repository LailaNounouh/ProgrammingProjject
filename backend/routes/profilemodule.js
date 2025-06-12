const pool = require("../db");


async function getProfielVanGebruiker(email) {
  const [rows] = await pool.query("SELECT * FROM Studenten WHERE email = ?", [email]);


  if (rows.length === 0) throw new Error("Gebruiker niet gevonden");


  const gebruiker = rows[0];


  const [talen] = await pool.query("SELECT naam, niveau FROM GebruikerTalen WHERE student_id = ?", [gebruiker.id]);
  const [codeertalen] = await pool.query("SELECT naam, niveau FROM GebruikerCodeertalen WHERE student_id = ?", [gebruiker.id]);
  const [softSkills] = await pool.query("SELECT naam FROM GebruikerSoftSkills WHERE student_id = ?", [gebruiker.id]);
  const [hardSkills] = await pool.query("SELECT naam FROM GebruikerHardSkills WHERE student_id = ?", [gebruiker.id]);


  return {
    id: gebruiker.id,
    naam: gebruiker.naam,
    email: gebruiker.email,
    telefoon: gebruiker.telefoon,
    aboutMe: gebruiker.aboutMe || "",
    foto: gebruiker.foto || null,
    talen,
    programmeertalen: codeertalen,
    softSkills: softSkills.map(s => s.naam),
    hardSkills: hardSkills.map(s => s.naam),
  };
}


module.exports = {
  getProfielVanGebruiker,
};



