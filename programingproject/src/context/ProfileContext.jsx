import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { baseUrl } from '../config';
import { useAuth } from './AuthProvider';

export const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();  // user kan null of undefined zijn
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user || !user.email) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/profiel/${encodeURIComponent(user.email)}`);
      if (!response.ok) throw new Error(`Fout bij ophalen profiel: ${response.status}`);
      const data = await response.json();

      setProfile({
        ...data,
        talen: data.talen || [],
        programmeertalen: data.programmeertalen || [],
        softSkills: data.softSkills || [],
        hardSkills: data.hardSkills || [],
      });
    } catch (err) {
      setError(err.message || "Onbekende fout");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};
