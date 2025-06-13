import React from 'react';
import { useAuth } from '../../context/AuthProvider.jsx';


const LogoutButton = () => {
  const { logout } = useAuth();


  return (
    <button onClick={logout}>
      Logout
    </button>
  );
};


export default LogoutButton;



