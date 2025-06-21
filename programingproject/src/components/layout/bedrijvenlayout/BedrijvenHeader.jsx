import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import './BedrijvenHeader.css';

const Header = () => {
  const { uitloggen } = useAuth();
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
      <header className="header">
        <Link to="/">
          <img src="/afbeelding/logo-ehb.png" alt="Logo" className="logo" />
        </Link>

        <button className="hamburger" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          ☰
        </button>

        <nav className={showMobileMenu ? 'show' : ''}>
          <ul>
            <li><Link to="/bedrijf">Dashboard</Link></li>
            <li><Link to="/bedrijf/betaling">Staat van betaling</Link></li>
            <li><Link to="/bedrijf/afspraken">Afspraakoverzicht</Link></li>
            <li><Link to="/bedrijf/standen">Standenbeheer</Link></li>
            <li><Link to="/bedrijf/Settingsbedrijf">Bedrijfsinstellingen</Link></li>
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
            <button onClick={uitloggen} className="confirm-button">Bevestig uitloggen</button>
            <button onClick={() => setShowLogoutPopup(false)} className="cancel-button">Annuleer</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
