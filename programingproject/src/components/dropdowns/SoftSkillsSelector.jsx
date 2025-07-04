import React, { useState, useEffect } from "react";
import softSkillsData from "./softskills.json";
import "./DropDowns.css";

const SoftSkillsSelector = ({ value = [], onChange, readOnly = false }) => {
  const [inputValue, setInputValue] = useState("");
  const [categorizedSkills, setCategorizedSkills] = useState({});
  
  useEffect(() => {
    // Verwerk de softskills data structuur
    const skillsByCategory = {};
    
    // Ga door alle categorieën in het JSON-bestand
    Object.keys(softSkillsData).forEach(category => {
      const skills = softSkillsData[category];
      skillsByCategory[category] = skills.map(skill => 
        typeof skill === 'string' ? skill : skill[0]
      );
    });
    
    setCategorizedSkills(skillsByCategory);
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

  // Helper functie om categorienamen te formatteren
  const formatCategoryName = (category) => {
    switch(category) {
      case 'persoonlijkeVaardigheden':
        return 'Persoonlijke Vaardigheden';
      case 'communicatieVaardigheden':
        return 'Communicatie Vaardigheden';
      case 'leiderschapsVaardigheden':
        return 'Leiderschaps Vaardigheden';
      case 'teamVaardigheden':
        return 'Team Vaardigheden';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="skills-selector">
      <h3>Soft Skills</h3>
      
      {!readOnly && (
        <div className="skills-input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Voeg een soft skill toe..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          />
          <button type="button" onClick={handleAddSkill}>Toevoegen</button>
        </div>
      )}
      
      {!readOnly && (
        <div className="skills-suggestions">
          <p>Suggesties per categorie:</p>
          {Object.keys(categorizedSkills).map(category => (
            <div key={category} className="skill-category">
              <h4>{formatCategoryName(category)}</h4>
              <div className="suggestions-list">
                {categorizedSkills[category].map((skill) => (
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
          <p className="no-skills">Geen soft skills geselecteerd</p>
        )}
      </div>
    </div>
  );
};

export default SoftSkillsSelector;
