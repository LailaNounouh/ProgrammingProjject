// Plattegrond.jsx
import React, { useState } from "react";

// De Plattegrond component accepteert nu 'plattegrondData' als prop
const Plattegrond = ({ plattegrondData }) => {
  const [selectedInfo, setSelectedInfo] = useState(null); // Voor het weergeven van info onder de kaart

  // Zorg ervoor dat plattegrondData en de geneste eigenschappen beschikbaar zijn
  const aulaPlaatsen = plattegrondData?.plaatsen?.aula || [];
  const tafelPlaatsen = plattegrondData?.plaatsen?.tafel || [];

  // Map de aula plaatsen naar de 4 auditorium slots in de SVG
  // Dit is een simpele mapping op basis van de volgorde.
  // Als je specifieke aula's aan specifieke auditoria wilt koppelen,
  // moet je hier complexere logica toevoegen (bijv. zoeken op 'nummer').
  const auditoria = [
    aulaPlaatsen[0] || null, // Auditorium 1
    aulaPlaatsen[1] || null, // Auditorium 2
    aulaPlaatsen[2] || null, // Auditorium 3
    aulaPlaatsen[3] || null, // Auditorium 4
  ];

  // Map de tafel plaatsen naar de 16 tafel slots (8 boven, 8 onder) in de SVG
  // Sorteer eerst op nummer voor een consistente weergave
  const allTafelPlaatsen = [...tafelPlaatsen].sort((a, b) => a.nummer - b.nummer);
  const tafelsBoven = allTafelPlaatsen.slice(0, 8);
  const tafelsOnder = allTafelPlaatsen.slice(8, 16); // Meer dan 16 tafels worden niet getoond

  const handlePlaatsClick = (plaats) => {
    if (plaats) {
      setSelectedInfo(`Locatie: ${plaats.location_type === 'aula' ? 'Auditorium' : 'Tafel'} ${plaats.nummer} - Bedrijf: ${plaats.company_name || 'Vrij'}`);
    } else {
      setSelectedInfo("Deze plaats is niet gedefinieerd of beschikbaar.");
    }
  };

  return (
    <div className="plattegrond-container">
      <svg width="1200px" height="1000px" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white" />

        {/* Inkom */}
        <rect x="50" y="300" width="100" height="400" fill="#eeeeee" stroke="black" strokeWidth="2" />
        <text x="100" y="500" fontSize="20" textAnchor="middle" fill="black" transform="rotate(-90 100,500 )">Inkom</text>

        {/* Gang 016 */}
        <rect x="150" y="300" width="500" height="400" fill="#f5f5f5" stroke="black" strokeWidth="2" />
        <text x="400" y="520" fontSize="24" textAnchor="middle" fill="black">Gang 016</text>

        {/* Tafels boven */}
        {tafelsBoven.map((plaats, index) => {
          const tafelWidth = 500 / 8;
          const x = 150 + index * tafelWidth;
          const y = 310;
          const isOccupied = plaats && plaats.bedrijf_id;
          const companyName = plaats?.company_name || "Vrij";
          return (
            <g key={`boven-${index}`} onClick={() => handlePlaatsClick(plaats)}>
              <rect x={x} y={y} width={tafelWidth - 5} height="40" fill={isOccupied ? "#c8e6c9" : "#ffcccb"} stroke="black" strokeWidth="1" />
              <text x={x + (tafelWidth / 2) - 2} y={y + 25} fontSize="10" textAnchor="middle" fill="black">
                {companyName.length > 10 ? companyName.substring(0, 8) + '...' : companyName}
              </text>
            </g>
          );
        })}

        {/* Tafels onder */}
        {tafelsOnder.map((plaats, index) => {
          const tafelWidth = 500 / 8;
          const x = 150 + index * tafelWidth;
          const y = 640;
          const isOccupied = plaats && plaats.bedrijf_id;
          const companyName = plaats?.company_name || "Vrij";
          return (
            <g key={`onder-${index}`} onClick={() => handlePlaatsClick(plaats)}>
              <rect x={x} y={y} width={tafelWidth - 5} height="40" fill={isOccupied ? "#ffe082" : "#ffcccb"} stroke="black" strokeWidth="1" />
              <text x={x + (tafelWidth / 2) - 2} y={y + 25} fontSize="10" textAnchor="middle" fill="black">
                {companyName.length > 10 ? companyName.substring(0, 8) + '...' : companyName}
              </text>
            </g>
          );
        })}

        {/* Auditoria */}
        {auditoria.map((plaats, index) => {
          const isOccupied = plaats && plaats.bedrijf_id;
          const companyName = plaats?.company_name || "Vrij";
          let x, y, width, height, textX, textY;

          // Hardcoded posities voor de 4 auditoria in de SVG
          if (index === 0) { // Auditorium 1
            x = 150; y = 100; width = 250; height = 200; textX = 275; textY = 220;
          } else if (index === 1) { // Auditorium 2
            x = 400; y = 100; width = 250; height = 200; textX = 525; textY = 220;
          } else if (index === 2) { // Auditorium 3
            x = 150; y = 700; width = 250; height = 200; textX = 275; textY = 820;
          } else if (index === 3) { // Auditorium 4
            x = 400; y = 700; width = 250; height = 200; textX = 525; textY = 820;
          } else {
            return null; // Zou niet moeten gebeuren als 'auditoria' array is beperkt tot 4
          }

          return (
            <g key={`auditorium-${index}`} onClick={() => handlePlaatsClick(plaats)}>
              <rect x={x} y={y} width={width} height={height} fill={isOccupied ? "#a7ffeb" : "#e0f7fa"} stroke="black" strokeWidth="2" />
              {/* Tekst aangepast van "Aula" naar "Auditorium" */}
              <text x={textX} y={textY - 10} fontSize="20" textAnchor="middle" fill="black">
                {`Auditorium ${plaats?.nummer || (index + 1)}`}
              </text>
              <text x={textX} y={textY + 15} fontSize="14" textAnchor="middle" fill="black">
                {companyName.length > 15 ? companyName.substring(0, 12) + '...' : companyName}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Extra informatie onder de kaart */}
      <div className="extra-info">
        <h3>Informatie over de geselecteerde plaats:</h3>
        <p>{selectedInfo || "Klik op een plaats om meer informatie te zien."}</p>
      </div>
    </div>
  );
};

export default Plattegrond;
