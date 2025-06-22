import React, { useState, useEffect } from 'react';
import './AdminGebruikers.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config';

function AdminGebruikers() {
  const navigate = useNavigate();
  const [gebruikers, setGebruikers] = useState([]);
  const [bewerken, setBewerken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const haalGebruikersOp = async () => {
    try {
      const response = await fetch(`${baseUrl}/users`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Gebruikers opgehaald:', data);
      setGebruikers(data);
    } catch (err) {
      console.error('Fout bij ophalen gebruikers:', err);
      setMessage(`❌ Fout bij ophalen gebruikers: ${err.message}`);
    }
  };

  useEffect(() => {
    haalGebruikersOp();
  }, []);

  const wijzigGebruiker = (id, veld, waarde) => {
    setGebruikers(prev =>
      prev.map(g =>
        g.id === id ? { ...g, [veld]: waarde } : g
      )
    );
  };

  const opslaanGebruiker = async (gebruiker) => {
    setLoading(true);
    setMessage('');

    try {
      console.log('Saving user:', gebruiker);

      const response = await fetch(`${baseUrl}/users/${gebruiker.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naam: gebruiker.naam,
          email: gebruiker.email,
          rol: gebruiker.rol
        })
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Fout bij opslaan gebruiker');
      }

      setMessage(`✅ Gebruiker ${gebruiker.naam} succesvol opgeslagen!`);
      console.log('Gebruiker opgeslagen:', gebruiker.id);

      // Refresh the user list to show updated data
      await haalGebruikersOp();

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      console.error('Error saving user:', err);
      setMessage(`❌ Fout bij opslaan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verwijderGebruiker = async (gebruiker) => {
    if (!window.confirm(`Weet je zeker dat je ${gebruiker.naam} wilt verwijderen?`)) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('Deleting user:', gebruiker);

      const response = await fetch(`${baseUrl}/users/${gebruiker.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Fout bij verwijderen gebruiker');
      }

      setMessage(`✅ Gebruiker ${gebruiker.naam} succesvol verwijderd!`);
      console.log('Gebruiker verwijderd:', gebruiker.id);

      // Refresh the user list
      await haalGebruikersOp();

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      console.error('Error deleting user:', err);
      setMessage(`❌ Fout bij verwijderen: ${err.message}`);
    } finally {
      setLoading(false);
    }
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

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <button className="bewerken-button" onClick={() => setBewerken(!bewerken)} disabled={loading}>
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
                {bewerken && <th>Verwijderen</th>}
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
                      <select
                        value={user.rol}
                        onChange={(e) => wijzigGebruiker(user.id, 'rol', e.target.value)}
                        className="rol-select"
                      >
                        <option value="student">Student</option>
                        <option value="werkzoekende">Werkzoekende</option>
                      </select>
                    ) : (
                      user.rol
                    )}
                  </td>
                  {bewerken && (
                    <td>
                      <button
                        onClick={() => opslaanGebruiker(user)}
                        disabled={loading}
                        className="save-button"
                      >
                        {loading ? 'Bezig...' : 'Opslaan'}
                      </button>
                    </td>
                  )}
                  {bewerken && (
                    <td>
                      <button
                        onClick={() => verwijderGebruiker(user)}
                        disabled={loading}
                        className="delete-button"
                      >
                        🗑️ Verwijderen
                      </button>
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
