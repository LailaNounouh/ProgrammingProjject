import React from 'react';
import './StatusBetaling.css';

const StatusBetaling = () => {
  return (
    <div className="payment-status-page">
      <header>
        <h1>Staat van betaling</h1>
      </header>
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
        </div>
      </div>
      <div className="divider"></div>
      <div className="payment-status">
        <h3>Betalingsproces</h3>
        <p>Factuur verzonden, in behandeling</p>
        <p>Betaald</p>
      </div>
    </div>
  );
};

export default StatusBetaling;
