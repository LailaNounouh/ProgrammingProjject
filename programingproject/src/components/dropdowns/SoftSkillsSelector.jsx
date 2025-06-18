import React, { useState } from "react";
import softSkillsData from "./softskills.json";
import "./DropDowns.css";

const niveaus = ["Beperkt", "Basis", "Sterk ontwikkeld", "Expert"];

export default function SoftSkillsSelector() {
  const [lijst, setLijst] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [niveau, setNiveau] = useState("");

  const allSoftSkills = [
    ...softSkillsData.persoonlijkeVaardigheden,
    ...softSkillsData.socialeVaardigheden
  ];

  const voegToe = () => {
    if (selectedSkill && niveau && !lijst.some(item => item.skill === selectedSkill)) {
      setLijst([...lijst, { skill: selectedSkill, niveau }]);
      setSelectedSkill("");
      setNiveau("");
    }
  };

  const verwijder = (skillNaam) => {
    setLijst(lijst.filter(item => item.skill !== skillNaam));
  };

  return (
    <div className="softskills-selector">
      <h3>Soft Skills</h3>
      <div className="inputs">
        <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
          <option value="">Kies soft skill</option>
          {allSoftSkills.map(([label, value], index) => (
            <option key={index} value={label}>
              {label}
            </option>
          ))}
        </select>

        <select value={niveau} onChange={(e) => setNiveau(e.target.value)}>
          <option value="">Kies niveau</option>
          {niveaus.map((n, i) => (
            <option key={i} value={n}>{n}</option>
          ))}
        </select>

        <button onClick={voegToe}>Toevoegen</button>
      </div>

      <ul>
        {lijst.map((item, i) => (
          <li key={i}>
            {item.skill} — {item.niveau}
            <button onClick={() => verwijder(item.skill)}>Verwijder</button>
          </li>
        ))}
      </ul>
    </div>
  );
}