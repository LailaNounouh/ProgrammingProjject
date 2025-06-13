import React, { useState } from "react";
import "./DropDowns.css"


const hardskills = ["Data-analyse", "UI/UX Design", "Projectmanagement", "Netwerkbeheer", "Databasebeheer"];


export default function HardSkillsSelector() {
 const [lijst, setLijst] = useState([]);
 const [skill, setSkill] = useState("");


 const voegToe = () => {
   if (skill && !lijst.includes(skill)) {
     setLijst([...lijst, skill]);
     setSkill("");
   }
 };


 return (
   <div className="hardskills-selector">
     <h3>Hard Skills</h3>
     <div className="inputs">
       <select value={skill} onChange={(e) => setSkill(e.target.value)}>
         <option value="">Kies skill</option>
         {hardskills.map((s, i) => <option key={i} value={s}>{s}</option>)}
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
