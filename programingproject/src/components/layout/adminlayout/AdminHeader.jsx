import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider'; // indien nodig
import './AdminHeader.css';

const AdminHeader = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 50);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return null;

  return (
    <>
      <header className="admin-header">
        <Link to="/">
          <img src="/afbeelding/logo-ehb.png" alt="Logo" className="logo" />
        </Link>

        <button className="hamburger" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          ☰
        </button>

        <nav className={showMobileMenu ? 'show' : ''}>
          <ul>
            <li><Link to="/Admin">Dashboard</Link></li>
            <li><Link to="/Admin/Bedrijf">Deelnemende bedrijven</Link></li>
            <li><Link to="/Admin/standen">Beheer van standen</Link></li>
            <li><Link to="/Admin/gebruikers">Beheer van gebruikers</Link></li>
            <li><Link to="/Admin/statistiek">Statistieken</Link></li>
            <li><Link to="/Admin/attendance">Aanwezigheid</Link></li>
            <li><Link to="/Admin/sectoren">Beheer van sectoren</Link></li>
            <li>
              <button onClick={() => setShowLogoutPopup(true)} className="logout-link">
                Uitloggen
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <p>Weet je zeker dat je wilt uitloggen?</p>
            <button onClick={logout} className="confirm-button">Bevestig uitloggen</button>
            <button onClick={() => setShowLogoutPopup(false)} className="cancel-button">Annuleer</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
