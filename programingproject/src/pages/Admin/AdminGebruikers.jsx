import React, { useState, useEffect } from 'react';
import './AdminGebruikers.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config'; // pas aan naar jouw config of baseUrl

function AdminGebruikers() {
  const navigate = useNavigate();

  const [gebruikers, setGebruikers] = useState([]);

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
                <th>Naam</th>       {/* toegevoegd */}
                <th>Email</th>      {/* toegevoegd */}
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {gebruikers.map((user, index) => (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>{user.naam}</td>
                  <td>{user.email}</td>
                  <td>{user.rol}</td>
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
