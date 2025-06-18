import React, { useState } from 'react';
import './StatusBetaling.css';
import { FiDownload, FiFile, FiX, FiCheckCircle } from 'react-icons/fi';
import { Sidebar } from './Sidebar/Sidebar';

const StatusBetaling = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB'
      });
      setShowUploadSuccess(true);
    }
  };

  return (
    <div className="payment-container">
      {/* Sidebar */}
      <div className="sidebar-container">
        <Sidebar 
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
      </div>

      {/* Main Content */}
      <main className="payment-content">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setShowMobileMenu(true)}
          className="mobile-menu-button"
        >
          ☰ Menu
        </button>

        {/* Payment Status Section */}
        <section className="payment-section">
          <h3>Staat van betaling</h3>
          
          <div className="payment-card">
            <h4>Betaalkaart</h4>
            <div className="payment-info">
              <span>Bedrag: €1.200</span>
              <span>Status: <span className="status-badge status-paid">Betaald</span></span>
            </div>
            
            <div className="payment-info">
              <span>Datum: 20 april 2025</span>
              <span>Methode: Overschrijving</span>
            </div>

            <div className="download-section">
              <p>Factuur downloaden (PDF)</p>
              <button 
                className="download-btn" 
                onClick={() => window.open('/pad/naar/factuur.pdf', '_blank')}
              >
                <FiDownload /> Factuur downloaden
              </button>
            </div>

            <div className="upload-section">
              <label htmlFor="file-upload" className="upload-label">
                Factuur uploaden
              </label>
              <input 
                id="file-upload" 
                type="file" 
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
              />
              
              {uploadedFile && (
                <div className="uploaded-file">
                  <FiFile />
                  <span>{uploadedFile.name}</span>
                  <span>{uploadedFile.size}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Payment Timeline Section */}
        <section className="payment-section">
          <h3>Betalingsproces</h3>
          
          <div className="payment-timeline">
            <div className="timeline-step completed">
              <div className="timeline-content">
                Factuur verzonden
                <div className="timeline-date">15 april 2025</div>
              </div>
            </div>

            <div className="timeline-step completed">
              <div className="timeline-content">
                Factuur in behandeling
                <div className="timeline-date">17 april 2025</div>
              </div>
            </div>

            <div className="timeline-step completed">
              <div className="timeline-content">
                Betaling ontvangen
                <div className="timeline-date">20 april 2025</div>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-content">
                Betaling verwerkt
                <div className="timeline-date">Verwacht: 22 april 2025</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Upload Success Popup */}
      {showUploadSuccess && (
        <div className="upload-popup">
          <div className="popup-content">
            <FiCheckCircle className="success-icon" />
            <h4>Uw factuur is succesvol geüpload!</h4>
            <p>Een bevestiging is verzonden naar uw e-mailadres.</p>
            <button 
              onClick={() => setShowUploadSuccess(false)}
              className="close-popup"
            >
              <FiX /> Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBetaling;