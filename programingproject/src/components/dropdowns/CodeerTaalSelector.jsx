import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import codeertaalData from './codeertalen.json';
import './DropDowns.css';

const animatedComponents = makeAnimated();

// Opties voor ervaringsniveaus
const ervaringsOpties = [
  { value: 'expert', label: 'Expert' },
  { value: 'gevorderd', label: 'Gevorderd' },
  { value: 'gemiddeld', label: 'Gemiddeld' },
  { value: 'beginner', label: 'Beginner' }
];

const CodeerTaalSelector = ({ value = [], onChange, readOnly = false }) => {
  const [codeertaalOpties, setCodeertaalOpties] = useState([]);
  const [selectedTalen, setSelectedTalen] = useState([]);
  
  useEffect(() => {
    // Converteer de codeertalen uit het JSON-bestand naar het juiste formaat voor react-select
    const opties = codeertaalData.map(taal => ({
      value: taal.name,
      label: taal.name,
      tag: taal.tag
    }));
    setCodeertaalOpties(opties);
  }, []);

  // Initialiseer geselecteerde codeertalen
  useEffect(() => {
    if (Array.isArray(value)) {
      const formattedTalen = value.map(item => {
        if (typeof item === 'object' && item.taal && item.ervaring) {
          return {
            taal: item.taal,
            ervaring: item.ervaring
          };
        } else if (typeof item === 'string') {
          return {
            taal: item,
            ervaring: 'beginner' // Standaard niveau
          };
        }
        return null;
      }).filter(Boolean);
      
      setSelectedTalen(formattedTalen);
    } else {
      setSelectedTalen([]);
    }
  }, [value]);

  const handleTaalChange = (selected, index) => {
    const updatedTalen = [...selectedTalen];
    updatedTalen[index] = {
      ...updatedTalen[index],
      taal: selected.value
    };
    setSelectedTalen(updatedTalen);
    updateParent(updatedTalen);
  };

  const handleErvaringChange = (selected, index) => {
    const updatedTalen = [...selectedTalen];
    updatedTalen[index] = {
      ...updatedTalen[index],
      ervaring: selected.value
    };
    setSelectedTalen(updatedTalen);
    updateParent(updatedTalen);
  };

  const addTaal = () => {
    setSelectedTalen([...selectedTalen, { taal: '', ervaring: 'beginner' }]);
  };

  const removeTaal = (index) => {
    const updatedTalen = selectedTalen.filter((_, i) => i !== index);
    setSelectedTalen(updatedTalen);
    updateParent(updatedTalen);
  };

  const updateParent = (talen) => {
    if (onChange) {
      // Filter lege talen
      const filteredTalen = talen.filter(item => item.taal);
      onChange(filteredTalen);
    }
  };

  return (
    <div className="skill-selector-container">
      <h3>Programmeertalen</h3>
      <p className="skill-description">
        Selecteer de programmeertalen die je beheerst en je ervaringsniveau
      </p>
      
      {selectedTalen.map((item, index) => (
        <div key={index} className="taal-item">
          <div className="taal-row">
            <div className="taal-select">
              <label>Programmeertaal</label>
              <Select
                options={codeertaalOpties}
                value={codeertaalOpties.find(option => option.value === item.taal) || null}
                onChange={(selected) => handleTaalChange(selected, index)}
                isDisabled={readOnly}
                placeholder="Selecteer een programmeertaal..."
                className="select-container"
                classNamePrefix="select"
              />
            </div>
            
            <div className="niveau-select">
              <label>Ervaring</label>
              <Select
                options={ervaringsOpties}
                value={ervaringsOpties.find(option => option.value === item.ervaring) || null}
                onChange={(selected) => handleErvaringChange(selected, index)}
                isDisabled={readOnly}
                placeholder="Selecteer ervaringsniveau..."
                className="select-container"
                classNamePrefix="select"
              />
            </div>
            
            {!readOnly && (
              <button 
                type="button" 
                className="remove-button"
                onClick={() => removeTaal(index)}
              >
                ×
              </button>
            )}
          </div>
        </div>
      ))}
      
      {!readOnly && (
        <button 
          type="button" 
          className="add-button"
          onClick={addTaal}
        >
          + Programmeertaal toevoegen
        </button>
      )}
      
      {selectedTalen.length > 0 && (
        <div className="selected-skills">
          <h4>Geselecteerde programmeertalen:</h4>
          <ul className="skills-list">
            {selectedTalen.filter(item => item.taal).map((item, index) => (
              <li key={index} className="skill-tag">
                {item.taal} 
                <span 
                  className="skill-level" 
                  data-level={item.ervaring}
                >
                  {item.ervaring}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodeerTaalSelector;
