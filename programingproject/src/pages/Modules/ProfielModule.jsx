import React from "react";
import "./ProfielModule.css";
import { useProfile } from "../../context/ProfileContext";
import { baseUrl } from "../../config";

export default function ProfielModule() {
  const { profile } = useProfile();

  if (!profile) return <p>Profiel wordt geladen...</p>;

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
          {talen.length > 0 ? (
            talen.map((taal, index) => <li key={`taal-${index}`}>{taal}</li>)
          ) : (
            <li>Geen talen opgegeven</li>
          )}
        </ul>

        <h3>Programmeertalen</h3>
        <ul>
          {programmeertalen.length > 0 ? (
            programmeertalen.map((code, index) => <li key={`code-${index}`}>{code}</li>)
          ) : (
            <li>Geen programmeertalen opgegeven</li>
          )}
        </ul>

        <h3>Soft Skills</h3>
        <ul>
          {softSkills.length > 0 ? (
            softSkills.map((skill, index) => <li key={`soft-${index}`}>{skill}</li>)
          ) : (
            <li>Geen soft skills opgegeven</li>
          )}
        </ul>

        <h3>Hard Skills</h3>
        <ul>
          {hardSkills.length > 0 ? (
            hardSkills.map((skill, index) => <li key={`hard-${index}`}>{skill}</li>)
          ) : (
            <li>Geen hard skills opgegeven</li>
          )}
        </ul>
      </div>
    </div>
  );
}
