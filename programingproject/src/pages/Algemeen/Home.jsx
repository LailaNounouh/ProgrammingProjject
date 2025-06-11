import React, { useState } from 'react';
import './Home.css';
import { baseUrl } from '../../config';

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
      const response = await fetch(`${baseUrl}/registratie`, {
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
      <div className="banner-container">
    <img 
      src="/afbeelding/AfbCarreerLaunch.png" 
      alt="Career Launch Day banner" 
      className="banner-image"
    />
  </div>
  
  <div className="info-box">
    <h2>Welkom bij Career Launch Day 2026</h2>
    <p>Ontdek, ontmoet en lanceer je carrière!</p>
  </div>
          
      <main className="content">
        <div className="description">
          <p>Op <span className="highlight">Vrijdag 13 maart 2026</span> organiseert de Erasmus Hogeschool Brussel 
            een inspirerende Career Launch Day voor alle studenten van de opleidingen Design & Technologie. 
            Tijdens deze dag krijg je de kans om kennis te maken met toonaangevende bedrijven, 
            deel te nemen aan interactieve workshops en je netwerk uit te breiden met professionals uit het werkveld.
          </p>
          
          <p>Of je nu op zoek bent naar een stage, een eerste job, of gewoon inspiratie wilt opdoen voor je toekomst: 
            de Career Launch Day is dé plek om je carrière een vliegende start te geven!</p>

          <p>De Career Launch Day brengt studenten uit zes topopleidingen samen:</p>
          <ul className="opleidingen-lijst">
            <li>Bachelor in de Multimedia & Creatieve Technologie</li>
            <li>Bachelor in de Toegepaste Informatica</li>
            <li>Graduaat Elektromechanische Systemen</li>
            <li>Graduaat Internet of Things</li>
            <li>Graduaat Programmeren</li>
            <li>Graduaat Systeem- & Netwerkbeheer</li>
          </ul>
          
          <p>Het event biedt je de mogelijkheid om jezelf te presenteren aan een breed groep potentiële werkgevers, 
            stageplaatsen te ontdekken, bachelorproefpartners te vinden en waardevolle contacten te leggen met bedrijven 
            uit de technische en IT-sector. Tijdens de interactieve workshops doe je praktische vaardigheden op en 
            krijg je de kans om te leren van experts uit de industrie.
          </p>
        </div>

        <div className="cta-box">
          Zet de datum alvast in je agenda en schrijf je snel in!<br />
          Samen bouwen we aan jouw toekomst.
        </div>

        <div className="faq-section">
          <h2>FAQ - Veelgestelde vragen</h2>
          
          <div className="faq-item">
            <div className="faq-question">Waar?</div>
            <p>De Career Launch Day vindt plaats op de campus van Erasmus Hogeschool Brussel, Nijverheidskaai 170, 1070 Anderlecht.</p>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">Wanneer?</div>
            <p>Vrijdag 13 maart 2026, van 10:00 tot 16:00.</p>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">Waarom?</div>
            <p>De Career Launch Day is dé kans om bedrijven te ontmoeten, je netwerk uit te breiden, 
              en alles te weten te komen over stage- en jobmogelijkheden binnen jouw vakgebied.</p>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">Hoe?</div>
            <p>Schrijf je vooraf in via het inschrijvingsformulier. Op de dag zelf ontvang je een programma met alle workshops, 
              infosessies en bedrijven die aanwezig zijn.</p>
          </div>
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
