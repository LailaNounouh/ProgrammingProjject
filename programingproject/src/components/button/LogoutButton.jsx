import React from 'react';
import { useAuth } from '../../context/AuthProvider.jsx';


const LogoutButton = () => {
  const { uitloggen } = useAuth();

  return (
    <button onClick={uitloggen}>Uitloggen</button>
  );
};

export default LogoutButton;
