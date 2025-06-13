import React from "react";
import "./ProfielModule.css";
import { useProfile } from "../../context/ProfileContext";

export default function ProfielModule() {
  const { profile } = useProfile();

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="account-pagina">
      <h1>{profile.naam}</h1>

      <div className="account-header">
        <img
          src={profile.foto || "/default-profile.png"}
          alt={`Profielfoto van ${profile.naam}`}
          className="account-foto"
        />
        {profile.aboutMe && (
          <p className="account-about">{profile.aboutMe}</p>
        )}
      </div>

      <div className="account-details">
        <p><strong>Email:</strong> {profile.email}</p>
        {profile.telefoon && <p><strong>Telefoon:</strong> {profile.telefoon}</p>}

        {profile.talen?.length > 0 && (
          <>
            <h3>Talenkennis</h3>
            <ul>
              {profile.talen.map((taal, index) => (
                <li key={index}>{taal}</li>
              ))}
            </ul>
          </>
        )}

        {profile.programmeertalen?.length > 0 && (
          <>
            <h3>Programmeertalen</h3>
            <ul>
              {profile.programmeertalen.map((code, index) => (
                <li key={index}>{code}</li>
              ))}
            </ul>
          </>
        )}

        {profile.softSkills?.length > 0 && (
          <>
            <h3>Soft Skills</h3>
            <ul>
              {profile.softSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </>
        )}

        {profile.hardSkills?.length > 0 && (
          <>
            <h3>Hard Skills</h3>
            <ul>
              {profile.hardSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
