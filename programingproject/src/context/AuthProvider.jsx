import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../config';


const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
        throw new Error(data.error || 'Ongeldige inloggegevens');
      }


      
      const userData = {
        email: data.user.email,
        id: data.user.id,
        role: type, 
      };


      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate(`/${type}`);
      return { success: true };


    } catch (error) {
      console.error('Login fout:', error.message);
      return { success: false, message: error.message };
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



