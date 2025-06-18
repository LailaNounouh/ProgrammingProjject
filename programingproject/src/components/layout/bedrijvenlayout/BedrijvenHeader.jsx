import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import './BedrijvenHeader.css';

const Header = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

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

        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>

            {user ? (
              <>
                <li><Link to={`/${user.role}`}>Dashboard</Link></li>
                <li><Link to={`/${user.role}/profiel`}>Account</Link></li>
                <li>
                  <button onClick={() => setShowLogoutPopup(true)} className="logout-link">
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login">Sign In</Link></li>
            )}
          </ul>
        </nav>
      </header>

      {/* Popup */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <p>Weet je zeker dat je wilt uitloggen?</p>
            <button onClick={logout} className="confirm-button">Ja, log uit</button>
            <button onClick={() => setShowLogoutPopup(false)} className="cancel-button">Annuleer</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
