import React, { useState } from "react";
import talenOpties from "./talen.json";
import "./DropDowns.css";

const beheersOpties = ["Beperkt", "Basis", "Vloeiend", "Moedertaal"];

export default function TaalSelector() {
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

  const verwijder = (taalNaam) => {
    setLijst(lijst.filter(item => item.taal !== taalNaam));
  };

  return (
    <div className="taal-selector">
      <h3>Talen</h3>
      <div className="inputs">
        <select value={taal} onChange={(e) => setTaal(e.target.value)}>
          <option value="">Kies taal</option>
          {talenOpties.map((t, i) => (
            <option key={i} value={t.name}>
              {t.name} ({t.tag})
            </option>
          ))}
        </select>

        <select value={niveau} onChange={(e) => setNiveau(e.target.value)}>
          <option value="">Kies beheersing</option>
          {beheersOpties.map((n, i) => (
            <option key={i} value={n}>{n}</option>
          ))}
        </select>

        <button onClick={voegToe}>Toevoegen</button>
      </div>

      <ul>
        {lijst.map((item, i) => (
          <li key={i}>
            {item.taal} — {item.niveau}
            <button onClick={() => verwijder(item.taal)}>Verwijder</button>
          </li>
        ))}
      </ul>
    </div>
  );
}