import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  const login = (email, password) => {
    const role = getRoleByEmail(email); 

    const userData = { email, role };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    navigate(`/${role}`);
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

export const useAuth = () => useContext(AuthContext);

const getRoleByEmail = (email) => {
  if (email.includes('student.ehb.be')) return 'student';
  if (email.includes('bedrijf')) return 'bedrijf';
  if (email.includes('admin')) return 'admin';
  return 'werkzoekende';
};