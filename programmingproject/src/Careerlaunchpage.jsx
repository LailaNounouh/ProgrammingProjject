import { useState } from "react";
import "./style.css";

export default function CareerLaunchPage() {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    typeBedrijf: false,
    typeStudent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Inzending:", formData);
  };

  return (
    <div>
      <header>
        <div className="top-bar">
          <img src="logo.png" alt="Erasmus Logo" className="logo" />
          <div className="menu-icon">&#9776;</div>
        </div>
        <nav className="menu">
          <a href="#contact">Contact</a>
          <a href="#home">Home</a>
          <a href="#login">Login/Sign in</a>
        </nav>
      </header>

      <main>
        <section className="intro">
          <h1>Career Launch Day 2025</h1>
          <p>
            Welkom bij het carrière-event van het jaar! Hier verbinden we
            studenten en bedrijven op een inspirerende manier.
          </p>
          <p>
            Career Launch Days brengen studenten en werkzoekenden samen met
            werkgevers voor boeiende workshops, waardevolle netwerkmomenten en
            inspirerende gesprekken.
          </p>

          <div className="faq">
            <h2>Veelgestelde vragen</h2>
            <ul>
              <li><strong>Waar?</strong> EhB Campus Kanal</li>
              <li><strong>Wanneer?</strong> 10 maart 2025</li>
              <li><strong>Waarom?</strong> Ontmoet jouw toekomstige werkgever!</li>
              <li><strong>Hoe?</strong> Registreer je hieronder.</li>
            </ul>
          </div>
        </section>

        <section className="form-section">
          <p><strong>Registreer je hier voor meer info over onze Career Launch Day!</strong></p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="naam">Naam</label>
            <input
              type="text"
              id="naam"
              name="naam"
              value={formData.naam}
              onChange={handleChange}
              placeholder="Naam"
              required
            />

            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
              required
            />

            <label>
              <input
                type="checkbox"
                name="typeBedrijf"
                checked={formData.typeBedrijf}
                onChange={handleChange}
              />
              Ik ben een bedrijf
            </label>

            <label>
              <input
                type="checkbox"
                name="typeStudent"
                checked={formData.typeStudent}
                onChange={handleChange}
              />
              Ik ben een student
            </label>

            <button type="submit" className="submit-btn">Registreren</button>
          </form>
        </section>
      </main>
    </div>
  );
}
