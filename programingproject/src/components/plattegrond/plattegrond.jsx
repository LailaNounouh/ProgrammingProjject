import React, { useState, useEffect, useRef } from "react";
import { ReactSVGPanZoom } from "react-svg-pan-zoom";

const defaultStanden = [
  { id: 1, name: "Bedrijf A", x: 300, y: 200, width: 100, height: 40, color: "#f4a261" },
  { id: 2, name: "Bedrijf B", x: 450, y: 200, width: 100, height: 40, color: "#e76f51" },
];

const Plattegrond = () => {
  const Viewer = useRef(null);
  const [standen, setStanden] = useState(() => {
    const saved = localStorage.getItem("standen");
    return saved ? JSON.parse(saved) : defaultStanden;
  });

  useEffect(() => {
    localStorage.setItem("standen", JSON.stringify(standen));
  }, [standen]);

  const [newStand, setNewStand] = useState({
    name: "",
    x: 300,
    y: 200,
    width: 100,
    height: 40,
    color: "#f4a261",
  });

  const handleAddStand = (e) => {
    e.preventDefault();
    const id = Date.now();
    setStanden([...standen, { id, ...newStand }]);
    setNewStand({ name: "", x: 300, y: 200, width: 100, height: 40, color: "#f4a261" });
  };

  const handleClick = (name) => {
    alert(`Je klikte op ${name}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ width: "100%", height: "60vh", border: "1px solid #ccc" }}>
        <ReactSVGPanZoom
          width={900}
          height={600}
          ref={Viewer}
          tool="auto"
          detectAutoPan={false}
          miniaturePosition="none"
        >
          <svg viewBox="0 0 900 600" width="900" height="600">
            <image
              href="/images/plattegrond-kaai.png" 
              x="0"
              y="0"
              width="900"
              height="600"
            />

            {standen.map(({ id, name, x, y, width, height, color }) => (
              <g key={id} onClick={() => handleClick(name)} style={{ cursor: "pointer" }}>
                <rect x={x} y={y} width={width} height={height} fill={color} stroke="black" strokeWidth="1" rx="8" ry="8" />
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 6}
                  fontSize="14"
                  fontWeight="bold"
                  fill="white"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {name}
                </text>
              </g>
            ))}
          </svg>
        </ReactSVGPanZoom>
      </div>

      <div style={{ marginTop: 20, maxWidth: 600 }}>
        <h2>Admin: Stand toevoegen</h2>
        <form onSubmit={handleAddStand}>
          <label>
            Naam:
            <input
              type="text"
              value={newStand.name}
              onChange={(e) => setNewStand({ ...newStand, name: e.target.value })}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
          <br />
          <label>
            X:
            <input
              type="number"
              value={newStand.x}
              onChange={(e) => setNewStand({ ...newStand, x: Number(e.target.value) })}
              style={{ marginLeft: 8, width: 60 }}
              required
            />
          </label>
          <label style={{ marginLeft: 20 }}>
            Y:
            <input
              type="number"
              value={newStand.y}
              onChange={(e) => setNewStand({ ...newStand, y: Number(e.target.value) })}
              style={{ marginLeft: 8, width: 60 }}
              required
            />
          </label>
          <br />
          <label>
            Breedte:
            <input
              type="number"
              value={newStand.width}
              onChange={(e) => setNewStand({ ...newStand, width: Number(e.target.value) })}
              style={{ marginLeft: 8, width: 60 }}
              required
            />
          </label>
          <label style={{ marginLeft: 20 }}>
            Hoogte:
            <input
              type="number"
              value={newStand.height}
              onChange={(e) => setNewStand({ ...newStand, height: Number(e.target.value) })}
              style={{ marginLeft: 8, width: 60 }}
              required
            />
          </label>
          <br />
          <label>
            Kleur:
            <input
              type="color"
              value={newStand.color}
              onChange={(e) => setNewStand({ ...newStand, color: e.target.value })}
              style={{ marginLeft: 8 }}
              required
            />
          </label>
          <br />
          <button type="submit" style={{ marginTop: 10 }}>
            Stand toevoegen
          </button>
        </form>
      </div>
    </div>
  );
};

export default Plattegrond;


