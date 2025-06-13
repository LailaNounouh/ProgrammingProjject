import React from 'react';
import './AfspraakOverzicht.css';

const AfspraakOverzicht = () => {
  return (
    <div className="afspraak-overzicht">
      <header className="afspraak-overzicht__header">
        <h1>Afspraakoverzicht</h1>
      </header>
      <div className="afspraak-overzicht__geen-afspraken">
        <span>Geen afspraken gepland</span>
      </div>
    </div>
  );
};

export default AfspraakOverzicht;