import React, { useState, useEffect } from 'react';
import './eventGenerator.css';

const EventQRGenerator = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [qrResult, setQrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/qr/events');
      const data = await response.json();
      
      if (response.ok) {
        setEvents(data.events);
      } else {
        setError('Fout bij ophalen evenementen');
      }
    } catch (err) {
      setError('Netwerkfout bij ophalen evenementen');
      console.error('Events fetch error:', err);
    }
  };

  const generateEventQR = async () => {
    if (!selectedEvent) {
      setError('Selecteer eerst een evenement');
      return;
    }

    setLoading(true);
    setError(null);
    setQrResult(null);

    try {
      const event = events.find(e => e.id === parseInt(selectedEvent));
      
      const response = await fetch('/api/qr/generate-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: selectedEvent,
          event_naam: event.naam
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setQrResult(data);
      } else {
        setError(data.error || 'Fout bij genereren QR-code');
      }
    } catch (err) {
      setError('Netwerkfout bij genereren QR-code');
      console.error('QR generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrResult?.qr_code_image) return;

    const link = document.createElement('a');
    link.download = `qr-code-${qrResult.event_naam.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = qrResult.qr_code_image;
    link.click();
  };

  const printQRCode = () => {
    if (!qrResult) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR-code - ${qrResult.event_naam}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 2rem;
              margin: 0;
            }
            .qr-print-container {
              max-width: 400px;
              margin: 0 auto;
            }
            h1 { 
              color: #00aeb3; 
              margin-bottom: 1rem;
              font-size: 1.5rem;
            }
            .qr-image { 
              width: 300px; 
              height: 300px; 
              margin: 2rem auto;
              border: 2px solid #00aeb3;
              padding: 1rem;
            }
            .instructions {
              margin-top: 2rem;
              font-size: 1.1rem;
              line-height: 1.5;
            }
            .url {
              font-family: monospace;
              background: #f5f5f5;
              padding: 0.5rem;
              border-radius: 4px;
              word-break: break-all;
              margin: 1rem 0;
            }
          </style>
        </head>
        <body>
          <div class="qr-print-container">
            <h1>${qrResult.event_naam}</h1>
            <p><strong>Evenement QR-code voor aanwezigheidsregistratie</strong></p>
            <img src="${qrResult.qr_code_image}" alt="QR Code" class="qr-image">
            <div class="instructions">
              <p><strong>Instructies:</strong></p>
              <p>1. Plaats deze QR-code bij de ingang van het evenement</p>
              <p>2. Deelnemers scannen de code met hun smartphone</p>
              <p>3. Ze vullen hun naam en e-mail in om aanwezigheid te registreren</p>
              <p>4. Zowel geregistreerde als nieuwe bezoekers kunnen zich aanmelden</p>
            </div>
            <div class="url">
              <strong>Direct link:</strong><br>
              ${qrResult.qr_code_url}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const resetGenerator = () => {
    setQrResult(null);
    setError(null);
    setSelectedEvent('');
  };

  return (
    <div className="event-qr-generator-container">
      <div className="event-qr-generator-card">
        <h2>Evenement QR-code Generator</h2>
        <p className="subtitle">Genereer een algemene QR-code voor aanwezigheidsregistratie</p>

        {!qrResult && (
          <div className="generator-section">
            <div className="event-selection">
              <h3>Selecteer Evenement</h3>
              <select 
                value={selectedEvent} 
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="event-select"
              >
                <option value="">-- Kies een evenement --</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.naam} ({new Date(event.datum).toLocaleDateString('nl-NL')})
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={generateEventQR}
              className="generate-btn"
              disabled={loading || !selectedEvent}
            >
              {loading ? 'QR-code genereren...' : 'Genereer QR-code'}
            </button>

            <div className="info-section">
              <h4>Hoe werkt het?</h4>
              <ul>
                <li>Genereer één QR-code per evenement</li>
                <li>Plaats de QR-code bij de ingang</li>
                <li>Deelnemers scannen de code en vullen hun gegevens in</li>
                <li>Zowel geregistreerde als nieuwe bezoekers kunnen zich aanmelden</li>
                <li>Bekijk alle aanwezigen in het admin overzicht</li>
              </ul>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        {qrResult && (
          <div className="qr-result-section">
            <div className="qr-success">
              <div className="success-icon">✅</div>
              <h3>QR-code gegenereerd!</h3>
              <p><strong>Evenement:</strong> {qrResult.event_naam}</p>
            </div>

            <div className="qr-display">
              <img 
                src={qrResult.qr_code_image} 
                alt="Evenement QR Code" 
                className="qr-image"
              />
            </div>

            <div className="qr-actions">
              <button onClick={downloadQRCode} className="action-btn download-btn">
                Download QR-code
              </button>
              <button onClick={printQRCode} className="action-btn print-btn">
                Print QR-code
              </button>
            </div>

            <div className="qr-info">
              <h4>QR-code Details</h4>
              <div className="info-item">
                <strong>URL:</strong>
                <div className="url-display">{qrResult.qr_code_url}</div>
              </div>
              <p className="usage-note">
                Deze QR-code leidt deelnemers naar een webpagina waar ze hun naam en e-mail kunnen invoeren 
                om hun aanwezigheid te registreren.
              </p>
            </div>

            <button onClick={resetGenerator} className="new-qr-btn">
              Nieuwe QR-code genereren
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventQRGenerator;