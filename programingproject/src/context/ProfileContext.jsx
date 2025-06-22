
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
      console.log("Ophalen profiel voor gebruiker:", gebruiker.email);
      
      // First try to load from database
      const response = await fetch(`${baseUrl}/profiel/${gebruiker.email}`);

      if (response.ok) {
        const databaseProfile = await response.json();
        console.log("Opgehaald profiel uit database:", databaseProfile);
        console.log("Raw softskills uit database:", databaseProfile.softskills);
        console.log("Raw hardskills uit database:", databaseProfile.hardskills);

        // Zorg ervoor dat de mapping van het profiel correct is
        const mappedProfile = {
          userId: databaseProfile.student_id || gebruiker.id,
          naam: databaseProfile.naam,
          voornaam: databaseProfile.voornaam,
          email: databaseProfile.email,
          telefoon: databaseProfile.telefoon,
          beschrijving: databaseProfile.aboutMe,
          linkedin: databaseProfile.linkedin_url,
          github: databaseProfile.github_url,
          foto_url: databaseProfile.foto_url,
          studie: databaseProfile.studie,
          jobstudent: databaseProfile.jobstudent || false,
          werkzoekend: databaseProfile.werkzoekend || false,
          stage_gewenst: databaseProfile.stage_gewenst || false,
          // Zorg ervoor dat softskills en hardskills altijd arrays zijn
          softskills: Array.isArray(databaseProfile.softskills) 
            ? databaseProfile.softskills 
            : [],
          hardskills: Array.isArray(databaseProfile.hardskills) 
            ? databaseProfile.hardskills 
            : [],
          // Voeg codeertaal en talen toe
          codeertaal: Array.isArray(databaseProfile.codeertaal) 
            ? databaseProfile.codeertaal 
            : [],
          talen: Array.isArray(databaseProfile.talen) 
            ? databaseProfile.talen 
            : []
        };

        console.log("Gemapped profiel:", mappedProfile);
        console.log("Softskills na mapping:", mappedProfile.softskills);
        console.log("Hardskills na mapping:", mappedProfile.hardskills);

        setProfiel(mappedProfile);
        localStorage.setItem('userProfile', JSON.stringify(mappedProfile));
      } else {
        // Fallback to localStorage if database fetch fails
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          setProfiel(JSON.parse(storedProfile));
        } else {
          // Als er geen profiel in localStorage is, maak een basis profiel
          const basisProfiel = {
            userId: gebruiker.id,
            naam: gebruiker.naam || '',
            email: gebruiker.email || '',
            softskills: [],
            hardskills: []
          };
          setProfiel(basisProfiel);
          localStorage.setItem('userProfile', JSON.stringify(basisProfiel));
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
        } else {
          // Als er geen profiel in localStorage is, maak een basis profiel
          const basisProfiel = {
            userId: gebruiker.id,
            naam: gebruiker.naam || '',
            email: gebruiker.email || '',
            softskills: [],
            hardskills: []
          };
          setProfiel(basisProfiel);
          localStorage.setItem('userProfile', JSON.stringify(basisProfiel));
        }
      } catch (localError) {
        console.error('Fout bij laden localStorage profiel:', localError);
        // Maak een basis profiel
        const basisProfiel = {
          userId: gebruiker.id,
          naam: gebruiker.naam || '',
          email: gebruiker.email || '',
          softskills: [],
          hardskills: []
        };
        setProfiel(basisProfiel);
        localStorage.setItem('userProfile', JSON.stringify(basisProfiel));
      }

      setLoading(false);
    }
  };

  const updateProfiel = async (data, isMultipart = false) => {
    try {
      console.log("ProfileContext updateProfiel aangeroepen met:", { isMultipart });
      console.log("Data die wordt verzonden:", data);
      
      let options;
      if (isMultipart) {
        // Voor FormData (met bestand)
        options = {
          method: "POST",
          body: data, // FormData
        };
      } else {
        // Maak een kopie van de data om mee te werken
        const jsonData = { ...data };
        
        // Zorg ervoor dat softskills en hardskills als strings worden verzonden
        // Dit is een workaround voor de backend die problemen heeft met arrays
        if (Array.isArray(jsonData.softskills)) {
          console.log("softskills is een array, wordt omgezet naar JSON string");
          jsonData.softskills = JSON.stringify(jsonData.softskills);
        } else if (typeof jsonData.softskills === 'string') {
          console.log("softskills is al een string");
          // Controleer of het een geldige JSON string is
          try {
            JSON.parse(jsonData.softskills);
          } catch (e) {
            // Als het geen geldige JSON is, maak er een lege array van
            jsonData.softskills = "[]";
          }
        } else if (jsonData.softskills === undefined || jsonData.softskills === null) {
          console.log("softskills is undefined of null, wordt een lege array");
          jsonData.softskills = "[]";
        }
        
        if (Array.isArray(jsonData.hardskills)) {
          console.log("hardskills is een array, wordt omgezet naar JSON string");
          jsonData.hardskills = JSON.stringify(jsonData.hardskills);
        } else if (typeof jsonData.hardskills === 'string') {
          console.log("hardskills is al een string");
          // Controleer of het een geldige JSON string is
          try {
            JSON.parse(jsonData.hardskills);
          } catch (e) {
            // Als het geen geldige JSON is, maak er een lege array van
            jsonData.hardskills = "[]";
          }
        } else if (jsonData.hardskills === undefined || jsonData.hardskills === null) {
          console.log("hardskills is undefined of null, wordt een lege array");
          jsonData.hardskills = "[]";
        }
        
        // Log de skills voor verzending
        console.log("Softskills voor verzending:", jsonData.softskills);
        console.log("Hardskills voor verzending:", jsonData.hardskills);
        
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        };
      }

      console.log("Verzenden request naar:", `${baseUrl}/profiel`);
      console.log("Met opties:", options);
      
      const response = await fetch(`${baseUrl}/profiel`, options);

      // Controleer eerst of de response OK is
      if (!response.ok) {
        // Probeer de response als tekst te lezen om te zien wat er mis is
        const errorText = await response.text();
        console.error("Server response (niet-OK):", errorText);
        
        // Probeer het als JSON te parsen als het er als JSON uitziet
        try {
          if (errorText.trim().startsWith('{')) {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || "Database update failed");
          } else {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} ${response.statusText}. Details: ${errorText.substring(0, 100)}...`);
        }
      }

      // Probeer de response als tekst te lezen om te zien wat er terugkomt
      const responseText = await response.text();
      console.log("Server response (raw):", responseText);
      
      // Probeer het als JSON te parsen
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Profile saved to database:", result);
      } catch (parseError) {
        console.error("Error parsing response as JSON:", parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`);
      }
      
      // Haal het bijgewerkte profiel op
      await fetchProfiel();
      
      return { success: true };
    } catch (error) {
      console.error("Fout bij updaten profiel:", error);
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
