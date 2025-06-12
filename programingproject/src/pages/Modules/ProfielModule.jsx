import React from "react";
import "./ProfielModule.css";
import "../../components/dropdowns/TaalSelector"

export default function ProfielModule() {
  return (
   <div className="profiel-module">
     <h1>Profiel Module</h1>
     <p>Hier kunnen gebruikers hun persoonlijke gegevens beheren.</p>
     <div className="profiel-gegevens">
       <h2>Persoonlijke Gegevens</h2>
       <form>
         <label htmlFor="naam">Naam:</label>
         <input type="text" id="naam" name="naam" required />
         
         <label htmlFor="email">E-mail:</label>
         <input type="email" id="email" name="email" required />
         
         <label htmlFor="telefoon">Telefoonnummer:</label>
         <input type="tel" id="telefoon" name="telefoon" required />
         
         <button type="submit">Opslaan</button>
       </form>
       
     </div>
   </div>
  );
}