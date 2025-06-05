import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import "Home.css";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userTypeCompany: false,
    userTypeStudent: false,
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
    // Hier kan je fetch/axios call toevoegen
  };

  return (
    <Layout>
      <div className="description">
        <p>
          Career Launch Days brengen studenten en werkzoekenden samen met
          werkgevers voor inspirerende ontmoetingen, boeiende workshops en
          waardevolle netwerkgesprekken.
        </p>
      </div>

      <div className="faq-tag">
        <h3>Hier komt een TAG met al gestelde vragen</h3>
        <p>Wat?</p>
        <p>Wanneer?</p>
        <p>Hoe?</p>
      </div>

      <div className="registration">
        <h2>Registreer je hier voor meer info over onze Career Launch Day!</h2>

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
                name="userTypeCompany"
                checked={formData.userTypeCompany}
                onChange={handleChange}
              />
              <label htmlFor="company">Ik ben een bedrijf.</label>
            </div>
            <div className="checkbox-option">
              <input
                type="checkbox"
                id="student"
                name="userTypeStudent"
                checked={formData.userTypeStudent}
                onChange={handleChange}
              />
              <label htmlFor="student">Ik ben een student.</label>
            </div>
          </div>

          <button type="submit">Registreren</button>
        </form>
      </div>
    </Layout>
  );
}
