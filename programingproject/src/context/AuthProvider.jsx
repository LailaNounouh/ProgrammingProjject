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
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password: wachtwoord, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Inloggen mislukt');
      }

      // Store user data and token
      const userData = {
        ...data.user,
        token: data.token,
        lastLogin: new Date().toISOString()
      };

      console.log('Storing user data:', userData);
      setGebruiker(userData);

      // Store token for API requests
      localStorage.setItem('auth_token', data.token);

      // Navigate to dashboard
      navigate(`/${type}`);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, bericht: error.message };
    }
  };

  const uitloggen = async () => {
    console.log('Logging out user');

    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('userprofile');
    localStorage.removeItem('auth_token');

    // Clear cookies by calling logout endpoint
    try {
      await fetch(`${baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

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
