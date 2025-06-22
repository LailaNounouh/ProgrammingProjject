import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';  
import './StudentenHeader.css';


const StudentenHeader = () => {
  const { uitloggen } = useAuth();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

 return (
   <>
   <header className="student-header">
     <Link to="/" className="logo-link">
       <img
         src={`${import.meta.env.BASE_URL}afbeelding/erasmuslogo.png`}
         alt="Erasmus logo"
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
         <li><Link to="/student">Dashboard</Link></li>
         <li><Link to="/student/bedrijven">Deelnemende Bedrijven</Link></li>
         <li><Link to="/student/standen">Standen</Link></li>
         <li><Link to="/student/afspraken">Afspraak maken</Link></li>
         <li><Link to="/student/account">Account</Link></li>
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
