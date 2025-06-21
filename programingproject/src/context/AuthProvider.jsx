import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize state with stored user data
  const [gebruiker, setGebruiker] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  // Update localStorage when user state changes
  useEffect(() => {
    console.log('User state changed:', gebruiker);
    if (gebruiker) {
      localStorage.setItem('user', JSON.stringify(gebruiker));
    } else {
      localStorage.removeItem('user');
    }
  }, [gebruiker]);

  const inloggen = async (email, wachtwoord, type) => {
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: wachtwoord, type }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Inloggen mislukt');
      }

      // Store user data
      const userData = {
        ...data.user,
        lastLogin: new Date().toISOString()
      };

      console.log('Storing user data:', userData);
      setGebruiker(userData);
      
      // Navigate to dashboard
      navigate(`/${type}`);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, bericht: error.message };
    }
  };

  const uitloggen = () => {
    console.log('Logging out user');
    localStorage.removeItem('user')
    localStorage.removeItem('userprofile');
    setGebruiker(null);
    navigate('/login');
  };

  const checkAuthStatus = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.log('Found stored user:', JSON.parse(storedUser));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      gebruiker,
      user: gebruiker, // Alias for consistency
      inloggen,
      uitloggen,
      logout: uitloggen, // Alias for consistency
      checkAuthStatus,
      isIngelogd: () => !!gebruiker
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
