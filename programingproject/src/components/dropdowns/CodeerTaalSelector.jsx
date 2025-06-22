import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import codeertaalData from './codeertalen.json';
import './DropDowns.css';

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
  
  // Laad codeertaalopties bij initialisatie
  useEffect(() => {
    const opties = codeertaalData.map(taal => ({
      value: taal.name,
      label: taal.name,
      tag: taal.tag
    }));
    setCodeertaalOpties(opties);
  }, []);

  // Verwerk de ontvangen waarden
  useEffect(() => {
    console.log("CodeerTaalSelector - ontvangen value:", value);
    
    if (Array.isArray(value)) {
      const formattedTalen = value.map(item => {
        if (typeof item === 'object') {
          return {
            taal: item.name || item.taal || '',
            ervaring: item.ervaring || 'beginner'
          };
        } else if (typeof item === 'string') {
          return {
            taal: item,
            ervaring: 'beginner'
          };
        }
        return null;
      }).filter(Boolean);
      
      console.log("CodeerTaalSelector - geformatteerde talen:", formattedTalen);
      setSelectedTalen(formattedTalen);
    } else {
      console.log("CodeerTaalSelector - geen array ontvangen, leeg array gebruikt");
      setSelectedTalen([]);
    }
  }, [value]);

  const handleTaalChange = (selected, index) => {
    console.log("CodeerTaalSelector - taal gewijzigd:", selected, "op index:", index);
    const updatedTalen = [...selectedTalen];
    updatedTalen[index] = {
      ...updatedTalen[index],
      taal: selected.value
    };
    setSelectedTalen(updatedTalen);
    updateParent(updatedTalen);
  };

  const handleErvaringChange = (selected, index) => {
    console.log("CodeerTaalSelector - ervaring gewijzigd:", selected, "op index:", index);
    const updatedTalen = [...selectedTalen];
    updatedTalen[index] = {
      ...updatedTalen[index],
      ervaring: selected.value
    };
    setSelectedTalen(updatedTalen);
    updateParent(updatedTalen);
  };

  const addTaal = () => {
    console.log("CodeerTaalSelector - taal toegevoegd");
    const updatedTalen = [...selectedTalen, { taal: '', ervaring: 'beginner' }];
    setSelectedTalen(updatedTalen);
    // Niet direct updateParent aanroepen omdat de nieuwe taal nog leeg is
  };

  const removeTaal = (index) => {
    console.log("CodeerTaalSelector - taal verwijderd op index:", index);
    const updatedTalen = selectedTalen.filter((_, i) => i !== index);
    setSelectedTalen(updatedTalen);
    updateParent(updatedTalen);
  };

  const updateParent = (talen) => {
    if (onChange) {
      // Filter lege talen
      const filteredTalen = talen.filter(item => item.taal);
      
      // Converteer naar het formaat dat de backend verwacht
      const formattedTalen = filteredTalen.map(item => ({
        name: item.taal,
        tag: item.taal.toLowerCase().replace(/\s+/g, '-'),
        ervaring: item.ervaring || 'beginner'
      }));
      
      console.log("CodeerTaalSelector - update naar parent:", formattedTalen);
      onChange(formattedTalen);
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
