import React, { useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './DropDowns.css';

const animatedComponents = makeAnimated();

// Lijst van programmeertalen
const programmeertaalOpties = [
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'C#', label: 'C#' },
  { value: 'C++', label: 'C++' },
  { value: 'C', label: 'C' },
  { value: 'PHP', label: 'PHP' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'Swift', label: 'Swift' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'Go', label: 'Go' },
  { value: 'Rust', label: 'Rust' },
  { value: 'Scala', label: 'Scala' },
  { value: 'Dart', label: 'Dart' },
  { value: 'R', label: 'R' },
  { value: 'SQL', label: 'SQL' },
  { value: 'HTML', label: 'HTML' },
  { value: 'CSS', label: 'CSS' },
  { value: 'SASS/SCSS', label: 'SASS/SCSS' },
  { value: 'Assembly', label: 'Assembly' },
  { value: 'Bash/Shell', label: 'Bash/Shell' },
  { value: 'COBOL', label: 'COBOL' },
  { value: 'Fortran', label: 'Fortran' },
  { value: 'Haskell', label: 'Haskell' },
  { value: 'Lua', label: 'Lua' },
  { value: 'MATLAB', label: 'MATLAB' },
  { value: 'Objective-C', label: 'Objective-C' },
  { value: 'Perl', label: 'Perl' },
  { value: 'PowerShell', label: 'PowerShell' },
  { value: 'Prolog', label: 'Prolog' },
  { value: 'VBA', label: 'VBA' },
  { value: 'Visual Basic', label: 'Visual Basic' },
  { value: 'WebAssembly', label: 'WebAssembly' },
];

const CodeerTaalSelector = ({ value = [], onChange, readOnly = false }) => {
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
      <h3>Programmeertalen</h3>
      <p className="skill-description">
        Selecteer de programmeertalen die je beheerst
      </p>
      <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        options={programmeertaalOpties}
        value={selectedOptions}
        onChange={handleChange}
        isDisabled={readOnly}
        placeholder="Selecteer programmeertalen..."
        className="skill-select"
        classNamePrefix="skill-select"
      />
      {selectedOptions.length > 0 && (
        <div className="selected-skills">
          <h4>Geselecteerde programmeertalen:</h4>
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

export default CodeerTaalSelector;
