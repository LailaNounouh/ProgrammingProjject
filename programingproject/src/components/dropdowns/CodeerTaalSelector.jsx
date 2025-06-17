import React, { useState } from "react";
import programmeerTalen from "./codeertalen.json";
import "./DropDowns.css";

const beheersOpties = ["Beginner", "Gevorderd", "Expert"];

export default function CodeertaalSelector() {
  const [lijst, setLijst] = useState([]);
  const [taal, setTaal] = useState("");
  const [niveau, setNiveau] = useState("");

  const voegToe = () => {
    if (taal && niveau && !lijst.some(item => item.taal === taal)) {
      setLijst([...lijst, { taal, niveau }]);
      setTaal("");
      setNiveau("");
    }
  };

  const verwijderTaal = (taalNaam) => {
    setLijst(lijst.filter(item => item.taal !== taalNaam));
  };

  return (
    <div className="codeertaal-selector">
      <h3>Codeertalen</h3>
      <div className="inputs">
        <select value={taal} onChange={(e) => setTaal(e.target.value)}>
          <option value="">Kies codeertaal</option>
          {programmeerTalen.map((optie, index) => (
            <option key={index} value={optie.name}>
              {optie.name} ({optie.tag})
            </option>
          ))}
        </select>

        <select value={niveau} onChange={(e) => setNiveau(e.target.value)}>
          <option value="">Kies beheersing</option>
          {beheersOpties.map((optie, index) => (
            <option key={index} value={optie}>{optie}</option>
          ))}
        </select>

        <button onClick={voegToe}>Toevoegen</button>
      </div>

      <ul>
        {lijst.map((item, index) => (
          <li key={index}>
            {item.taal} — {item.niveau}
            <button onClick={() => verwijderTaal(item.taal)}>Verwijder</button>
          </li>
        ))}
      </ul>
    </div>
  );
}