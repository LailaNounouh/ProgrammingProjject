import React from 'react';
import './AfspraakOverzicht.css';

const AfspraakOverzicht = ({ afspraken = [] }) => {
  return (
    <main className="afspraak-overzicht">
      <header className="afspraak-overzicht__header">
        <h1 className="afspraak-overzicht__titel">Afspraakoverzicht</h1>
      </header>
      
      <section className="afspraak-overzicht__content">
        {afspraken.length > 0 ? (
          <ul className="afspraak-lijst">
            {/* Toekomstige afspraken worden hier gerenderd */}
          </ul>
        ) : (
          <p className="afspraak-overzicht__geen-afspraken">
            Momenteel zijn er geen afspraken gepland.
          </p>
        )}
      </section>
    </main>
  );
};

export default AfspraakOverzicht;