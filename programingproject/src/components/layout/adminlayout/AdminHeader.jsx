import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="admin-header">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img 
            src="/afbeelding/logo-ehb.png"
            alt="Logo" 
            className="logo"
          />
        </Link>
        
      </div>

      <nav className={isOpen ? 'open' : ''}>
        <ul>
          <li><Link to="/Admin/Bedrijf">Deelnemende bedrijven</Link></li>
          <li><Link to="/Admin/standen">Beheer van standen</Link></li>
          <li><Link to="/Admin/gebruikers">Beheer van gebruikers</Link></li>
          <li><Link to="/admin/stats">Statistieken</Link></li>
        </ul>
      </nav>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>≡</div>
    </header>
  );
};

export default AdminHeader;
