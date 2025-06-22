import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';  
import './StudentenHeader.css';


const StudentenHeader = () => {
  const { uitloggen } = useAuth();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const closeMobileMenu = () => setShowMobileMenu(false);

 return (
   <>
   <header className="student-header">
     <Link to="/" className="logo-link">
       <img
         src="/afbeelding/logo-ehb.png"
         alt="EHB Logo"
         className="logo"
       />
     </Link>

     <button
          className="hamburger"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          ☰
     </button>

     <nav className={showMobileMenu ? 'show' : ''}>
       <ul>
         <li><Link to="/student" onClick={closeMobileMenu}>Dashboard</Link></li>
         <li><Link to="/student/bedrijven" onClick={closeMobileMenu}>Deelnemende Bedrijven</Link></li>
         <li><Link to="/student/standen" onClick={closeMobileMenu}>Standen</Link></li>
         <li><Link to="/student/afspraken" onClick={closeMobileMenu}>Afspraak maken</Link></li>
         <li><Link to="/student/account" onClick={closeMobileMenu}>Account</Link></li>
         <li>
            <button
                onClick={() => setShowLogoutPopup(true)}
                className="logout-link"
            >
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

export default StudentenHeader;
