import React, { useState, useEffect } from 'react';
import './StudentenDashboard.css';
import { baseUrl } from "../../config";

function App() {
  const [bedrijven, setBedrijven] = useState([]);
  const [filterTag, setFilterTag] = useState('all'); // default = alles tonen

  // Voorbeeld lijst van alle mogelijke tags (kan je aanpassen of uit je backend halen)
  const alleTagsLijst = ['duurzaam', 'innovatie', 'technologie', 'consultancy', 'it', 'marketing'];

  useEffect(() => {
    async function fetchBedrijven() {
      try {
        const response = await fetch(`${baseUrl}/bedrijven`);
        const data = await response.json();

        // Voeg automatisch tags toe aan bedrijven op basis van description
        const bedrijvenMetTags = data.map(bedrijf => {
          const description = (bedrijf.description || '').toLowerCase();

          // Filter tags die in description voorkomen
          const gevondenTags = alleTagsLijst.filter(tag =>
            description.includes(tag.toLowerCase())
          );

          // Voeg gevonden tags toe, of behoud bestaande tags als die er zijn
          return { 
            ...bedrijf, 
            tags: gevondenTags.length > 0 ? gevondenTags : (bedrijf.tags || []) 
          };
        });

        setBedrijven(bedrijvenMetTags);
      } catch (error) {
        console.error("Fout bij laden bedrijven:", error);
      }
    }
    fetchBedrijven();
  }, []);

  // Alle unieke tags uit bedrijven halen (zodat dropdown altijd up-to-date is)
  const alleTags = React.useMemo(() => {
    const tagsSet = new Set();
    bedrijven.forEach(bedrijf => {
      if (bedrijf.tags && Array.isArray(bedrijf.tags)) {
        bedrijf.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [bedrijven]);

  // Filter bedrijven op basis van geselecteerde tag
  const gefilterdeBedrijven = filterTag === 'all' 
    ? bedrijven 
    : bedrijven.filter(bedrijf => bedrijf.tags && bedrijf.tags.includes(filterTag));

  return (
    <div className="app">
      <main>
        <section className="linkedin-section">
          <label htmlFor="linkedin">LinkedIn toevoegen:*</label>
          <input
            type="url"
            id="linkedin"
            placeholder="URL naar LinkedIn profiel"
          />
        </section>

        <section id="bedrijven" className="bedrijven-section">
          <h2>Deelnemende bedrijven:</h2>
          
          {/* Dropdown filter */}
          <label htmlFor="tagFilter">Filter op tag:</label>
          <select
            id="tagFilter"
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="filter-select"
          >
            <option value="all">Alle tags</option>
            {alleTags.map((tag, idx) => (
              <option key={idx} value={tag}>{tag}</option>
            ))}
          </select>

          <div className="bedrijven-lijst">
            {bedrijven.length === 0 ? (
              <p>Bedrijven worden geladen...</p>
            ) : gefilterdeBedrijven.length === 0 ? (
              <p>Geen bedrijven gevonden met deze tag.</p>
            ) : (
              gefilterdeBedrijven.map((bedrijf, index) => (
                <div className="bedrijf-kaart" key={index}>
                  <div className="logo-placeholder"></div>
                  <p>{bedrijf.name || bedrijf.id}</p>
                  <a href="#">Meer info</a>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="standen" className="standen-section">
          <h2>Standen:</h2>
          <div className="standen-grid">
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
            <div className="stand">Buffet</div>
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
            <div className="stand">Onthaal</div>
            <div className="stand bedrijf"></div>
            <div className="stand bedrijf"></div>
          </div>
        </section>

        <section id="afspraak">
          {/* Afspraak maken sectie - voeg inhoud toe indien gewenst */}
        </section>
      </main>
    </div>
  );
}

export default App;
