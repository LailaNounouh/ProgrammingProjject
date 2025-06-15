import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
      ...(type === 'bedrijf' && {
        bedrijfsnaam: data.user.bedrijfsnaam,
        sector: data.user.sector,
        website: data.user.website,
        telefoonnummer: data.user.telefoonnummer,
        gemeente: data.user.gemeente
      })
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    switch(type) {
      case 'student':
        navigate('/student');
        break;
      case 'bedrijf':
        navigate('/bedrijf');
        break;
      case 'werkzoekende':
        navigate('/werkzoekende');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }

    return { success: true };
  } catch (error) {
    console.error('Login fout:', error);
    return { success: false, message: error.message };
  }
};

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
