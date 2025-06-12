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
        <p className="account-about">{profile.aboutMe}</p>
      </div>

      <div className="account-details">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Telefoon:</strong> {profile.telefoon}</p>

        <h3>Talenkennis</h3>
        <ul>{(profile.talen || []).map((taal) => <li key={taal}>{taal}</li>)}</ul>

        <h3>Programmeertalen</h3>
        <ul>{(profile.programmeertalen || []).map((code) => <li key={code}>{code}</li>)}</ul>

        <h3>Soft Skills</h3>
        <ul>{(profile.softSkills || []).map((skill) => <li key={skill}>{skill}</li>)}</ul>

        <h3>Hard Skills</h3>
        <ul>{(profile.hardSkills || []).map((skill) => <li key={skill}>{skill}</li>)}</ul>
      </div>
    </div>
  );
}
