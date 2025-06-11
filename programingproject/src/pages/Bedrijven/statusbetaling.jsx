import React from 'react';
import './statusbetaling.css';

const StatusBetaling = () => {
  return (
    <div className="payment-status-page">
      <div className="payment-status">
        {/* payment cards */}
      </div>
      <div className="payment-card">
  <div className="payment-info">
    <span>Factuur F2023-0456</span>
    {/*status badge */}
  </div>
  <div>
    <span>Bedrag: €1200</span> | <span>Datum: 20-04-2023</span>
  </div>
</div>

    </div>
    
  );
};

export default StatusBetaling;
