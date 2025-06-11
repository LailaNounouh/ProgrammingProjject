import React from 'react';
import './About.css';

function About() {
  return (
    <div className="home">
      <header>
        <h1>Over Career Launch</h1>
        <p className="subtitle">Verbind studenten, werkzoekenden en bedrijven</p>
      </header>
      <section className="description">
        <p>
          <span className="highlight">Career Launch</span> is een initiatief om studenten en werkzoekenden te verbinden met bedrijven die actief zijn in diverse sectoren. 
          Ons doel is om kansen te creëren, netwerken te versterken en carrières te lanceren.
        </p>
        <p>
          Op ons event krijg je als bezoeker de kans om kennis te maken met bedrijven, je profiel te versterken en eventueel een stage of job te vinden.
          Bedrijven kunnen op hun beurt nieuwe talenten ontdekken en hun missie delen met gemotiveerde kandidaten.
        </p>
        <p>
          Met onze <span className="highlight">digitale matchingtool</span> zorgen we ervoor dat iedereen snel en efficiënt de juiste connecties kan maken.
        </p>
      </section>
    </div>
  );
}

export default About;
