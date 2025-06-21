import React, { useState } from 'react';
import './StatusBetaling.css';
import { FiDownload, FiFile, FiArrowLeft } from 'react-icons/fi';

const StatusBetaling = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

 
  const betaling = {
    bedrag: "1200",
    status: "Betaald",
    datum: "20 april 2025",
    methode: "Overschrijving",
    factuur_url: "/uploads/factuur_2025.pdf",
    factuur_verzonden: "15 april 2025",
    in_behandeling: "17 april 2025",
    ontvangen: "20 april 2025",
    verwerkt: "22 april 2025"
  };

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
      <a href="/bedrijf" className="back-button">
        <FiArrowLeft /> Terug naar dashboard
      </a>

      <div className="payment-status">
        <h3>Staat van betaling</h3>
        <div className="payment-card">
          <h4>Betaalkaart</h4>
          <div className="payment-info">
            <span>Bedrag: €{betaling.bedrag}</span>
          </div>
          <div className="payment-info">
            <span>Status: <span className="status-badge status-paid">{betaling.status}</span></span>
            <span>Datum: {betaling.datum}</span>
          </div>
          <div className="payment-info">
            <span>Methode: {betaling.methode}</span>
          </div>
          <div className="download-section">
            <p>Factuur downloaden (PDF)</p>
            <button className="download-btn" onClick={() => window.open(betaling.factuur_url, '_blank')}>
              <FiDownload style={{ marginRight: '5px' }} />
              Factuur downloaden
            </button>
            {uploadedFile && (
              <div className="downloaded-file">
                <FiFile className="file-icon" />
                <div>
                  <div>{uploadedFile.name}</div>
                  <small>{uploadedFile.size}</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="payment-status">
        <h3>Betalingsproces</h3>
        <div className="payment-timeline">
          <div className="timeline-step completed">
            <div className="timeline-content">
              Factuur verzonden
              <div className="timeline-date">{betaling.factuur_verzonden}</div>
            </div>
          </div>
          <div className="timeline-step completed">
            <div className="timeline-content">
              Factuur in behandeling
              <div className="timeline-date">{betaling.in_behandeling}</div>
            </div>
          </div>
          <div className="timeline-step completed">
            <div className="timeline-content">
              Betaling ontvangen
              <div className="timeline-date">{betaling.ontvangen}</div>
            </div>
          </div>
          <div className="timeline-step">
            <div className="timeline-content">
              Betaling verwerkt
              <div className="timeline-date">Verwacht: {betaling.verwerkt}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBetaling;
