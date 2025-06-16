import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Herstel gebruiker bij pagina herladen
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email && parsedUser.id) {
          setUser(parsedUser);
        }
      } catch (err) {
        console.warn("Fout bij parsen van user uit localStorage");
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login functie
  const login = async (email, password, type) => {
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Inloggen mislukt' };
      }

      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: type,
        ...data.user  // bevat naam, bedrijfsnaam, etc.
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Navigeer naar het juiste dashboard
      if (['student', 'bedrijf', 'werkzoekende', 'admin'].includes(type)) {
        navigate(`/${type}`);
      } else {
        navigate('/');
      }

      return { success: true };
    } catch (err) {
      console.error('Login fout:', err);
      return { success: false, message: 'Interne fout tijdens inloggen' };
    }
  };

  // Logout functie
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
