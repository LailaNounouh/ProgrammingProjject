// src/modules/profiel/ProfielModule.jsx
import React from "react";
import "./ProfielModule.css";
import { useProfile } from "../../context/ProfileContext";
import { baseUrl } from "../../config";

export default function ProfielModule() {
  const { profile, loading, error } = useProfile();

  if (loading) return <p>Profiel wordt geladen...</p>;
  if (error) return <p style={{ color: "red" }}>Fout: {error}</p>;
  if (!profile) return <p>Geen profiel beschikbaar. Log in om je gegevens te zien.</p>;

  const {
    naam,
    email,
    telefoon,
    aboutMe,
    foto,
    talen = [],
    programmeertalen = [],
    softSkills = [],
    hardSkills = [],
  } = profile;

  return (
    <div className="account-pagina">
      <h1>{naam || "Naam niet ingevuld"}</h1>

      <div className="account-header">
        <img
          src={foto ? `${baseUrl}/${foto}` : "/default-profile.png"}
          alt={`Profielfoto van ${naam}`}
          className="account-foto"
        />
        <p className="account-about">{aboutMe || "Geen beschrijving beschikbaar."}</p>
      </div>

      <div className="account-details">
        <p><strong>Email:</strong> {email || "Niet ingevuld"}</p>
        <p><strong>Telefoon:</strong> {telefoon || "Niet ingevuld"}</p>

        <h3>Talenkennis</h3>
        <ul>
          {talen.length > 0 ? talen.map((taal, i) => <li key={i}>{taal}</li>) : <li>Geen talen opgegeven</li>}
        </ul>

        <h3>Programmeertalen</h3>
        <ul>
          {programmeertalen.length > 0 ? programmeertalen.map((code, i) => <li key={i}>{code}</li>) : <li>Geen programmeertalen opgegeven</li>}
        </ul>

        <h3>Soft Skills</h3>
        <ul>
          {softSkills.length > 0 ? softSkills.map((s, i) => <li key={i}>{s}</li>) : <li>Geen soft skills opgegeven</li>}
        </ul>

        <h3>Hard Skills</h3>
        <ul>
          {hardSkills.length > 0 ? hardSkills.map((s, i) => <li key={i}>{s}</li>) : <li>Geen hard skills opgegeven</li>}
        </ul>
      </div>
    </div>
  );
}
