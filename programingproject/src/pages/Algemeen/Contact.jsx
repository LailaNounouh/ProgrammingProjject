import React from "react";
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact">
      <div className="contact-content">
        <h1>Contact</h1>
        <p>Heb je vragen of opmerkingen? Neem contact met ons op via het onderstaande formulier.</p>
        <form>
          <label htmlFor="name">Naam:</label>
          <input type="text" id="name" name="name" required />
          
          <label htmlFor="email">E-mail:</label>
          <input type="email" id="email" name="email" required />
          
          <label htmlFor="message">Bericht:</label>
          <textarea id="message" name="message" required></textarea>
          
          <button type="submit">Verzenden</button>
        </form>
      </div>
    </div>
  );
}