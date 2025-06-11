import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../button/logoutbutton.jsx';
import './StudentenHeader.css';

const StudentenHeader = () => {
  return (
    <header className="header">
       <Link to="/" className="logo-link">
        <img 
          src="./public/afbeelding/logo-ehb.png" 
          alt="Logo" 
          className="logo"
          />
      </Link>
      <nav>
        <ul>
          <li><Link to="/student/bedrijven">Deelnemende Bedrijven</Link></li>
          <li><Link to="/student/standen">Standen</Link></li>
          <li><Link to="/student/afspraak">Afspraak maken</Link></li>
          <li><LogoutButton /></li>
        </ul>
      </nav>
      
    </header>
  );
};

export default StudentenHeader;