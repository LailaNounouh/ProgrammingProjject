import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [gebruiker, setGebruiker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const opgeslagenGebruiker = JSON.parse(localStorage.getItem('gebruiker'));
      if (opgeslagenGebruiker?.email) {
        setGebruiker(opgeslagenGebruiker);
      }
    } catch (err) {
      console.warn("Ongeldige gebruikersdata in localStorage");
      localStorage.removeItem('gebruiker');
    }
  }, []);

  const inloggen = async (email, wachtwoord, type) => {
    try {
      console.log('Verstuur login verzoek:', { email, type });

      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password: wachtwoord,
          type
        }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Inloggen mislukt');
      }

      const gebruikersData = {
        id: data.user.id,
        email: data.user.email,
        type: type,
        naam: data.user.naam
      };

      setGebruiker(gebruikersData);
      localStorage.setItem('gebruiker', JSON.stringify(gebruikersData));

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
      console.error('Inlogfout:', error);
      return { success: false, bericht: error.message };
    }
  };

  const uitloggen = () => {
    console.log('Uitloggen...');
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
