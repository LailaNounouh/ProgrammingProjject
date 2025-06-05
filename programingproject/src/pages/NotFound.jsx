import React from 'react';
import Header from '../components/layout/Header'; 
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <Header />
      <div className="not-found-content">
        <h1>404 - Pagina niet gevonden</h1>
        <p>Sorry, de pagina die je zoekt bestaat niet.</p>
      </div>
    </div>
  );
}
