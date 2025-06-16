import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Herstel ingelogde gebruiker bij pagina herladen
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.email) {
        setUser(storedUser);
      }
    } catch (err) {
      console.warn("Ongeldige data in localStorage, gebruiker wordt genegeerd.");
      localStorage.removeItem('user');
    }
  }, []);

  // Login functie: stuurt email, wachtwoord en type (rol) naar backend
  const login = async (email, password, type) => {
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ongeldige inloggegevens');
      }

      const userData = {
        email: data.user.email,
        id: data.user.id,
        role: type,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect naar homepagina per rol
      if (['student', 'bedrijf', 'werkzoekende', 'admin'].includes(type)) {
        navigate(`/${type}`);
      } else {
        navigate('/');
      }

      return { success: true };
    } catch (error) {
      console.error('Login fout:', error.message);
      return { success: false, message: error.message };
    }
  };

  // Logout functie: verwijdert user uit state en localStorage, redirect naar login
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
