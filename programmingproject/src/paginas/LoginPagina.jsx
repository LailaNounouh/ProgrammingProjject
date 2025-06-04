  import PageTemplate from "/src/componenten/PageTemplate";
  import { useState } from "react";
  import "./loginpagina.css";

  export default function loginpagina() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      user_type: [],
    });

    function handleChange(e) {
      const { name, value, type, checked } = e.target;

      if (type === "checkbox") {
        setFormData((prev) => {
          const updated = checked
            ? [...prev.user_type, value]
            : prev.user_type.filter((v) => v !== value);
          return { ...prev, user_type: updated };
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }

    function handleSubmit(e) {
      e.preventDefault();
      console.log("Formulierdata:", formData);
    }

    return (
      <PageTemplate>
        <div className="container">
          <header>
            <h1>Career Launch Dag 2025</h1>
            <div className="intro">
              <p>Korte en efficiënte uitleg van wat het eigenlijk is.</p>
              <p>Hier komt een afh. van vorige edities van</p>
            </div>
          </header>

          <main>
            <div className="description">
              <p>
                Career Launch Days brengen studenten en werkzoekenden samen met
                werkgevers voor inspirerende ontmoetingen, boeiende workshops en
                waardevolle netwerkgesprekken.
              </p>
            </div>

            <div className="faq-tag">
              <h3>Veelgestelde vragen</h3>
              <p>Wat?</p>
              <p>Wanneer?</p>
              <p>Hoe?</p>
            </div>

            <div className="registration">
              <h2>
                Registreer je hier voor meer info over onze Career Launch Dag!
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Naam</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="checkbox-group">
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      id="company"
                      name="user_type"
                      value="company"
                      checked={formData.user_type.includes("company")}
                      onChange={handleChange}
                    />
                    <label htmlFor="company">Ik ben een bedrijf.</label>
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      id="student"
                      name="user_type"
                      value="student"
                      checked={formData.user_type.includes("student")}
                      onChange={handleChange}
                    />
                    <label htmlFor="student">Ik ben een student.</label>
                  </div>
                </div>

                <button type="submit">Registreren</button>
              </form>
            </div>
          </main>
        </div>
      </PageTemplate>
    );
  }
