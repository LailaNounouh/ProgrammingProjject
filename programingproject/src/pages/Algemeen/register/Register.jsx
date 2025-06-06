import React, { useState } from 'react';
import StudentForm from '../../../components/forms/StudentForm';
import WerkzoekendeForm from '../../../components/forms/Seekersform';
import BedrijfForm from './../../../components/forms/Bedrijvenform';

export default function RegistratiePagina() {
  const [selectedType, setSelectedType] = useState('');

  return (
    <div className="registratie-container">
      <h2>Kies je type account</h2>

      <div className="keuze-buttons">
        <button onClick={() => setSelectedType('student')}>Student</button>
        <button onClick={() => setSelectedType('werkzoekende')}>Werkzoekende</button>
        <button onClick={() => setSelectedType('bedrijf')}>Bedrijf</button>
      </div>

      <div className="formulier-container">
        {selectedType === 'student' && <StudentForm />}
        {selectedType === 'werkzoekende' && <WerkzoekendeForm />}
        {selectedType === 'bedrijf' && <BedrijfForm />}
      </div>
    </div>
  );
}