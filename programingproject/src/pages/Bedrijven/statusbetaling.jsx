import React, { useState } from 'react';
import './StatusBetaling.css';
import './Sidebar/Sidebar.css'; 
import { FiDownload, FiFile, FiArrowLeft } from 'react-icons/fi';
import { Sidebar } from './Sidebar/Sidebar'; 

 

const StatusBetaling = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

      {/* === MOBILE OVERLAY === */}
      {showMobileMenu && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* === SIDEBAR === */}
      <Sidebar
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* === MOBILE MENU KNOP === */}
      <button
        onClick={() => setShowMobileMenu(true)}
        className="mobile-menu-button"
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 101,
          background: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          cursor: 'pointer'
        }}
      >
        ☰ Menu
      </button>

      {/* === Terugknop naar dashboard === */}
      <a href="/bedrijf" className="back-button">
        <FiArrowLeft /> Terug naar dashboard
      </a>

      {/* === Betalingsinformatie === */}
      <div className="payment-status">
        <h3>Staat van betaling</h3>

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
                  <small>{uploadedFile.size}</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* === Tijdlijn === */}
      <div className="payment-status">
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
      </div>
    </div>
  );
};

export default StatusBetaling;
