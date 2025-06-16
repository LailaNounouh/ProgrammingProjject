import React, { useState } from "react";
import "./DropDowns.css"


const codeerOpties = ["JavaScript", "Python", "Java", "C#", "SQL", "HTML/CSS"];
const beheersOpties = ["Beginner", "Gevorderd", "Expert"];


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


 return (
   <div className="taal-selector">
     <h3>talen</h3>
      <div className="inputs">
       <select value={taal} onChange={(e) => setTaal(e.target.value)}>
         <option value="">Kies taal</option>
         {codeerOpties.map((t, i) => <option key={i} value={t}>{t}</option>)}
       </select>


       <select value={niveau} onChange={(e) => setNiveau(e.target.value)}>
         <option value="">Kies beheersing</option>
         {beheersOpties.map((n, i) => <option key={i} value={n}>{n}</option>)}
       </select>


       <button onClick={voegToe}>Toevoegen</button>
     </div>
     <ul>
       {lijst.map((item, i) => (
         <li key={i}>{item.taal} — {item.niveau}</li>
       ))}
     </ul>
   </div>
 );
}




