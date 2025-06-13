import React from "react";

const bedrijven = [
  "Microsoft", "Google", "Amazon", "Apple",
  "Meta", "Netflix", "Adobe", "Cisco",
  "Intel", "IBM", "Salesforce", "Spotify",
  "Oracle", "Nvidia", "Dell", "Siemens"
];

const Plattegrond = () => {
  const tafelsBoven = bedrijven.slice(0, 8);
  const tafelsOnder = bedrijven.slice(8, 16);

  return (
    <div className="plattegrond-container">
      <svg width="1200px" height="1000px" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white" />

        {/* Inkom */}
        <rect x="50" y="300" width="100" height="400" fill="#eeeeee" stroke="black" strokeWidth="2" />
        <text x="100" y="500" fontSize="20" textAnchor="middle" fill="black" transform="rotate(-90 100,500)">Inkom</text>

        {/* Gang 016 */}
        <rect x="150" y="300" width="500" height="400" fill="#f5f5f5" stroke="black" strokeWidth="2" />
        <text x="400" y="520" fontSize="24" textAnchor="middle" fill="black">Gang 016</text>

        {/* Tafels boven */}
        {tafelsBoven.map((bedrijf, index) => {
          const tafelWidth = 500 / 8;
          const x = 150 + index * tafelWidth;
          const y = 310;
          return (
            <g key={bedrijf}>
              <rect x={x} y={y} width={tafelWidth - 5} height="40" fill="#c8e6c9" stroke="black" strokeWidth="1" />
              <text x={x + (tafelWidth / 2) - 2} y={y + 25} fontSize="10" textAnchor="middle" fill="black">{bedrijf}</text>
            </g>
          );
        })}

        {/* Tafels onder */}
        {tafelsOnder.map((bedrijf, index) => {
          const tafelWidth = 500 / 8;
          const x = 150 + index * tafelWidth;
          const y = 640;
          return (
            <g key={bedrijf}>
              <rect x={x} y={y} width={tafelWidth - 5} height="40" fill="#ffe082" stroke="black" strokeWidth="1" />
              <text x={x + (tafelWidth / 2) - 2} y={y + 25} fontSize="10" textAnchor="middle" fill="black">{bedrijf}</text>
            </g>
          );
        })}

        {/* Auditoria boven */}
        <rect x="150" y="100" width="250" height="200" fill="#e0f7fa" stroke="black" strokeWidth="2" />
        <text x="275" y="220" fontSize="20" textAnchor="middle" fill="black">Auditorium 1</text>

        <rect x="400" y="100" width="250" height="200" fill="#e0f7fa" stroke="black" strokeWidth="2" />
        <text x="525" y="220" fontSize="20" textAnchor="middle" fill="black">Auditorium 2</text>

        {/* Auditoria onder */}
        <rect x="150" y="700" width="250" height="200" fill="#e0f7fa" stroke="black" strokeWidth="2" />
        <text x="275" y="820" fontSize="20" textAnchor="middle" fill="black">Auditorium 3</text>

        <rect x="400" y="700" width="250" height="200" fill="#e0f7fa" stroke="black" strokeWidth="2" />
        <text x="525" y="820" fontSize="20" textAnchor="middle" fill="black">Auditorium 4</text>
      </svg>
    </div>
  );
};

export default Plattegrond;
