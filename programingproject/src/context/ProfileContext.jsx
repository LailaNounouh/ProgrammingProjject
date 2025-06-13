// context/ProfileContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { baseUrl } from '../config';
import { useAuth } from './AuthProvider';

const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user?.email || !user?.role) return;

    try {
      const email = encodeURIComponent(user.email);
      const rol = encodeURIComponent(user.role);
      const response = await fetch(`${baseUrl}/api/profiel?email=${email}&rol=${rol}`);

      if (!response.ok) {
        throw new Error(`Fout bij ophalen profiel: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Fout bij ophalen profiel:", error);
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
