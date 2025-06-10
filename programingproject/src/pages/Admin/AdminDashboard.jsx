import React, { useState } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
const [page, setPage] = useState('dashboard');
const [searchTerm, setSearchTerm] = useState('');
const [searchCategory, setSearchCategory] = useState('studenten'); // of 'werkzoekenden', 'bedrijven'

// Voorbeeldgegevens
const studenten = [
{ naam: 'Amina', skills: 'Engels, HTML, CSS, JavaScript' },
{ naam: 'Jeroen', skills: 'Python, Data Science' },
];

const werkzoekenden = [
{ naam: 'Lisa', skills: 'Grafisch ontwerp, Photoshop' },
{ naam: 'Mark', skills: 'Java, Spring Boot' },
];

const bedrijven = [
{ naam: 'Nova Tech', sector: 'IT & Technologie' },
{ naam: 'Greenline Logistics', sector: 'Transport' },
];

// Filter functies
const filterData = () => {
const lowerSearch = searchTerm.toLowerCase();

if (searchCategory === 'studenten') {
return studenten.filter(s =>
s.naam.toLowerCase().includes(lowerSearch) ||
s.skills.toLowerCase().includes(lowerSearch)
);
} else if (searchCategory === 'werkzoekenden') {
return werkzoekenden.filter(w =>
w.naam.toLowerCase().includes(lowerSearch) ||
w.skills.toLowerCase().includes(lowerSearch)
);
} else if (searchCategory === 'bedrijven') {
return bedrijven.filter(b =>
b.naam.toLowerCase().includes(lowerSearch) ||
b.sector.toLowerCase().includes(lowerSearch)
);
}
return [];
};

const handleNav = (newPage) => {
setPage(newPage);
setSearchTerm('');
};

const filteredResults = filterData();

return (
<div className="app-container">
<main className="main-content">
{page === 'dashboard' && (
<section>
<header>
<h1>Ingelogd bedrijf</h1>
<h2>Bedrijf</h2>
</header>
{/* Zoekcategorie selecteren */}
<div className="search-category-selector">
<button
className={searchCategory === 'studenten' ? 'active' : ''}
onClick={() => setSearchCategory('studenten')}
>
Studenten
</button>
<button
className={searchCategory === 'werkzoekenden' ? 'active' : ''}
onClick={() => setSearchCategory('werkzoekenden')}
>
Werkzoekenden
</button>
<button
className={searchCategory === 'bedrijven' ? 'active' : ''}
onClick={() => setSearchCategory('bedrijven')}
>
Bedrijven
</button>
</div>
{/* Zoekbalk */}
<div className="search-container">
<input
type="text"
placeholder={`Zoek in ${searchCategory}...`}
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
/>
</div>
{/* Resultaten tonen */}
<div className="search-results">
{searchCategory === 'studenten' && (
filteredResults.length > 0 ? (
filteredResults.map((s, index) => (
<div key={index} className="result-item">
<h3>Student: {s.naam}</h3>
<p>Skills: {s.skills}</p>
</div>
))
) : (
<p>Geen studenten gevonden.</p>
)
)}
{searchCategory === 'werkzoekenden' && (
filteredResults.length > 0 ? (
filteredResults.map((w, index) => (
<div key={index} className="result-item">
<h3>Werkzoekende: {w.naam}</h3>
<p>Skills: {w.skills}</p>
</div>
))
) : (
<p>Geen werkzoekenden gevonden.</p>
)
)}
{searchCategory === 'bedrijven' && (
filteredResults.length > 0 ? (
filteredResults.map((b, index) => (
<div key={index} className="result-item">
<h3>Bedrijf: {b.naam}</h3>
<p>Sectie: {b.sector}</p>
</div>
))
) : (
<p>Geen bedrijven gevonden.</p>
)
)}
</div>
{/* Overzicht kaarten */}
<div className="card-container">
{/* Je kaarten hier, indien nodig */}
</div>
</section>
)}

{page === 'betaling' && (
<section>
<header>
<h1>Staat van betaling</h1>
</header>
{/* ... */}
<button
onClick={() => handleNav('dashboard')}>Terug naar overzicht</button>
</section>
)}

{/* Andere pagina's */}
{page === 'beschikbaarheid' && (
<section>
{/* ... */}
<button onClick={() => handleNav('dashboard')}>Terug naar overzicht</button>
</section>
)}

{page === 'afspraken' && (
<section>
{/* ... */}
<button onClick={() => handleNav('dashboard')}>Terug naar overzicht</button>
</section>
)}

{page === 'instellingen' && (
<section>
{/* ... */}
<button onClick={() => handleNav('dashboard')}>Terug naar overzicht</button>
</section>
)}
</main>
</div>
);
}