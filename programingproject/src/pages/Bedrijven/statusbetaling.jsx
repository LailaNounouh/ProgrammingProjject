import React, { useEffect, useState, useRef } from 'react';
import './StatusBetaling.css';
import { FiDownload, FiFile } from 'react-icons/fi';
import axios from 'axios';

const StatusBetaling = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [betalingData, setBetalingData] = useState(null);
  const [progressHeight, setProgressHeight] = useState(0);
  const timelineRef = useRef(null);

  const bedrijfId = 1;

  useEffect(() => {
    const fetchBetaling = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/betaling/${bedrijfId}`);
        setBetalingData(response.data);
        
        // Start animatie na data laden
        setTimeout(() => {
          calculateProgress(response.data.status);
        }, 300);
      } catch (err) {
        console.error('Fout bij ophalen betaling:', err);
      }
    };

    fetchBetaling();
  }, [bedrijfId]);

  const calculateProgress = (status) => {
    if (!timelineRef.current) return;

   const statusOrder = [
  'factuur_verzonden',
  'in_behandeling',
  'ontvangen',
  'verwerkt'
];
    
    const currentStatusIndex = statusOrder.indexOf(status);
    const steps = timelineRef.current.querySelectorAll('.timeline-step');
    
    if (currentStatusIndex >= 0 && steps.length > 0) {
      let totalHeight = 0;
      
      // Bereken hoogte tot de huidige stap
      for (let i = 0; i < currentStatusIndex; i++) {
        if (steps[i]) {
          totalHeight += steps[i].offsetHeight;
        }
      }
      
      // Voeg deel van huidige stap toe voor progressie-effect
      if (currentStatusIndex < steps.length) {
        totalHeight += steps[currentStatusIndex].offsetHeight * 0.5;
      }
      
      setProgressHeight(totalHeight);
    }
  };

  const getStepStatus = (stepName) => {
    if (!betalingData?.status) return '';
    
    const statusOrder = [
      'Factuur verzonden',
      'Factuur in behandeling',
      'Betaling ontvangen',
      'Betaling verwerkt'
    ];
    
    const currentStatusIndex = statusOrder.indexOf(betalingData.status);
    const stepIndex = statusOrder.indexOf(stepName);
    
    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'current';
    return '';
  };

  // Herbereken bij resize
  useEffect(() => {
    const handleResize = () => {
      if (betalingData?.status) {
        calculateProgress(betalingData.status);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [betalingData]);

  return (
    <div className="payment-status-page">
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
              <span className={`status-badge ${betalingData?.status === 'Betaald' ? 'status-paid' : ''}`}>
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
        
        <div className="payment-timeline" ref={timelineRef}>
          {/* Animated progress line */}
          <div 
            className="timeline-progress" 
            style={{ height: `${progressHeight}px` }}
          ></div>

          <div className={`timeline-step ${getStepStatus('Factuur verzonden')}`}>
            <div className="timeline-content">
              <strong>Factuur verzonden</strong>
              <div className="timeline-date">{betalingData?.factuur_verzonden ?? '...'}</div>
            </div>
          </div>

          <div className={`timeline-step ${getStepStatus('Factuur in behandeling')}`}>
            <div className="timeline-content">
              <strong>Factuur in behandeling</strong>
              <div className="timeline-date">{betalingData?.in_behandeling ?? '...'}</div>
            </div>
          </div>

          <div className={`timeline-step ${getStepStatus('Betaling ontvangen')}`}>
            <div className="timeline-content">
              <strong>Betaling ontvangen</strong>
              <div className="timeline-date">{betalingData?.ontvangen ?? '...'}</div>
            </div>
          </div>

          <div className={`timeline-step ${getStepStatus('Betaling verwerkt')}`}>
            <div className="timeline-content">
              <strong>Betaling verwerkt</strong>
              <div className="timeline-date">{betalingData?.verwerkt ?? '...'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBetaling;