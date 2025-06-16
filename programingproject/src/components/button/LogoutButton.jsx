import React from 'react';
import { useAuth } from '../../context/AuthProvider.jsx';
import './LogoutButton.css';


const LogoutButton = () => {
  const { logout } = useAuth();


  return (
    <button onClick={logout} className="logout-button">
      Logout
    </button>
  );
};


export default LogoutButton;
