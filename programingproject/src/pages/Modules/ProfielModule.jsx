import React from "react";
import "./ProfielModule.css";
import { useProfile } from "../../context/ProfileContext";

export default function ProfielModule() {
  const { profile, loading } = useProfile();

  if (loading) return <p>Profiel wordt geladen...</p>;
  if (!profile) return <p>Geen profiel gevonden.</p>;

  return (
    <div className="account-pagina">
      <h1>{profile.naam || "Naam onbekend"}</h1>

      <div className="account-header">
        <img
          src={profile.foto || "/default-profile.png"}
          alt={`Profielfoto van ${profile.naam}`}
          className="account-foto"
        />
        <p className="account-about">{profile.aboutMe || "Geen beschrijving."}</p>
      </div>

      <div className="account-details">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Telefoon:</strong> {profile.telefoon}</p>

        <h3>Talenkennis</h3>
        <ul>
          {(profile.talen || []).map((taal, i) => (
            <li key={i}>{taal.naam} — {taal.niveau}</li>
          ))}
        </ul>

        <h3>Programmeertalen</h3>
        <ul>
          {(profile.programmeertalen || []).map((code, i) => (
            <li key={i}>{code.taal} — {code.niveau}</li>
          ))}
        </ul>

        <h3>Soft Skills</h3>
        <ul>
          {(profile.softSkills || []).map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        <h3>Hard Skills</h3>
        <ul>
          {(profile.hardSkills || []).map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
