import React, { useState } from 'react';
import './AdminDashboard.css';
import Plattegrond from '../../components/plattegrond/Plattegrond';

function App() {
  const [bedrijven, setBedrijven] = useState([
    { naam: 'Microsoft' },
    { naam: 'Cisco' },
    { naam: 'Sopra Steria' },
    { naam: 'Webdoos' },
    { naam: 'Amazon' },
    { naam: 'Google' }
  ]);

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
  const [bewerkModus, setBewerkModus] = useState(false);

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

  const handleBedrijfNaamChange = (index, nieuweNaam) => {
    const nieuweBedrijven = [...bedrijven];
    nieuweBedrijven[index].naam = nieuweNaam;
    setBedrijven(nieuweBedrijven);
  };

  return (
    <div className="admin-dashboard">
      <main className="admin-main">

        {/* Deelnemende bedrijven */}
        <section className="bedrijven-section">
          <h2>Deelnemende bedrijven:</h2>

          <div className="bedrijven-header">
            <button className="filter-button">Filter ⌄</button>
          </div>

          <div className="bedrijven-grid">
            {bedrijven.map((bedrijf, index) => (
              <div key={index} className="bedrijf-card">
                <div className="bedrijf-image" />
                {bewerkModus ? (
                  <input
                    type="text"
                    value={bedrijf.naam}
                    onChange={(e) => handleBedrijfNaamChange(index, e.target.value)}
                    className="bedrijf-input"
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                  />
                ) : (
                  <strong>{bedrijf.naam}</strong>
                )}
                <p>• Meer info</p>
              </div>
            ))}
          </div>

          <div className="bedrijven-footer">
            <button
              className="bewerken-button"
              onClick={() => setBewerkModus(!bewerkModus)}
            >
              {bewerkModus ? 'Opslaan' : 'Bewerk'}
            </button>
          </div>
        </section>

        {/* Standen */}
        <section className="standen-section">
          <h2>Beheer van Standen:</h2>
          <div className="plattegrond">
            <Plattegrond bewerkModus={bewerkModus} />
          </div>

          <div className="legend">
            <span><div className="dot red"></div>= bezet</span>
            <span><div className="dot green"></div>= vrij</span>
          </div>

          <button
            className="bewerken-button"
            onClick={() => setBewerkModus(!bewerkModus)}
          >
            {bewerkModus ? 'Opslaan' : 'Bewerk'}
          </button>
        </section>

        {/* Gebruikers */}
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
          <button className="bewerken-button">Bewerk</button>
        </section>

        {/* Statistieken */}
        <section className="statistieken-section">
          <h3>Statistieken</h3>
          <p>Gebruikers: {aantalGebruikers}</p>
          <p>Actieve standen: {actieveStanden}</p>
        </section>

        {/* Sectoren */}
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

export default App;
