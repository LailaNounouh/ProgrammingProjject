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

  // Haalt het profiel op vanuit de backend (op basis van e-mail)
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

      // Voorzie optioneel lege lijsten als fallback (voor wanneer die later via aparte tabellen komen)
      const enrichedProfile = {
        ...data,
        talen: data.talen || [],
        programmeertalen: data.programmeertalen || [],
        softSkills: data.softSkills || [],
        hardSkills: data.hardSkills || [],
      };

      setProfile(enrichedProfile);
    } catch (err) {
      setError(err.message || "Onbekende fout");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Automatisch profiel ophalen wanneer user (email) verandert
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};
