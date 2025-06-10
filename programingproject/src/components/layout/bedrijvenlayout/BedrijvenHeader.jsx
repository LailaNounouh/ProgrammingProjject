import React from 'react';
import { Link } from 'react-router-dom';
import './BedrijvenHeader.css';
import LogoutButton from '../../button/logoutbutton.jsx';

const BedrijvenHeader = () => {
  return (
    <header className="header">
          <Link to="/" className="logo-link">
            <img 
              src={`${import.meta.env.BASE_URL}afbeelding/erasmuslogo.png`}
              alt="Erasmus logo"
              className="logo"
            />
          </Link>
      <nav>
        <ul>
          <li><Link to="/student/bedrijven">Deelnemende Bedrijven</Link></li>
          <li><Link to="/student/standen">Standen</Link></li>
          <li><Link to="/student/afspraak">Afspraak maken</Link></li>
        </ul>
      </nav>
      <LogoutButton />
    </header>
  );
};

export default BedrijvenHeader;