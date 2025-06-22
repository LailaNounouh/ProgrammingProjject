import React, { useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './DropDowns.css';

const animatedComponents = makeAnimated();

// Lijst van talen
const taalOpties = [
  { value: 'Nederlands', label: 'Nederlands' },
  { value: 'Engels', label: 'Engels' },
  { value: 'Frans', label: 'Frans' },
  { value: 'Duits', label: 'Duits' },
  { value: 'Spaans', label: 'Spaans' },
  { value: 'Italiaans', label: 'Italiaans' },
  { value: 'Portugees', label: 'Portugees' },
  { value: 'Russisch', label: 'Russisch' },
  { value: 'Chinees', label: 'Chinees' },
  { value: 'Japans', label: 'Japans' },
  { value: 'Arabisch', label: 'Arabisch' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Turks', label: 'Turks' },
  { value: 'Pools', label: 'Pools' },
  { value: 'Zweeds', label: 'Zweeds' },
  { value: 'Noors', label: 'Noors' },
  { value: 'Fins', label: 'Fins' },
  { value: 'Deens', label: 'Deens' },
  { value: 'Grieks', label: 'Grieks' },
  { value: 'Hongaars', label: 'Hongaars' },
  { value: 'Tsjechisch', label: 'Tsjechisch' },
  { value: 'Roemeens', label: 'Roemeens' },
  { value: 'Bulgaars', label: 'Bulgaars' },
  { value: 'Kroatisch', label: 'Kroatisch' },
  { value: 'Servisch', label: 'Servisch' },
  { value: 'Oekraïens', label: 'Oekraïens' },
  { value: 'Hebreeuws', label: 'Hebreeuws' },
  { value: 'Koreaans', label: 'Koreaans' },
  { value: 'Thai', label: 'Thai' },
  { value: 'Vietnamees', label: 'Vietnamees' },
];

const TaalSelector = ({ value = [], onChange, readOnly = false }) => {
  // Converteer de waarden naar het juiste formaat voor react-select
  const [selectedOptions, setSelectedOptions] = useState(() => {
    if (Array.isArray(value)) {
      return value.map(val => ({ value: val, label: val }));
    }
    return [];
  });

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    // Stuur alleen de waarden terug naar de parent component
    if (onChange) {
      onChange(selected.map(option => option.value));
    }
  };

  return (
    <div className="skill-selector-container">
      <h3>Talen</h3>
      <p className="skill-description">
        Selecteer de talen die je beheerst
      </p>
      <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        options={taalOpties}
        value={selectedOptions}
        onChange={handleChange}
        isDisabled={readOnly}
        placeholder="Selecteer talen..."
        className="skill-select"
        classNamePrefix="skill-select"
      />
      {selectedOptions.length > 0 && (
        <div className="selected-skills">
          <h4>Geselecteerde talen:</h4>
          <ul>
            {selectedOptions.map((option) => (
              <li key={option.value}>{option.label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaalSelector;
