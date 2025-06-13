import React from "react";
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact</h1>

      <div className="contact-info">
        <p>Heb je vragen of opmerkingen over Career Launch?</p> 
        <p>Contacteer ons via onderstaande gegevens.</p>
        <p><strong>Email:</strong> info@careerlaunch.be</p>
        <p><strong>Telefoon:</strong> +32 123 45 67 89</p>
        <p><strong>Adres:</strong><br />
        Nijverheidskaai 5, 1000 Brussel</p>
      </div>
    
      <div className="contact-form">
        <h2>Contactformulier:</h2>
        <form action="#" method="post">
          <div className="form-group">
            <label htmlFor="name">Naam</label>
            <input type="text" id="name" name="name" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Onderwerp</label>
            <input type="text" id="subject" name="subject" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Bericht</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          
          <button type="submit">Verzenden</button>
        </form>
      </div>
    </div>
  );
}