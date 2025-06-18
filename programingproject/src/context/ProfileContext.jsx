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
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setProfiel(JSON.parse(storedProfile));
      }
      setLoading(false);
    } catch (error) {
      console.error('Fout bij laden profiel:', error);
      setLoading(false);
    }
  };

  const updateProfiel = async (updatedData) => {
    try {
      const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const newProfile = {
        ...currentProfile,
        ...updatedData,
        userId: gebruiker.id
      };

      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      setProfiel(newProfile);

      return { success: true };
    } catch (error) {
      console.error('Fout bij updaten profiel:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (!gebruiker?.id) {
      localStorage.removeItem('userProfile');
      setProfiel(null);
      setLoading(false);
      return;
    }

    try {
      const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

      if (storedProfile.userId !== gebruiker.id) {
        // Nieuw profiel aanmaken op basis van de ingelogde gebruiker
        const defaultProfile = {
          userId: gebruiker.id,
          naam: gebruiker.naam || '',
          email: gebruiker.email || '',
        };
        localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
        setProfiel(defaultProfile);
      } else {
        // Profiel komt overeen met de ingelogde gebruiker
        setProfiel(storedProfile);
      }
    } catch (error) {
      console.error('Fout bij laden profiel:', error);
      setProfiel(null);
    }

    setLoading(false);
  }, [gebruiker]);

  return (
    <ProfileContext.Provider value={{ 
      profiel, 
      fetchProfiel,
      updateProfiel,
      loading 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext };
