import React, { useState } from 'react';
import './StatusBetaling.css';
import { FiDownload, FiFile, FiArrowLeft } from 'react-icons/fi';

const StatusBetaling = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB'
      });
    }
  };

  return (
    <div className="payment-status-page">
      {/* Terugknop met correcte import */}
      <a href="/bedrijf" className="back-button">
        <FiArrowLeft /> Terug naar dashboard
      </a>


      {/* Pagina header 
      <header>
        <h1>Staat van betaling</h1>
      </header>*/}
      
      {/* Betalingsinformatie sectie */}
      <div className="payment-status">
        <h3>Staat van betaling</h3>
        
        {/* Betaalkaart met alle details */}
        <div className="payment-card">
          <h4>Betaalkaart</h4>
          
          <div className="payment-info">
            <span>Bedrag: €1.200</span>
          </div>
          
          <div className="payment-info">
            <span>Status: <span className="status-badge status-paid">Betaald</span></span>
            <span>Datum: 20 april 2025</span>
          </div>
          
          <div className="payment-info">
            <span>Methode: Overschrijving</span>
          </div>
          
            
          <div className="download-section">
  <p>Factuur downloaden (PDF)</p>
  
  <button className="download-btn" onClick={() => window.open('/pad/naar/factuur.pdf', '_blank')}>
    <FiDownload style={{ marginRight: '5px' }} />
    Factuur downloaden
  </button>
  
  {uploadedFile && (
    <div className="downloaded-file">
      <FiFile className="file-icon" />
      <div>
        <div>Factuur_2025.pdf</div>
        <small>378,30 KB</small>
      </div>
    </div>
  )}
</div>
          
        </div>
      </div>
      
      {/* Scheidingslijn tussen secties */}
      <div className="divider"></div>
      
      {/* Betalingsproces tijdlijn */}
      <div className="payment-status">
        <h3>Betalingsproces</h3>
        
        <div className="payment-timeline">
          {/* Stap 1 - Factuur verzonden */}
          <div className="timeline-step completed">
            <div className="timeline-content">
              Factuur verzonden
              <div className="timeline-date">15 april 2025</div>
            </div>
          </div>
          
          {/* Stap 2 - In behandeling */}
          <div className="timeline-step completed">
            <div className="timeline-content">
              Factuur in behandeling
              <div className="timeline-date">17 april 2025</div>
            </div>
          </div>
          
          {/* Stap 3 - Betaling ontvangen */}
          <div className="timeline-step completed">
            <div className="timeline-content">
              Betaling ontvangen
              <div className="timeline-date">20 april 2025</div>
            </div>
          </div>
          
          {/* Stap 4 - Betaling verwerkt */}
          <div className="timeline-step">
            <div className="timeline-content">
              Betaling verwerkt
              <div className="timeline-date">Verwacht: 22 april 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBetaling;