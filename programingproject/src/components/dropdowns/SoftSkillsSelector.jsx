import React, { useState, useEffect } from "react";
import softSkillsData from "./softskills.json";
import "./DropDowns.css";

export default function SoftSkillsSelector({ value, onChange, readOnly = false }) {
  const [selectedSkill, setSelectedSkill] = useState("");

  const allSoftSkills = [
    ...softSkillsData.persoonlijkeVaardigheden,
    ...softSkillsData.socialeVaardigheden
  ].map(([label]) => label);

  const voegToe = () => {
    if (selectedSkill && !value.includes(selectedSkill)) {
      onChange([...value, selectedSkill]);
      setSelectedSkill("");
    }
  };

  const verwijder = (skillNaam) => {
    onChange(value.filter(skill => skill !== skillNaam));
  };

  return (
    <div className="softskills-selector">
      <h3>Soft Skills</h3>
      {!readOnly && (
        <div className="inputs">
          <select value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}>
            <option value="">Kies soft skill</option>
            {allSoftSkills.map((label, index) => (
              <option key={index} value={label}>
                {label}
              </option>
            ))}
          </select>
          <button onClick={voegToe}>Toevoegen</button>
        </div>
      )}
      <ul>
        {value.map((skill, i) => (
          <li key={i}>
            {skill}
            {!readOnly && <button onClick={() => verwijder(skill)}>Verwijder</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}