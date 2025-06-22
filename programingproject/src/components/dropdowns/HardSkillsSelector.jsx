import React, { useState } from "react";
import hardSkillsData from "./hardskills.json";
import "./DropDowns.css";

export default function HardSkillsSelector({ value, onChange, readOnly = false }) {
  const [selectedSkill, setSelectedSkill] = useState("");

  const allHardSkills = (hardSkillsData || []).map(obj => obj.vaardigheid);

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
    <div className="hardskills-selector">
      <h3>Hard Skills</h3>
      {!readOnly && (
        <div className="inputs">
          <select value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}>
            <option value="">Kies hard skill</option>
            {allHardSkills.map((vaardigheid, index) => (
              <option key={index} value={vaardigheid}>
                {vaardigheid}
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