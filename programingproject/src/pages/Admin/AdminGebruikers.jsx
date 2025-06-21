import React, { useState, useEffect } from 'react';
import './AdminGebruikers.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config';

function AdminGebruikers() {
  const navigate = useNavigate();
  const [gebruikers, setGebruikers] = useState([]);
  const [bewerken, setBewerken] = useState(false);

  useEffect(() => {
    fetch(`${baseUrl}/users`)
      .then(res => {
        if (!res.ok) throw new Error('Fout bij ophalen gebruikers');
        return res.json();
      })
      .then(data => {
        setGebruikers(data);
      })
      .catch(err => {
        console.error('Fout bij ophalen gebruikers:', err);
      });
  }, []);

  const wijzigGebruiker = (id, veld, waarde) => {
    setGebruikers(prev =>
      prev.map(g =>
        g.id === id ? { ...g, [veld]: waarde } : g
      )
    );
  };

  const opslaanGebruiker = (gebruiker) => {
    fetch(`${baseUrl}/users/${gebruiker.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        naam: gebruiker.naam,
        email: gebruiker.email,
        rol: gebruiker.rol
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Fout bij opslaan gebruiker');
        console.log('Gebruiker opgeslagen:', gebruiker.id);
      })
      .catch(err => console.error(err));
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
          <button className="bewerken-button" onClick={() => setBewerken(!bewerken)}>
            {bewerken ? 'Sluiten' : 'Bewerken'}
          </button>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Naam</th>
                <th>Email</th>
                <th>Rol</th>
                {bewerken && <th>Opslaan</th>}
              </tr>
            </thead>
            <tbody>
              {gebruikers.map((user, index) => (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>
                    {bewerken ? (
                      <input
                        value={user.naam}
                        onChange={(e) => wijzigGebruiker(user.id, 'naam', e.target.value)}
                      />
                    ) : (
                      user.naam
                    )}
                  </td>
                  <td>
                    {bewerken ? (
                      <input
                        value={user.email}
                        onChange={(e) => wijzigGebruiker(user.id, 'email', e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {bewerken ? (
                      <input
                        value={user.rol}
                        onChange={(e) => wijzigGebruiker(user.id, 'rol', e.target.value)}
                      />
                    ) : (
                      user.rol
                    )}
                  </td>
                  {bewerken && (
                    <td>
                      <button onClick={() => opslaanGebruiker(user)}>Opslaan</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default AdminGebruikers;
