import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <header className="header">
        <img src="/logo.png" alt="Erasmus logo" className="logo" />
    
      </header>

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
          <form>
            <input type="text" placeholder="Naam" />
            <input type="email" placeholder="E-mail" />
            <label><input type="checkbox" /> Ik ben een bedrijf.</label>
            <label><input type="checkbox" /> Ik ben een student.</label>
            <button type="submit">Registreren</button>
          </form>
        </section>
      </main>
    </div>
  );
}