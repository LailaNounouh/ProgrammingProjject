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

  const [gebruikers, setGebruikers] = useState([
    { id: 1, rol: 'bedrijf' },
    { id: 2, rol: 'werkzoekende' },
    { id: 3, rol: 'student' },
    { id: 4, rol: 'bedrijf' }
  ]);

  const actieveStanden = 9;
  const aantalGebruikers = 156;

  const [sectoren, setSectoren] = useState([
    { naam: "ICT", zichtbaar: true },
    { naam: "Marketing", zichtbaar: true },
    { naam: "Onderwijs", zichtbaar: true }
  ]);

  const [nieuweSector, setNieuweSector] = useState('');

  // 🔁 GESCHEIDEN bewerk-modi
  const [bewerkBedrijvenModus, setBewerkBedrijvenModus] = useState(false);
  const [bewerkStandenModus, setBewerkStandenModus] = useState(false);
  const [bewerkGebruikersModus, setBewerkGebruikersModus] = useState(false);

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

  const handleGebruikerRolChange = (index, nieuweRol) => {
    const nieuweGebruikers = [...gebruikers];
    nieuweGebruikers[index].rol = nieuweRol;
    setGebruikers(nieuweGebruikers);
  };

  const handleGebruikerIdChange = (index, nieuweId) => {
    const nieuweGebruikers = [...gebruikers];
    nieuweGebruikers[index].id = parseInt(nieuweId);
    setGebruikers(nieuweGebruikers);
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
                {bewerkBedrijvenModus ? (
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
              onClick={() => setBewerkBedrijvenModus(!bewerkBedrijvenModus)}
            >
              {bewerkBedrijvenModus ? 'Opslaan' : 'Bewerk'}
            </button>
          </div>
        </section>

        {/* Standen */}
        <section className="standen-section">
          <h2>Beheer van Standen:</h2>
          <div className="plattegrond">
            <Plattegrond bewerkModus={bewerkStandenModus} />
          </div>

          <div className="legend">
            <span><div className="dot red"></div>= bezet</span>
            <span><div className="dot green"></div>= vrij</span>
          </div>

          <button
            className="bewerken-button"
            onClick={() => setBewerkStandenModus(!bewerkStandenModus)}
          >
            {bewerkStandenModus ? 'Opslaan' : 'Bewerk'}
          </button>
        </section>

        {/* Gebruikers beheren */}
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
              {gebruikers.map((user, index) => (
                <tr key={index}>
                  <td>
                    {bewerkGebruikersModus ? (
                      <input
                        type="number"
                        value={user.id}
                        onChange={(e) => handleGebruikerIdChange(index, e.target.value)}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      user.id
                    )}
                  </td>
                  <td>
                    {bewerkGebruikersModus ? (
                      <input
                        type="text"
                        value={user.rol}
                        onChange={(e) => handleGebruikerRolChange(index, e.target.value)}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      user.rol
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="bewerken-button"
            onClick={() => setBewerkGebruikersModus(!bewerkGebruikersModus)}
          >
            {bewerkGebruikersModus ? 'Opslaan' : 'Bewerk'}
          </button>
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
