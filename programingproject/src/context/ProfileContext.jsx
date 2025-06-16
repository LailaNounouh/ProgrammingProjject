import React, { createContext, useContext, useEffect, useState } from 'react';
import { baseUrl } from '../config';
import { useAuth } from './AuthProvider'; // Controleer dat het pad klopt

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth(); // Haal ingelogde gebruiker uit AuthContext
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);  // Optioneel: laadstatus
  const [error, setError] = useState(null);       // Optioneel: foutstatus

  // Profiel ophalen functie
  const fetchProfile = async () => {
    if (!user?.email) {
      console.warn("Geen e-mailadres gevonden, profiel niet opgehaald.");
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/studentenaccount/${encodeURIComponent(user.email)}`);
      console.log(`Fetching profiel voor: ${user.email} - Status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Fout bij ophalen profiel: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
      console.log('Profiel succesvol opgehaald:', data);
    } catch (err) {
      console.error('Fout bij ophalen profiel:', err);
      setError(err.message || 'Onbekende fout');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Profiel ophalen bij laden en als user.email verandert
  useEffect(() => {
    fetchProfile();
  }, [user?.email]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};
