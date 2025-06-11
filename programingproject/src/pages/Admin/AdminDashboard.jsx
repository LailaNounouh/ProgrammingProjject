import React, { useState } from 'react';
import './AdminDashboard.css';

function App() {
  const bedrijven = [
    { naam: 'Microsoft' },
    { naam: 'Cisco' },
    { naam: 'Sopra Steria' },
    { naam: 'Webdoos' }
  ];

  const gebruikers = [
    { id: 1, rol: 'bedrijf' },
    { id: 2, rol: 'werkzoekende' },
    { id: 3, rol: 'student' },
    { id: 4, rol: 'bedrijf' }
  ];

  const actieveStanden = 9;
  const aantalGebruikers = 156;

  const [sectoren, setSectoren] = useState([
    { naam: "ICT", zichtbaar: true },
    { naam: "Marketing", zichtbaar: true },
    { naam: "Onderwijs", zichtbaar: true }
  ]);
  const [nieuweSector, setNieuweSector] = useState('');

  const voegSectorToe = () => {
    if (nieuweSector.trim() !== '' && !sectoren.find(s => s.naam === nieuweSector)) {
      setSectoren([...sectoren, { naam: nieuweSector, zichtbaar: true }]);
      setNieuweSector('');
    }
  };

  const toggleZichtbaarheid = (index) => {
    const nieuweSectoren = [...sectoren];
    nieuweSectoren[index].zichtbaar = !nieuweSectoren[index].zichtbaar;
    setSectoren(nieuweSectoren);
  };

  return (
    <div className="admin-dashboard">
      <main className="admin-main">

        <section className="bedrijven-section">
          <h2>Deelnemende bedrijven:</h2>
          <button className="filter-button">Filter ⌄</button>
          <div className="bedrijven-grid">
            {bedrijven.map((bedrijf, index) => (
              <div key={index} className="bedrijf-card">
                <div className="bedrijf-image" />
                <strong>{bedrijf.naam}</strong>
                <p>• Meer info</p>
              </div>
            ))}
          </div>
          <button className="bewerken-button">bewerk</button>
        </section>

        <section className="standen-section">
          <h2>Beheer van Standen:</h2>
          <div className="plattegrond">
            <div className="stand bezet"><div className="status-circle">−</div></div>
            <div className="stand bezet"><div className="status-circle">−</div></div>
            <div className="buffet">Buffet</div>
            <div className="stand bezet"><div className="status-circle">−</div></div>
            <div className="stand bezet"><div className="status-circle">−</div></div>
            <div className="stand vrij"><div className="status-circle">+</div></div>
            <div className="stand vrij"><div className="status-circle">+</div></div>
            <div className="stand vrij"><div className="status-circle">+</div></div>
            <div className="stand bezet"><div className="status-circle">−</div></div>
            <div className="stand vrij"><div className="status-circle">+</div></div>
            <div className="stand bezet"><div className="status-circle">−</div></div>
            <div className="onthaal">Onthaal</div>
            <div className="stand bezet"><div className="status-circle">−</div></div>
            <div className="stand bezet"><div className="status-circle">−</div></div>
            <div className="stand vrij"><div className="status-circle">+</div></div>
          </div>

          <div className="legend">
            <span><div className="dot red"></div>= bezet</span>
            <span><div className="dot green"></div>= vrij</span>
          </div>

          <button className="bewerken-button">bewerk</button>
        </section>

        <section className="gebruikers-section">
          <h2>Gebruikers beheren</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {gebruikers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.rol}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="bewerken-button">bewerk</button>
        </section>

        <section className="statistieken-section">
          <h3>Statistieken</h3>
          <p>Gebruikers: {aantalGebruikers}</p>
          <p>Actieve standen: {actieveStanden}</p>
        </section>

        <section className="sectoren-section">
          <h2>Sectoren beheren</h2>
          <ul>
            {sectoren.map((sector, index) => (
              <li key={index}>
                {sector.naam} ({sector.zichtbaar ? 'zichtbaar' : 'verborgen'})
                <button onClick={() => toggleZichtbaarheid(index)}>
                  {sector.zichtbaar ? 'Verberg' : 'Toon'}
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Nieuwe sector"
            value={nieuweSector}
            onChange={(e) => setNieuweSector(e.target.value)}
          />
          <button onClick={voegSectorToe}>Voeg toe</button>
        </section>
      </main>
    </div>
  );
}
export default App