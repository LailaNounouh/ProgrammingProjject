import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './QRChekIn.css';

const QRCheckIn = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    deelnemer_type: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);

  const eventId = searchParams.get('event');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!eventId) {
      setError('Geen geldig evenement gevonden in QR-code');
      return;
    }

    // Haal evenement informatie op
    fetchEventInfo();
  }, [eventId]);

  const fetchEventInfo = async () => {
    try {
      const response = await fetch('/api/qr/events');
      const data = await response.json();
      
      if (response.ok) {
        const event = data.events.find(e => e.id === parseInt(eventId));
        if (event) {
          setEventInfo(event);
        } else {
          setError('Evenement niet gevonden');
        }
      }
    } catch (err) {
      console.error('Fout bij ophalen evenement info:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.naam.trim() || !formData.email.trim()) {
      setError('Naam en e-mailadres zijn verplicht');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/qr/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          naam: formData.naam.trim(),
          email: formData.email.trim(),
          deelnemer_type: formData.deelnemer_type || null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          deelnemer: data.deelnemer,
          timestamp: data.timestamp
        });
        // Reset form
        setFormData({ naam: '', email: '', deelnemer_type: '' });
      } else {
        setError(data.error || 'Er is een fout opgetreden bij het registreren van uw aanwezigheid');
      }
    } catch (err) {
      setError('Netwerkfout bij het registreren van aanwezigheid');
      console.error('Check-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
    setFormData({ naam: '', email: '', deelnemer_type: '' });
  };

  if (!eventId) {
    return (
      <div className="qr-checkin-container">
        <div className="qr-checkin-card">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2>Ongeldige QR-code</h2>
            <p>Deze QR-code bevat geen geldige evenement informatie.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-checkin-container">
      <div className="qr-checkin-card">
        {eventInfo && (
          <div className="event-header">
            <h2>{eventInfo.naam}</h2>
            <div className="event-details">
              <p><strong>Datum:</strong> {new Date(eventInfo.datum).toLocaleDateString('nl-NL')}</p>
              {eventInfo.tijd && <p><strong>Tijd:</strong> {eventInfo.tijd}</p>}
              {eventInfo.locatie && <p><strong>Locatie:</strong> {eventInfo.locatie}</p>}
            </div>
          </div>
        )}

        {!result && !error && (
          <div className="checkin-form-section">
            <h3>Aanwezigheid registreren</h3>
            <p className="form-description">
              Vul uw gegevens in om uw aanwezigheid bij dit evenement te registreren.
            </p>

            <form onSubmit={handleSubmit} className="checkin-form">
              <div className="form-group">
                <label htmlFor="naam">Volledige naam *</label>
                <input
                  type="text"
                  id="naam"
                  name="naam"
                  value={formData.naam}
                  onChange={handleInputChange}
                  placeholder="Voer uw volledige naam in"
                  required
                  className="form-input"
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
                  placeholder="voornaam@voorbeeld.com"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="deelnemer_type">Ik ben een... (optioneel)</label>
                <select
                  id="deelnemer_type"
                  name="deelnemer_type"
                  value={formData.deelnemer_type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">-- Selecteer type (optioneel) --</option>
                  <option value="student">Student</option>
                  <option value="werkzoekende">Werkzoekende</option>
                  <option value="bedrijf">bedrijf</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !formData.naam.trim() || !formData.email.trim()}
              >
                {loading ? 'Bezig met registreren...' : 'Aanwezigheid registreren'}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="error-result">
            <div className="error-icon">❌</div>
            <h3>Registratie mislukt</h3>
            <p>{error}</p>
            <button onClick={resetForm} className="retry-btn">
              Probeer opnieuw
            </button>
          </div>
        )}

        {result && result.success && (
          <div className="success-result">
            <div className="success-icon">✅</div>
            <h3>Aanwezigheid geregistreerd!</h3>
            <div className="result-details">
              <p><strong>Naam:</strong> {result.deelnemer.naam}</p>
              <p><strong>E-mail:</strong> {result.deelnemer.email}</p>
              <p><strong>Type:</strong> {result.deelnemer.type === 'gast' ? 'Gast' : result.deelnemer.type}</p>
              {result.deelnemer.bestaande_deelnemer && (
                <p className="existing-user">✓ Bestaande gebruiker herkend</p>
              )}
              <p><strong>Geregistreerd op:</strong> {new Date(result.timestamp).toLocaleString('nl-NL')}</p>
            </div>
            <button onClick={resetForm} className="new-checkin-btn">
              Nieuwe registratie
            </button>
          </div>
        )}

        <div className="footer-info">
          <p>Heeft u problemen met de registratie? Neem contact op met de organisatie.</p>
        </div>
      </div>
    </div>
  );
};

export default QRCheckIn;