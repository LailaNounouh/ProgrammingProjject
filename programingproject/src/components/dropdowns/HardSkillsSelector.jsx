import React, { useState, useEffect } from "react";
import hardSkillsData from "./HardSkills.json";
import "./DropDowns.css";

const HardSkillsSelector = ({ value = [], onChange, readOnly = false }) => {
  const [inputValue, setInputValue] = useState("");
  const [hardSkillsOptions, setHardSkillsOptions] = useState([]);
  const [categorizedSkills, setCategorizedSkills] = useState({});
  
  useEffect(() => {
    // Groepeer vaardigheden per tag
    const skillsByTag = {};
    hardSkillsData.forEach(skill => {
      if (!skillsByTag[skill.tag]) {
        skillsByTag[skill.tag] = [];
      }
      skillsByTag[skill.tag].push(skill.vaardigheid);
    });
    
    setCategorizedSkills(skillsByTag);
    
    // Maak een platte lijst van alle vaardigheden
    const allSkills = hardSkillsData.map(skill => skill.vaardigheid);
    setHardSkillsOptions(allSkills);
  }, []);

  const handleAddSkill = () => {
    if (!inputValue.trim()) return;
    
    // Voeg toe als het nog niet bestaat
    if (!value.includes(inputValue)) {
      const newValue = [...value, inputValue];
      onChange(newValue);
    }
    setInputValue("");
  };

  const handleSelectSkill = (skill) => {
    if (!value.includes(skill)) {
      const newValue = [...value, skill];
      onChange(newValue);
    }
  };

  const handleRemoveSkill = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="skills-selector">
      <h3>Hard Skills</h3>
      
      {!readOnly && (
        <div className="skills-input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Voeg een hard skill toe..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          />
          <button type="button" onClick={handleAddSkill}>Toevoegen</button>
        </div>
      )}
      
      {!readOnly && (
        <div className="skills-suggestions">
          <p>Suggesties per categorie:</p>
          {Object.keys(categorizedSkills).map(tag => (
            <div key={tag} className="skill-category">
              <h4>{tag}</h4>
              <div className="suggestions-list">
                {categorizedSkills[tag].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className="suggestion-button"
                    onClick={() => handleSelectSkill(skill)}
                    disabled={value.includes(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="selected-skills">
        {value && value.length > 0 ? (
          <ul>
            {value.map((skill, index) => (
              <li key={index} className="skill-item">
                {skill}
                {!readOnly && (
                  <button 
                    type="button" 
                    className="remove-skill" 
                    onClick={() => handleRemoveSkill(index)}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-skills">Geen hard skills geselecteerd</p>
        )}
      </div>
    </div>
  );
};


export default HardSkillsSelector;
