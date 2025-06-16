import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [gebruiker, setGebruiker] = useState(null);
  const navigate = useNavigate();

  const inloggen = async (email, wachtwoord, type) => {
    try {
      const response = await fetch('http://10.2.160.211:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: wachtwoord, type }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Login mislukt');
      }

      const data = await response.json();
      setGebruiker(data.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, bericht: error.message };
    }
  };

  const uitloggen = () => {
    setGebruiker(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      gebruiker, 
      inloggen, 
      uitloggen,
      isIngelogd: () => !!gebruiker 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
