import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <img 
        src="./public/afbeelding/logo-ehb.png" 
        alt="Logo" 
        className="logo"
        />
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login">Login / Registreren</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;