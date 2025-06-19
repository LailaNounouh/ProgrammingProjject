import React from 'react';
import { Link } from 'react-router-dom';
import './SeekerHeader.css';
import LogoutButton from '../../button/logoutbutton.jsx';

const SeekerHeader = () => {
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
          <li><Link to="/werkzoekende">Dashboard</Link></li>
          <li><Link to="/werkzoekende/bedrijven">Deelnemende Bedrijven</Link></li>
          <li><Link to="/werkzoekende/standen">Standen</Link></li>
          <li><Link to="/werkzoekende/profiel">Profiel</Link></li>
          <li><LogoutButton /></li>
        </ul>

      </nav>
    </header>
  );
};

export default SeekerHeader;
