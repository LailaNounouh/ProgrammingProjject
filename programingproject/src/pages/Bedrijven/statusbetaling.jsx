import React, { useEffect, useState, useRef } from 'react';
import './StatusBetaling.css';
import { FiDownload, FiFile } from 'react-icons/fi';
import apiClient from '../../utils/apiClient';
import { useAuth } from '../../context/AuthProvider';

const StatusBetaling = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [betalingData, setBetalingData] = useState(null);
  const [progressHeight, setProgressHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const timelineRef = useRef(null);

  const { gebruiker } = useAuth();

  useEffect(() => {
    const fetchBetaling = async () => {
      try {
        if (!gebruiker?.id) return;
        const resp = await apiClient.get(`/betaling/${gebruiker.id}`);
        const data = resp?.data ?? resp;
        setBetalingData(data);

        const statusen = data.statusen || [];
        const completedSteps = statusen.filter(s => s.completed).length;
        const newHeight = Math.max(0, (completedSteps - 1) * 72);

        setTimeout(() => {
          setProgressHeight(newHeight);
        }, 300);
      } catch (err) {
        console.error('Fout bij ophalen betaling:', err);
      }
    };

    fetchBetaling();
  }, [gebruiker]);

  const getStepStatus = (stepName) => {
    if (!betalingData?.status) return '';
    const statusOrder = ['factuur_verzonden', 'in_behandeling', 'ontvangen', 'verwerkt'];
    const currentStatusIndex = statusOrder.indexOf(betalingData.status);
    const stepIndex = statusOrder.indexOf(stepName);

    if (stepIndex === -1) return '';
    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'current';
    return '';
  };

  useEffect(() => {
    const handleResize = () => {
      if (betalingData?.statusen) {
        const completedSteps = betalingData.statusen.filter(s => s.completed).length;
        const newHeight = Math.max(0, (completedSteps - 1) * 72);
        setProgressHeight(newHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [betalingData]);

  const handleDownloadClick = () => {
    setShowModal(true);
  };

  return (
    <div className="payment-status-page">
      <div className="payment-status-container">
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
                <span className={`status-badge ${betalingData?.status === 'betaald' ? 'status-paid' : ''}`}>
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
              <button className="download-btn" onClick={handleDownloadClick}>
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

        <div className="payment-status">
          <h3>Betalingsproces</h3>

          <div className="payment-timeline" ref={timelineRef}>
            <div className="timeline-progress" style={{ height: `${progressHeight}px` }} />

            {['factuur_verzonden', 'in_behandeling', 'ontvangen', 'verwerkt'].map((step) => (
              <div key={step} className={`timeline-step ${getStepStatus(step)}`}>
                <div className="timeline-content">
                  <strong>
                    {{
                      factuur_verzonden: 'Factuur verzonden',
                      in_behandeling: 'Factuur in behandeling',
                      ontvangen: 'Betaling ontvangen',
                      verwerkt: 'Betaling verwerkt',
                    }[step]}
                  </strong>
                  <div className="timeline-date">{betalingData?.[step] ?? '...'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Factuur</h3>
            <p>U ontvangt de factuur binnenkort via e-mail.</p>
            <button onClick={() => setShowModal(false)}>Sluiten</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBetaling;
