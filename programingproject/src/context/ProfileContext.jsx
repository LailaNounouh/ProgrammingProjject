// context/ProfileContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { baseUrl } from '../config';
import { useAuth } from './AuthProvider';

const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth(); // verwacht { email, rol }

  const fetchProfile = async () => {
    if (!user?.email || !user?.rol) return;

    try {
      const query = `email=${encodeURIComponent(user.email)}&rol=${encodeURIComponent(user.rol)}`;
      const response = await fetch(`${baseUrl}/profiel?${query}`);

      if (!response.ok) {
        throw new Error(`Fout bij ophalen profiel: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Fout bij ophalen profiel:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
