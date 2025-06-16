// src/context/ProfileContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../config";
import { useAuth } from "./AuthProvider";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    if (!user?.email) {
      console.warn("Geen gebruiker ingelogd.");
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
      console.error("Fout bij ophalen profiel:", err);
      setError(err.message || "Onbekende fout");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.email]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};
