import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import talenData from './talen.json';
import './DropDowns.css';

const animatedComponents = makeAnimated();

// Opties voor taalniveaus
const taalNiveauOpties = [
  { value: 'moedertaal', label: 'Moedertaal' },
  { value: 'vloeiend', label: 'Vloeiend' },
  { value: 'goed', label: 'Goed' },
  { value: 'basis', label: 'Basis' }
];

const TaalSelector = ({ value = [], onChange, readOnly = false }) => {
  const [taalOpties, setTaalOpties] = useState([]);
  const [selectedTalen, setSelectedTalen] = useState([]);
  
  useEffect(() => {
    // Converteer de talen uit het JSON-bestand naar het juiste formaat voor react-select
    const opties = talenData.map(taal => ({
      value: taal.name,
      label: taal.name,
      tag: taal.tag
    }));
    setTaalOpties(opties);
  }, []);

  // Initialiseer geselecteerde talen
  useEffect(() => {
    if (Array.isArray(value)) {
      const formattedTalen = value.map(item => {
        if (typeof item === 'object' && item.taal && item.niveau) {
          return {
            taal: item.taal,
            niveau: item.niveau
          };
        } else if (typeof item === 'string') {
          return {
            taal: item,
            niveau: 'basis' // Standaard niveau
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

  const handleNiveauChange = (selected, index) => {
    const updatedTalen = [...selectedTalen];
    updatedTalen[index] = {
      ...updatedTalen[index],
      niveau: selected.value
    };
    setSelectedTalen(updatedTalen);
    updateParent(updatedTalen);
  };

  const addTaal = () => {
    setSelectedTalen([...selectedTalen, { taal: '', niveau: 'basis' }]);
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
      <h3>Talen</h3>
      <p className="skill-description">
        Selecteer de talen die je beheerst en je niveau
      </p>
      
      {selectedTalen.map((item, index) => (
        <div key={index} className="taal-item">
          <div className="taal-row">
            <div className="taal-select">
              <label>Taal</label>
              <Select
                options={taalOpties}
                value={taalOpties.find(option => option.value === item.taal) || null}
                onChange={(selected) => handleTaalChange(selected, index)}
                isDisabled={readOnly}
                placeholder="Selecteer een taal..."
                className="select-container"
                classNamePrefix="select"
              />
            </div>
            
            <div className="niveau-select">
              <label>Niveau</label>
              <Select
                options={taalNiveauOpties}
                value={taalNiveauOpties.find(option => option.value === item.niveau) || null}
                onChange={(selected) => handleNiveauChange(selected, index)}
                isDisabled={readOnly}
                placeholder="Selecteer niveau..."
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
          + Taal toevoegen
        </button>
      )}
      
      {selectedTalen.length > 0 && (
        <div className="selected-skills">
          <h4>Geselecteerde talen:</h4>
          <ul className="skills-list">
            {selectedTalen.filter(item => item.taal).map((item, index) => (
              <li key={index} className="skill-tag">
                {item.taal} 
                <span 
                  className="skill-level" 
                  data-level={item.niveau}
                >
                  {item.niveau}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaalSelector;
