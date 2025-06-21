import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { baseUrl } from '../config';

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
      // First try to load from database
      const response = await fetch(`${baseUrl}/profiel/${gebruiker.email}`);

      if (response.ok) {
        const databaseProfile = await response.json();

        // Map database fields to our profile structure
        const mappedProfile = {
          userId: databaseProfile.id,
          naam: databaseProfile.naam,
          voornaam: databaseProfile.voornaam,
          email: databaseProfile.email,
          telefoon: databaseProfile.telefoon,
          beschrijving: databaseProfile.aboutMe,
          linkedin: databaseProfile.linkedin_url,
          github: databaseProfile.github_url,
          foto_url: databaseProfile.foto_url,
          // Add other fields as needed
        };

        setProfiel(mappedProfile);
        localStorage.setItem('userProfile', JSON.stringify(mappedProfile));
      } else {
        // Fallback to localStorage if database fetch fails
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          setProfiel(JSON.parse(storedProfile));
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Fout bij laden profiel:', error);

      // Fallback to localStorage on error
      try {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          setProfiel(JSON.parse(storedProfile));
        }
      } catch (localError) {
        console.error('Fout bij laden localStorage profiel:', localError);
      }

      setLoading(false);
    }
  };

  const updateProfiel = async (updatedData) => {
    try {
      const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const newProfile = {
        ...currentProfile,
        ...updatedData,
        userId: gebruiker.id
      };

      // Save to localStorage first (for immediate UI update)
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      setProfiel(newProfile);

      // Now save to database
      const response = await fetch(`${baseUrl}/profiel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naam: newProfile.naam,
          email: newProfile.email || gebruiker.email,
          telefoon: newProfile.telefoon,
          aboutMe: newProfile.beschrijving,
          github: newProfile.github,
          linkedin: newProfile.linkedin,
          studie: newProfile.studie,
        }),
      });

      if (!response.ok) {
        throw new Error('Database update failed');
      }

      const result = await response.json();
      console.log('Profile saved to database:', result);

      return { success: true };
    } catch (error) {
      console.error('Fout bij updaten profiel:', error);

      // If database save failed, you might want to revert localStorage
      // or show a warning to the user
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (!gebruiker?.id) {
      localStorage.removeItem('userProfile');
      setProfiel(null);
      setLoading(false);
      return;
    }

    try {
      const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

      if (storedProfile.userId !== gebruiker.id) {
        // Nieuw profiel aanmaken op basis van de ingelogde gebruiker
        const defaultProfile = {
          userId: gebruiker.id,
          naam: gebruiker.naam || '',
          email: gebruiker.email || '',
        };
        localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
        setProfiel(defaultProfile);
      } else {
        // Profiel komt overeen met de ingelogde gebruiker
        setProfiel(storedProfile);
      }
    } catch (error) {
      console.error('Fout bij laden profiel:', error);
      setProfiel(null);
    }

    setLoading(false);
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
