import React, { useState } from 'react';
import './StandenModule.css';
import Plattegrond from "../../components/plattegrond/plattegrond";


const mockStands = [
  { id: 1, name: 'Buffet', row: 1, col: 2 },
  { id: 2, name: 'Onthaal', row: 2, col: 1 },
  { id: 3, name: 'Stand A', row: 0, col: 0 },
  { id: 4, name: 'Stand B', row: 0, col: 3 },
  // ...evt. extra mock standen
];

export default function StandenModule() {
  const rows = 4, cols = 4;
  const [selected, setSelected] = useState(null);

  function handleClick(stand) {
    setSelected(stand);
  }

  return (
    
    <div className="standen-module">
      <h1> <Plattegrond /></h1>
      <h2>Interactieve Plattegrond – Campus Kaai</h2>
      <div className="grid" style={{ '--rows': rows, '--cols': cols }}>
        {mockStands.map(s => (
          <div
            key={s.id}
            className={`cell stand ${selected?.id === s.id ? 'active' : ''}`}
            style={{ gridRow: s.row + 1, gridColumn: s.col + 1 }}
            onClick={() => handleClick(s)}
          >
            {s.name}
          </div>
        ))}
      </div>
      {selected && (
        <div className="detail-box">
          <h3>{selected.name}</h3>
          <p>Details en acties hier voor {selected.name}.</p>
          <button onClick={() => setSelected(null)}>Sluit</button>
        </div>
      )}
    </div>
  );
}
