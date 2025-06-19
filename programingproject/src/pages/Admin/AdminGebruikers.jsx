import React, { useState } from 'react';
import './AdminGebruikers.css';
import { useNavigate } from 'react-router-dom';

function AdminGebruikers() {
  const navigate = useNavigate();

  const [gebruikers, setGebruikers] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      rol: ['student', 'bedrijf', 'werkzoekende'][i % 3]
    }))
  );

  const [bewerkModus, setBewerkModus] = useState(false);

  const handleGebruikerRolChange = (index, nieuweRol) => {
    const nieuweGebruikers = [...gebruikers];
    nieuweGebruikers[index].rol = nieuweRol;
    setGebruikers(nieuweGebruikers);
  };

  return (
    <div className="admin-dashboard">
      <div className="terug-knop-container">
        <button className="terug-button" onClick={() => navigate('/admin')}>
          ← Terug naar dashboard
        </button>
      </div>

      <main className="admin-main">
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
                  <td>{user.id}</td>
                  <td>
                    {bewerkModus ? (
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

          <div className="gebruikers-footer">
            <button
              className="bewerken-button"
              onClick={() => setBewerkModus(!bewerkModus)}
            >
              {bewerkModus ? 'Opslaan' : 'Bewerk'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminGebruikers;
