// src/context/ProfileContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { baseUrl } from "../config";
import { useAuth } from "./AuthProvider";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetchProfile als useCallback zodat referentie stabiel blijft
  const fetchProfile = useCallback(async () => {
    if (!user?.email) {
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/profiel/${encodeURIComponent(user.email)}`);
      if (!response.ok) throw new Error(`Fout bij ophalen profiel: ${response.status}`);
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message || "Onbekende fout");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Automatisch fetch als user.email verandert (bv bij inloggen)
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // exposeer setProfile om profiel handmatig bij te werken (bv na edit)
  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};
