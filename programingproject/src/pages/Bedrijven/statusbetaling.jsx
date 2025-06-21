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

  const statusColors = {
    Betaald: "status-paid",
    "In behandeling": "status-pending",
    "Verwerkt": "status-processed"
  };

 
  const timelineSteps = [
    { label: "Factuur verzonden", date: betaling.factuur_verzonden },
    { label: "Factuur in behandeling", date: betaling.in_behandeling },
    { label: "Betaling ontvangen", date: betaling.ontvangen },
    { label: "Betaling verwerkt", date: `Verwacht: ${betaling.verwerkt}` }
  ];
  const completedIndex = betaling.status === "Betaald" ? 2
    : betaling.status === "Verwerkt" ? 3
    : betaling.status === "In behandeling" ? 1
    : 0;

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
            <span>
              Status: <span className={`status-badge ${statusColors[betaling.status] || ""}`}>{betaling.status}</span>
            </span>
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
          {timelineSteps.map((step, idx) => (
            <div
              key={step.label}
              className={`timeline-step${idx <= completedIndex ? " completed" : ""}`}
            >
              <div className="timeline-content">
                {step.label}
                <div className="timeline-date">{step.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusBetaling;
