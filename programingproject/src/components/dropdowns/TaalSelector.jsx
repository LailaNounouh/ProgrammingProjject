import React, { useState } from "react";
import "./DropDowns.css";


const talenOpties = [
  { code: "ab", naam: "Abkhazian" },
  { code: "aa", naam: "Afar" },
  { code: "af", naam: "Afrikaans" },
  { code: "ak", naam: "Akan" },
  { code: "sq", naam: "Albanian" },
  { code: "am", naam: "Amharic" },
  { code: "ar", naam: "Arabic" },
  { code: "an", naam: "Aragonese" },
  { code: "hy", naam: "Armenian" },
  { code: "as", naam: "Assamese" },
  { code: "az", naam: "Azerbaijani" },
  { code: "eu", naam: "Basque" },
  { code: "bn", naam: "Bengali" },
  { code: "bs", naam: "Bosnian" },
  { code: "bg", naam: "Bulgarian" },
  { code: "ca", naam: "Catalan" },
  { code: "zh", naam: "Chinese" },
  { code: "hr", naam: "Croatian" },
  { code: "cs", naam: "Czech" },
  { code: "da", naam: "Danish" },
  { code: "nl", naam: "Dutch" },
  { code: "en", naam: "English" },
  { code: "et", naam: "Estonian" },
  { code: "fi", naam: "Finnish" },
  { code: "fr", naam: "French" },
  { code: "de", naam: "German" },
  { code: "el", naam: "Greek" },
  { code: "he", naam: "Hebrew" },
  { code: "hi", naam: "Hindi" },
  { code: "hu", naam: "Hungarian" },
  { code: "id", naam: "Indonesian" },
  { code: "ga", naam: "Irish" },
  { code: "it", naam: "Italian" },
  { code: "ja", naam: "Japanese" },
  { code: "ko", naam: "Korean" },
  { code: "la", naam: "Latin" },
  { code: "lt", naam: "Lithuanian" },
  { code: "no", naam: "Norwegian" },
  { code: "pl", naam: "Polish" },
  { code: "pt", naam: "Portuguese" },
  { code: "ro", naam: "Romanian" },
  { code: "ru", naam: "Russian" },
  { code: "sr", naam: "Serbian" },
  { code: "sk", naam: "Slovak" },
  { code: "sl", naam: "Slovenian" },
  { code: "es", naam: "Spanish" },
  { code: "sv", naam: "Swedish" },
  { code: "th", naam: "Thai" },
  { code: "tr", naam: "Turkish" },
  { code: "uk", naam: "Ukrainian" },
  { code: "ur", naam: "Urdu" },
  { code: "vi", naam: "Vietnamese" }
];


const niveaus = ["Beginner", "Gevorderd", "Expert", "Moedertaal"];


export default function TaalSelector() {
  const [lijst, setLijst] = useState([]);
  const [taal, setTaal] = useState("");
  const [niveau, setNiveau] = useState("");


  const voegToe = () => {
    if (taal && niveau && !lijst.some(item => item.code === taal)) {
      const geselecteerdeTaal = talenOpties.find(t => t.code === taal);
      setLijst([...lijst, { code: taal, naam: geselecteerdeTaal.naam, niveau }]);
      setTaal("");
      setNiveau("");
    }
  };


  return (
    <div className="taal-selector">
      <h3>Talenkennis</h3>
      <div className="inputs">
        <select value={taal} onChange={(e) => setTaal(e.target.value)}>
          <option value="">Kies een taal</option>
          {talenOpties.map((t, i) => (
            <option key={i} value={t.code}>{t.naam}</option>
          ))}
        </select>


        <select value={niveau} onChange={(e) => setNiveau(e.target.value)}>
          <option value="">Beheersingsniveau</option>
          {niveaus.map((n, i) => (
            <option key={i} value={n}>{n}</option>
          ))}
        </select>


        <button onClick={voegToe}>Toevoegen</button>
      </div>


      <ul className="taal-lijst">
        {lijst.map((item, i) => (
          <li key={i}>
            {item.naam} ({item.code}) — {item.niveau}
          </li>
        ))}
      </ul>
    </div>
  );
}



