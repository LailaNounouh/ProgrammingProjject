// context/ProfileContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { baseUrl } from '../config';
import { useAuth } from './AuthProvider'; // Zorg dat dit pad klopt

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth(); // Haalt ingelogde gebruiker op
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    if (!user?.email) {
      console.warn("Geen e-mailadres gevonden, profiel niet opgehaald.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/studentenaccount/${user.email}`);
      if (!response.ok) {
        throw new Error("Fout bij ophalen profiel: " + response.status);
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Fout bij ophalen profiel:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.email]); // Voer opnieuw uit als user/email verandert

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
