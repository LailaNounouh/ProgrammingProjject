import React, { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../config";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${baseUrl}/profile`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Fout bij ophalen profiel:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
