import React, { useState } from "react";
import Plattegrond from "../../components/plattegrond/Plattegrond";

const StudentPlattegrond = () => {
  const [vergroot, setVergroot] = useState(false);

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <button
        onClick={() => setVergroot(!vergroot)}
        style={{
          padding: "12px 24px",
          fontSize: 16,
          marginBottom: 30,
          cursor: "pointer",
          backgroundColor: "#00a9b5",
          color: "white",
          border: "none",
          borderRadius: 8,
        }}
      >
        {vergroot ? "Sluit plattegrond" : "Vergroot volledig"}
      </button>

      <div
        style={{
          width: vergroot ? "95vw" : "1200px",
          maxWidth: "95vw",
          margin: "0 auto",
          padding: "0px", // <-- geen extra ruimte
          border: "1px solid #ccc",
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
          transition: "all 0.3s ease",
         }}
        >
        {/* SVG staat bovenaan */}
        <div style={{ maxHeight: vergroot ? "none" : "1200px", overflow: "auto" }}>
          <Plattegrond />
        </div>

        {/* Ruimte onder de kaart voor standinfo */}
        <div style={{ marginTop: 40, textAlign: "left" }}>
          <h3>ℹ️ Informatie over standen</h3>
          <p>Selecteer een stand op de kaart of bekijk hieronder de beschikbare bedrijven.</p>
          {/* Hier komt bv. <StandenInfo /> of dynamische content */}
          <ul>
            <li><strong>Bedrijf A</strong>: Webdevelopment & stages</li>
            <li><strong>Bedrijf B</strong>: AI consultancy & demo's</li>
            <li><strong>Startup C</strong>: VR/AR prototyping</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentPlattegrond;