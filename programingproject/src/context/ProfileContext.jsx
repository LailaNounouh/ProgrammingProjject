import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { gebruiker } = useAuth();
  const [profiel, setProfiel] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfiel = async () => {
    if (!gebruiker?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://10.2.160.211:3000/api/profiel/${gebruiker.id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Kon profiel niet laden');
      }

      const data = await response.json();
      setProfiel(data);
    } catch (error) {
      console.error('Fout bij laden profiel:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider 
      value={{ 
        profiel, 
        fetchProfiel, // Note the correct function name here
        loading,
        isProfielGeladen: !!profiel 
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext };
