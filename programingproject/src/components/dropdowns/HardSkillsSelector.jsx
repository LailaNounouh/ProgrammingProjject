import React, { useState } from "react";
import hardSkills from "./HardSkills.json";
import "./DropDowns.css";

const niveaus = ["Beginner", "Gevorderd", "Expert"];

export default function HardSkillsSelector() {
  const [lijst, setLijst] = useState([]);
  const [skill, setSkill] = useState("");
  const [niveau, setNiveau] = useState("");

  const voegToe = () => {
    if (skill && niveau && !lijst.some(item => item.skill === skill)) {
      setLijst([...lijst, { skill, niveau }]);
      setSkill("");
      setNiveau("");
    }
  };

  const verwijder = (skillNaam) => {
    setLijst(lijst.filter(item => item.skill !== skillNaam));
  };

  return (
    <div className="codeertaal-selector">
      <h3>Hard Skills</h3>
      <div className="inputs">
        <select value={skill} onChange={(e) => setSkill(e.target.value)}>
          <option value="">Kies een skill</option>
          {hardSkills.map((s, index) => (
            <option key={index} value={s.vaardigheid}>
              {s.vaardigheid} ({s.tag})
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
        {lijst.map((item, index) => (
          <li key={index}>
            {item.skill} — {item.niveau}
            <button onClick={() => verwijder(item.skill)}>Verwijder</button>
          </li>
        ))}
      </ul>
    </div>
  );
}