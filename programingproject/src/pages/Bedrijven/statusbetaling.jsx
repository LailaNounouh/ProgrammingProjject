import React, { useEffect, useState } from 'react';
import './StatusBetaling.css';
import { FiDownload, FiFile, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

const StatusBetaling = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [betalingData, setBetalingData] = useState(null);

  // Vervang dit met het bedrijf_id dat je wil ophalen (bijvoorbeeld ingelogd bedrijf)
  const bedrijfId = 1;

  useEffect(() => {
    const fetchBetaling = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/betaling/${bedrijfId}`);
        setBetalingData(response.data);
      } catch (err) {
        console.error('Fout bij ophalen betaling:', err);
      }
    };

    fetchBetaling();
  }, [bedrijfId]);

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
            <span>Bedrag: €{betalingData?.bedrag ?? '...'}</span>
          </div>

          <div className="payment-info">
            <span>
              Status:{' '}
              <span className={`status-badge ${betalingData?.status === 'Betaald' ? 'status-paid' : 'status-unpaid'}`}>
                {betalingData?.status ?? '...'}
              </span>
            </span>
            <span>Datum: {betalingData?.datum ?? '...'}</span>
          </div>

          <div className="payment-info">
            <span>Methode: {betalingData?.methode ?? '...'}</span>
          </div>

          <div className="download-section">
            <p>Factuur downloaden (PDF)</p>

            <button className="download-btn" onClick={() => window.open(betalingData?.factuur_url ?? '#', '_blank')}>
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
              <div className="timeline-date">{betalingData?.factuur_verzonden ?? '...'}</div>
            </div>
          </div>

          <div className="timeline-step completed">
            <div className="timeline-content">
              Factuur in behandeling
              <div className="timeline-date">{betalingData?.in_behandeling ?? '...'}</div>
            </div>
          </div>

          <div className="timeline-step completed">
            <div className="timeline-content">
              Betaling ontvangen
              <div className="timeline-date">{betalingData?.ontvangen ?? '...'}</div>
            </div>
          </div>

          <div className="timeline-step">
            <div className="timeline-content">
              Betaling verwerkt
              <div className="timeline-date">{betalingData?.verwerkt ?? '...'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBetaling;
