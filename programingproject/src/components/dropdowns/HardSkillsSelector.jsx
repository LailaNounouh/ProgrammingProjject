import React, { useState, useEffect } from "react";
import hardSkillsData from "./HardSkills.json";
import "./DropDowns.css";

const HardSkillsSelector = ({ value = [], onChange, readOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  return (
    <div className="skills-selector">
      <label htmlFor="hardskills">Hard Skills</label>
      
      {!readOnly && (
        <div className="skills-dropdown-container">
          <button
            type="button"
            className="skills-dropdown-trigger"
            onClick={() => setIsOpen(!isOpen)}
          >
            Selecteer hard skills
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
                    {category}
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
              <span key={index} className="skill-tag">
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
          <p className="no-skills">Geen hard skills geselecteerd</p>
        )}
      </div>
    </div>
  );
};

export default HardSkillsSelector;
