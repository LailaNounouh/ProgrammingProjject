import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [gebruiker, setGebruiker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const opgeslagen = localStorage.getItem('gebruiker');
    if (opgeslagen) {
      try {
        const parsed = JSON.parse(opgeslagen);
        if (parsed && parsed.email && parsed.id) {
          setGebruiker(parsed);
        }
      } catch (err) {
        console.warn("Ongeldige gebruikersdata in localStorage");
        localStorage.removeItem('gebruiker');
      }
    }
  }, []);

  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/check-session', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setGebruiker(data.user);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkSession();
  }, []);

  // Login functie
  const inloggen = async (email, wachtwoord, type) => {
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: wachtwoord, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, bericht: data.error || 'Inloggen mislukt' };
      }

      const gebruikersData = {
        id: data.user.id,
        email: data.user.email,
        naam: data.user.naam || data.user.bedrijfsnaam || '',
        type: type,
      };

      setGebruiker(gebruikersData);
      localStorage.setItem('gebruiker', JSON.stringify(gebruikersData));

      navigate(`/${type}`);
      return { success: true };
    } catch (err) {
      console.error('Inlogfout:', err);
      return { success: false, bericht: 'Er trad een fout op tijdens het inloggen' };
    }
  };

  // Logout functie
  const uitloggen = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setGebruiker(null);
      navigate('/login');
    }
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
