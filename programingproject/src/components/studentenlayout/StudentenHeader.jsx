import React from 'react';
import { Link } from 'react-router-dom';
import './StudentenHeader.css';

const StudentenHeader = () => {
  return (
    <header className="header">
      <img 
        src={`${import.meta.env.BASE_URL}afbeelding/erasmuslogo.png`}
        alt="Erasmus logo"
        className="logo"
      />
      <nav>
        <ul>
          <li><Link to="/student/bedrijven">Deelnemende Bedrijven</Link></li>
          <li><Link to="/student/standen">Standen</Link></li>
          <li><Link to="/student/afspraak">Afspraak maken</Link></li>
          <li><Link to="/student/logout">Logout</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default StudentenHeader;