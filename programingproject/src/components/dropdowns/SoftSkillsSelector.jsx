import React, { useState, useEffect } from "react";
import softSkillsData from "./softskills.json";
import "./DropDowns.css";

const SoftSkillsSelector = ({ value = [], onChange, readOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const handleSelectSkill = (skill) => {
    if (!value.includes(skill)) {
      const newValue = [...value, skill];
      onChange(newValue);
    }
    setIsOpen(false);
    setSelectedCategory(null);
  };

  const handleRemoveSkill = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
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
      <label htmlFor="softskills">Soft Skills</label>
      
      {!readOnly && (
        <div className="skills-dropdown-container">
          <button
            type="button"
            className="skills-dropdown-trigger"
            onClick={() => setIsOpen(!isOpen)}
          >
            Selecteer soft skills
            <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {isOpen && (
            <div className="skills-dropdown-menu">
              {Object.keys(categorizedSkills).map(category => (
                <div key={category} className="skill-category-dropdown">
                  <button
                    type="button"
                    className="category-header"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {formatCategoryName(category)}
                    <span className={`category-arrow ${selectedCategory === category ? 'open' : ''}`}>▶</span>
                  </button>
                  
                  {selectedCategory === category && (
                    <div className="category-skills">
                      {categorizedSkills[category].map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          className={`skill-option ${value.includes(skill) ? 'selected' : ''}`}
                          onClick={() => handleSelectSkill(skill)}
                          disabled={value.includes(skill)}
                        >
                          {skill}
                          {value.includes(skill) && <span className="checkmark">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="selected-skills">
        {value && value.length > 0 ? (
          <div className="skills-tags">
            {value.map((skill, index) => (
              <span key={index} className="skill-tag soft-skill-tag">
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
              </span>
            ))}
          </div>
        ) : (
          <p className="no-skills">Geen soft skills geselecteerd</p>
        )}
      </div>
    </div>
  );
};

export default SoftSkillsSelector;
