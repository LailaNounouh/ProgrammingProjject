import React, { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Hier kan je formulierdata verzenden via API, etc.
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  }

  return (
    <div className="contact home">
      <div className="contact-content">
        <h1>Contact</h1>
        <p>Heb je vragen of opmerkingen? Neem contact met ons op via het onderstaande formulier.</p>

        {submitted && <p className="success-message">Bedankt voor je bericht! We nemen snel contact met je op.</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Naam:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Jouw naam"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="voorbeeld@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Bericht:</label>
            <textarea
              id="message"
              name="message"
              placeholder="Schrijf hier je bericht"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit">Verzenden</button>
        </form>
      </div>
    </div>
  );
}
