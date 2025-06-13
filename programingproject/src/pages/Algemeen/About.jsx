import React from 'react';
import './About.css';

function About() {
  return (
    <div className="container">
      <header className="header">
        <h1>Over Career Launch</h1>
        <p className="subtitle">Verbind studenten, werkzoekenden en bedrijven</p>
      </header>
      <div className="divider"></div>
      
      <section className="description">
        <p>
          <span className="highlight">Career Launch</span> is opgericht met één duidelijk doel: 
          het verbinden van talentvolle studenten en werkzoekenden met bedrijven die hen verder willen helpen. 
          Wij geloven dat de juiste ontmoeting het startpunt is van een succesvolle carrière.
        </p>
        <p>
          Met onze evenementen en digitale matchingtool creëren we een platform waar jij als bezoeker niet alleen bedrijven leert kennen, 
          maar ook actief aan je toekomst werkt.
          Of je nu op zoek bent naar een stage, een eerste baan of inspiratie voor je loopbaan, bij Career Launch krijg je de tools en 
          kansen om je ambities waar te maken.
        </p>
        <p>
          Voor bedrijven biedt Career Launch een unieke kans om gemotiveerd talent te ontmoeten en hun organisatie op een authentieke manier te presenteren. 
          Zo bouwen we samen aan een netwerk waarin kansen en talent elkaar vinden.
        </p>
        <p>
          Onze missie is helder: <span className="highlight">carrières lanceren</span> door verbindingen te maken die écht het verschil maken.
        </p>
      </section>
    </div>
  );
}

export default About;
