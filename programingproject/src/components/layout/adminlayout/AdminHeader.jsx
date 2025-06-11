import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img 
          src="./public/afbeelding/logo-ehb.png" 
          alt="Logo" 
          className="logo"
          />
      </Link>

      <h1 className="admin-title">Admin</h1>

      <nav className={isOpen ? 'open' : ''}>
        <ul>
          <li><Link to="/admin/bedrijven">Deelnemende bedrijven</Link></li>
          <li><Link to="/admin/standen">Beheer van standen</Link></li>
          <li><Link to="/admin/users">Beheer van gebruikers</Link></li>
          <li><Link to="/admin/stats">Statistieken</Link></li>
        </ul>
      </nav>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>≡</div>
    </header>
  );
};

export default AdminHeader;
