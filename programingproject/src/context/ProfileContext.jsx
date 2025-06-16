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
      // Update local storage
      const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const newProfile = { ...currentProfile, ...updatedData };
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      
      // Update state
      setProfiel(newProfile);
      return { success: true };
    } catch (error) {
      console.error('Fout bij updaten profiel:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchProfiel();
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
