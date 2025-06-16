import React from "react";
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact</h1>

     <p className="contact-intro">Heb je vragen of opmerkingen over Career Launch?</p>
      <p className="contact-intro">Contacteer ons via onderstaande gegevens.</p>

      <div className="divider"></div>
          
      <div className="contact-details">
        <p><strong>E-mail:</strong> info@careerlaunch.be</p>
        <p><strong>Telefoon:</strong> +32 123 45 67 89</p>
        
        <div className="address-section">
          <p><strong>Adres:</strong> Nijverheidskaai 170, 1070 Anderlecht</p>
          
          <div className="google-maps">
            <iframe 
              title="School Locatie"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.724983072194!2d4.312223315746278!3d50.8635758795329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c5e5a5e5e5e5%3A0x5e5e5e5e5e5e5e5!2sNijverheidskaai%20170%2C%201070%20Anderlecht!5e0!3m2!1snl!2sbe!4v1620000000000!5m2!1snl!2sbe"
              width="600" 
              height="450" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy">
            </iframe>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="contact-form-section">
        <h2>Contactformulier</h2>
      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
         <label htmlFor="name">Naam</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="Vul uw naam in" 
            required 
          />
        </div>
    
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
           <input 
             type="email" 
             id="email" 
             name="email" 
             placeholder="Vul uw e-mailadres in" 
             required 
            />
        </div>
    
        <div className="form-group">
          <label htmlFor="message">Bericht</label>
            <textarea 
              id="message" 
              name="message" 
              placeholder="Typ hier uw bericht..." 
              rows="5"
              required
            ></textarea>
        </div>
    
        <button type="submit" className="submit-button">Verzenden</button>
      </form>
     </div>
    </div>
  );
} 