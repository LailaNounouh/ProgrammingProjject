import React, { useState, useEffect } from 'react';
import './CheckIn.css';

const CheckIn = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'student'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setSubmitStatus({
        type: 'error',
        message: 'Vul alle velden in om in te checken.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${baseUrl}/api/attendance/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Welkom bij de Career Launch Event! Je bent succesvol ingecheckt.'
        });
        // Clear form
        setFormData({
          name: '',
          email: '',
          type: 'student'
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Er is een fout opgetreden bij het inchecken.'
        });
      }
    } catch (error) {
      console.error('Check-in error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Netwerkfout. Probeer het opnieuw.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkin-page">
      <div className="checkin-container">
        <div className="welcome-header">
          <div className="logo-container">
            <img 
              src="/afbeelding/logo-ehb.png" 
              alt="EHB Logo" 
              className="event-logo"
            />
          </div>
          <h1>Welkom bij de Career Launch Event!</h1>
          <p className="welcome-subtitle">
            Check hier in om deel te nemen aan ons netwerkevent waar studenten en bedrijven elkaar ontmoeten.
          </p>
        </div>

        <div className="checkin-form-container">
          {submitStatus && (
            <div className={`status-message ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          {submitStatus?.type !== 'success' && (
            <form onSubmit={handleSubmit} className="checkin-form">
              <div className="form-group">
                <label htmlFor="name">Volledige Naam *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Voer je volledige naam in"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mailadres *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="je.naam@voorbeeld.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Ik ben een *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="werkzoekende">Werkzoekende</option>
                  <option value="bezoeker">Bezoeker</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="checkin-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Bezig met inchecken...' : 'Check In'}
              </button>
            </form>
          )}

          {submitStatus?.type === 'success' && (
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h3>Inchecken Gelukt!</h3>
              <p>Je bent nu officieel aanwezig bij de Career Launch Event.</p>
              <div className="event-info">
                <h4>Wat kun je verwachten?</h4>
                <ul>
                  <li>Netwerken met professionals uit verschillende sectoren</li>
                  <li>Informatie over stage- en carrièremogelijkheden</li>
                  <li>Speed dating sessies met bedrijven</li>
                  <li>Workshops en presentaties</li>
                </ul>
              </div>
              <button 
                className="new-checkin-button"
                onClick={() => {
                  setSubmitStatus(null);
                  setFormData({
                    name: '',
                    email: '',
                    type: 'student'
                  });
                }}
              >
                Nieuwe Check-in
              </button>
            </div>
          )}
        </div>

        <div className="event-details">
          <h3>Event Informatie</h3>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Datum:</strong>
              <span>{new Date().toLocaleDateString('nl-NL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="detail-item">
              <strong>Locatie:</strong>
              <span>Erasmushogeschool Brussel</span>
            </div>
            <div className="detail-item">
              <strong>Tijd:</strong>
              <span>10:00 - 16:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;