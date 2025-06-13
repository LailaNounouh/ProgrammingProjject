import React from "react";

const Plattegrond = () => {
  return (
    <svg width="100%" height="auto" viewBox="0 0 900 1600" xmlns="http://www.w3.org/2000/svg">
     
      <rect width="100%" height="100%" fill="white" />


      <rect x="50" y="600" width="100" height="400" fill="#eeeeee" stroke="black" stroke-width="2" />
      <text x="100" y="820" font-size="20" text-anchor="middle" fill="black" transform="rotate(-90 100,820)">Inkom</text>

      <rect x="150" y="600" width="600" height="400" fill="#f5f5f5" stroke="black" stroke-width="2" />
      <text x="450" y="820" font-size="24" text-anchor="middle" fill="black">Gang 016</text>


      <rect x="150" y="400" width="300" height="200" fill="#e0f7fa" stroke="black" stroke-width="2" />
      <text x="300" y="520" font-size="20" text-anchor="middle" fill="black">Auditorium 1</text>

      <rect x="450" y="400" width="300" height="200" fill="#e0f7fa" stroke="black" stroke-width="2" />
      <text x="600" y="520" font-size="20" text-anchor="middle" fill="black">Auditorium 2</text>


      <rect x="150" y="1000" width="300" height="200" fill="#e0f7fa" stroke="black" stroke-width="2" />
      <text x="300" y="1120" font-size="20" text-anchor="middle" fill="black">Auditorium 3</text>

      <rect x="450" y="1000" width="300" height="200" fill="#e0f7fa" stroke="black" stroke-width="2" />
      <text x="600" y="1120" font-size="20" text-anchor="middle" fill="black">Auditorium 4</text>
    </svg>
  );
};

export default Plattegrond;