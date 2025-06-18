import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import './BedrijvenHeader.css';
import LogoutButton from '../../button/logoutbutton';


const Header = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simuleer korte delay zodat AuthProvider zijn localStorage kan uitlezen
    const timer = setTimeout(() => setIsLoading(false), 50);
    return () => clearTimeout(timer);
  }, []);


  if (isLoading) return null; // Of toon tijdelijke loader


  return (
    <header className="header">
      <Link to="/">
        <img
          src="/afbeelding/logo-ehb.png"
          alt="Logo"
          className="logo"
        />
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
              <li><LogoutButton /></li>
            </>
          ) : (
            <li><Link to="/login">Login / Registreren</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};


export default Header;



