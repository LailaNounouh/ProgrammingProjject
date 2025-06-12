import React, { useEffect, useState } from "react";
import "./ProfielModule.css";
import { useAuth } from "../../context/AuthContxt.jsx";

export default function ProfielModule() {
  const { user } = useAuth(); 
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Simuleer fetch naar profielgegevens
    const fetchData = async () => {
      setProfile({
        naam: user?.naam || "Jan Jansen",
        email: user?.email || "jan@example.com",
        telefoon: "0499 99 99 99",
        about: "Gepassioneerde developer met een liefde voor backend en AI.",
        foto: "/default-profile.png", 
        talen: ["Nederlands", "Engels"],
        programmeertalen: ["JavaScript", "Python", "C#"],
        softSkills: ["Teamwork", "Communicatie"],
        hardSkills: ["Git", "SQL", "Docker"],
      });
    };

    fetchData();
  }, [user]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="account-pagina">
      <h1>{profile.naam}</h1>

      <div className="account-header">
        <img
          src={profile.foto}
          alt={`Profielfoto van ${profile.naam}`}
          className="account-foto"
        />
        <p className="account-about">{profile.about}</p>
      </div>

      <div className="account-details">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Telefoon:</strong> {profile.telefoon}</p>

        <h3>Talenkennis</h3>
        <ul>{profile.talen.map((taal) => <li key={taal}>{taal}</li>)}</ul>

        <h3>Programmeertalen</h3>
        <ul>{profile.programmeertalen.map((code) => <li key={code}>{code}</li>)}</ul>

        <h3>Soft Skills</h3>
        <ul>{profile.softSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>

        <h3>Hard Skills</h3>
        <ul>{profile.hardSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
      </div>
    </div>
  );
}
