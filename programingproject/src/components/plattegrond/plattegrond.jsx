import React, { useState, useRef, useEffect } from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';

const Plattegrond = () => {
  const Viewer = useRef(null);
  const [standen, setStanden] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleAddStand = (event) => {
    const point = Viewer.current.getSVGPoint(event.clientX, event.clientY);
    const id = Date.now();
    const newStand = {
      id,
      name: 'Nieuw',
      x: point.x,
      y: point.y,
      width: 100,
      height: 40,
      color: '#27ae60',
    };
    setStanden([...standen, newStand]);
  };

  const handleDrag = (event) => {
    if (!selected) return;
    const point = Viewer.current.getSVGPoint(event.clientX, event.clientY);
    setStanden((prev) =>
      prev.map((s) =>
        s.id === selected ? { ...s, x: point.x - 50, y: point.y - 20 } : s
      )
    );
  };

  const handleDrop = () => setSelected(null);

  useEffect(() => {
    localStorage.setItem('standen', JSON.stringify(standen));
  }, [standen]);

  return (
    <div style={{ display: 'flex', padding: 20 }}>
      <div
        style={{ width: '70%', height: '80vh', border: '1px solid #ccc' }}
        onMouseMove={handleDrag}
        onMouseUp={handleDrop}
      >
        <ReactSVGPanZoom
          width={900}
          height={700}
          ref={Viewer}
          tool="auto"
          detectAutoPan={false}
          onClick={handleAddStand}
        >
          <svg viewBox="0 0 900 700" width="900" height="700">
            {/* Inkom */}
            <rect x="30" y="100" width="60" height="500" fill="#f0f0f0" stroke="black" />
            <text x="40" y="90">Inkom</text>

            {/* Toiletten */}
            <rect x="30" y="100" width="20" height="40" fill="red" />
            <rect x="30" y="560" width="20" height="40" fill="red" />

            {/* Aula's */}
            <rect x="100" y="100" width="300" height="150" fill="#cce5ff" stroke="black" />
            <text x="250" y="190" textAnchor="middle">Aula 1</text>
            <rect x="400" y="100" width="300" height="150" fill="#cce5ff" stroke="black" />
            <text x="550" y="190" textAnchor="middle">Aula 2</text>
            <rect x="100" y="450" width="300" height="150" fill="#cce5ff" stroke="black" />
            <text x="250" y="540" textAnchor="middle">Aula 3</text>
            <rect x="400" y="450" width="300" height="150" fill="#cce5ff" stroke="black" />
            <text x="550" y="540" textAnchor="middle">Aula 4</text>

            {/* Gang */}
            <rect x="100" y="250" width="600" height="200" fill="#e0e0e0" stroke="black" />
            <text x="400" y="350" textAnchor="middle">Gang</text>

            {/* Buiten met bar */}
            <rect x="720" y="100" width="140" height="500" fill="#fff" stroke="black" />
            <text x="790" y="350" textAnchor="middle">Buitenruimte</text>
            <path d="M720,500 L860,600" stroke="gold" strokeWidth="3" />

            {/* Dynamische standen */}
            {standen.map((stand) => (
              <g
                key={stand.id}
                onMouseDown={() => setSelected(stand.id)}
                style={{ cursor: 'move' }}
              >
                <rect
                  x={stand.x}
                  y={stand.y}
                  width={stand.width}
                  height={stand.height}
                  fill={stand.color}
                  stroke="black"
                  rx="6"
                />
                <text
                  x={stand.x + stand.width / 2}
                  y={stand.y + stand.height / 2 + 5}
                  textAnchor="middle"
                  fill="white"
                  fontWeight="bold"
                >
                  {stand.name}
                </text>
              </g>
            ))}
          </svg>
        </ReactSVGPanZoom>
      </div>
    </div>
  );
};

export default Plattegrond;

