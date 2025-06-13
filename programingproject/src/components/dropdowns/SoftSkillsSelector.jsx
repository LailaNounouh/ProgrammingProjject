import React, { useState } from "react";
import "./DropDowns.css"


const softskills = ["Teamwork", "Communicatie", "Probleemoplossend denken", "Creativiteit", "Aanpassingsvermogen"];


export default function SoftSkillsSelector() {
 const [lijst, setLijst] = useState([]);
 const [skill, setSkill] = useState("");


 const voegToe = () => {
   if (skill && !lijst.includes(skill)) {
     setLijst([...lijst, skill]);
     setSkill("");
   }
 };


 return (
   <div className="softskills-selector">
     <h3>Soft Skills</h3>
     <div className="inputs">
       <select value={skill} onChange={(e) => setSkill(e.target.value)}>
         <option value="">Kies skill</option>
         {softskills.map((s, i) => <option key={i} value={s}>{s}</option>)}
       </select>
       <button onClick={voegToe}>Toevoegen</button>
     </div>
     <ul>
       {lijst.map((s, i) => (
         <li key={i}>{s}</li>
       ))}
     </ul>
   </div>
 );
}
