import React, { useState } from 'react';
import './Home.css';

export default function Home() {
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    isStudent: false,
    isCompany: false,
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.naam || !formData.email) {
      setStatus('Naam en e-mail zijn verplicht.');
      return;
    }

    if (!formData.isStudent && !formData.isCompany) {
      setStatus('Kies of je een student of bedrijf bent.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/registratie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naam: formData.naam,
          email: formData.email,
          isStudent: formData.isStudent,
          isCompany: formData.isCompany,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('Inschrijving succesvol ontvangen!');
        setFormData({ naam: '', email: '', isStudent: false, isCompany: false });
      } else {
        setStatus(data.error || 'Inschrijving mislukt.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Serverfout tijdens inschrijving.');
    }
  };

  return (
    <div className="home">
      <main className="content">
        <h1>Career Launch Day 2025</h1>
        <p className="intro">
          korte en efficiënte uitleg<br />
          van wat het eigenlijk is.<br />
          Hier komt een afb. van vorige edities van
        </p>
        <p>
          Career Launch Days brengen studenten en werkzoekenden samen met werkgevers voor
          inspirerende ontmoetingen, boeiende workshops en waardevolle netwerkgesprekken.
        </p>

        <div className="faq">
          <h3>Hier komt een ‘FAQ’ met al gestelde vragen</h3>
          <ul>
            <li>Waar?</li>
            <li>Wanneer?</li>
            <li>Waarom?</li>
            <li>Hoe?</li>
          </ul>
        </div>

        <section className="form-section">
          <h3>Registreer je hier voor meer info over onze Career Launch Day!</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="naam"
              placeholder="Naam"
              value={formData.naam}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
            />
            <label>
              <input
                type="checkbox"
                name="isCompany"
                checked={formData.isCompany}
                onChange={handleChange}
              />
              Ik ben een bedrijf.
            </label>
            <label>
              <input
                type="checkbox"
                name="isStudent"
                checked={formData.isStudent}
                onChange={handleChange}
              />
              Ik ben een student.
            </label>
            <button type="submit">Registreren</button>
          </form>
          {status && <p className="status">{status}</p>}
        </section>
      </main>
    </div>
  );
}
