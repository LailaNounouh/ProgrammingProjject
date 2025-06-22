import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthProvider';
import { baseUrl } from '../config';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { gebruiker } = useAuth();
  const [profiel, setProfiel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper functie om skills te verwerken
  const procesSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills;
    } else if (typeof skills === 'string') {
      try {
        const parsed = JSON.parse(skills);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Fout bij parsen skills:", e);
        return [];
      }
    }
    return [];
  };

  const fetchProfiel = async () => {
    if (!gebruiker?.email) {
      console.error("Geen email beschikbaar voor fetchProfiel");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Profiel ophalen voor email:", gebruiker.email);
      const response = await fetch(`${baseUrl}/profiel/${gebruiker.email}`);

      if (response.ok) {
        const databaseProfile = await response.json();
        console.log("Opgehaald profiel uit database:", databaseProfile);
        
        // Log de programmeertalen/codeertalen voor debugging
        console.log("Ruwe programmeertalen uit database:", databaseProfile.programmeertalen);
        console.log("Ruwe talen uit database:", databaseProfile.talen);

        // Zorg ervoor dat de mapping van het profiel correct is
        const mappedProfile = {
          userId: databaseProfile.student_id || gebruiker?.id,
          naam: databaseProfile.naam,
          voornaam: databaseProfile.voornaam,
          email: databaseProfile.email,
          telefoon: databaseProfile.telefoon,
          aboutMe: databaseProfile.aboutMe,
          beschrijving: databaseProfile.aboutMe,
          linkedin: databaseProfile.linkedin_url,
          github: databaseProfile.github_url,
          foto_url: databaseProfile.foto_url,
          studie: databaseProfile.studie,
          jobstudent: databaseProfile.jobstudent === 1 || databaseProfile.jobstudent === true,
          werkzoekend: databaseProfile.werkzoekend === 1 || databaseProfile.werkzoekend === true,
          stage_gewenst: databaseProfile.stage_gewenst === 1 || databaseProfile.stage_gewenst === true,
          
          // Verwerk softskills
          softskills: procesSkills(databaseProfile.softskills),
          
          // Verwerk hardskills
          hardskills: procesSkills(databaseProfile.hardskills),
          
          // Verwerk codeertalen - probeer verschillende veldnamen
          codeertalen: procesSkills(databaseProfile.codeertalen || databaseProfile.programmeertalen),
          programmeertalen: procesSkills(databaseProfile.programmeertalen || databaseProfile.codeertalen),
          
          // Verwerk talen
          talen: procesSkills(databaseProfile.talen)
        };

        console.log("Gemapped profiel:", mappedProfile);
        console.log("Gemapped profiel codeertalen:", mappedProfile.codeertalen);
        console.log("Gemapped profiel programmeertalen:", mappedProfile.programmeertalen);
        console.log("Gemapped profiel talen:", mappedProfile.talen);

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
            userId: gebruiker?.id,
            naam: gebruiker?.naam || '',
            email: gebruiker?.email || '',
            softskills: [],
            hardskills: [],
            codeertalen: [],
            programmeertalen: [],
            talen: []
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
            userId: gebruiker?.id,
            naam: gebruiker?.naam || '',
            email: gebruiker?.email || '',
            softskills: [],
            hardskills: [],
            codeertalen: [],
            programmeertalen: [],
            talen: []
          };
          setProfiel(basisProfiel);
          localStorage.setItem('userProfile', JSON.stringify(basisProfiel));
        }
      } catch (localError) {
        console.error('Fout bij laden localStorage profiel:', localError);
        // Maak een basis profiel
        const basisProfiel = {
          userId: gebruiker?.id,
          naam: gebruiker?.naam || '',
          email: gebruiker?.email || '',
          softskills: [],
          hardskills: [],
          codeertalen: [],
          programmeertalen: [],
          talen: []
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
      
      setLoading(true);
      
      // Maak een kopie van de data om mee te werken
      const dataToSend = { ...data };
      
      // Bewaar de originele arrays voor later gebruik
      const originalCodeertalen = Array.isArray(data.codeertalen) ? [...data.codeertalen] : [];
      const originalTalen = Array.isArray(data.talen) ? [...data.talen] : [];
      
      let options;
      let url;
      
      if (isMultipart) {
        // Voor multipart/form-data (bijv. bestandsuploads)
        const formData = new FormData();
        
        // Voeg alle velden toe aan FormData
        Object.keys(dataToSend).forEach(key => {
          if (key === 'profilePicture' && dataToSend[key]) {
            formData.append('profilePicture', dataToSend[key]);
          } else if (Array.isArray(dataToSend[key])) {
            // Zorg ervoor dat arrays als JSON strings worden verzonden
            const jsonString = JSON.stringify(dataToSend[key]);
            console.log(`FormData: ${key} = ${jsonString}`);
            formData.append(key, jsonString);
            
            // Voor codeertalen, zorg ervoor dat we deze ook als programmeertalen opslaan
            if (key === 'codeertalen' || key === 'codeertaal') {
              formData.append('programmeertalen', jsonString);
            }
          } else {
            formData.append(key, dataToSend[key]);
          }
        });
        
        options = {
          method: "POST",
          body: formData,
        };
        
        // Voor multipart/form-data gebruiken we de POST route zonder email in de URL
        url = `${baseUrl}/profiel`;
      } else {
        // Voor JSON data
        
        // Controleer of softskills een array is en zet om naar JSON string
        if (Array.isArray(dataToSend.softskills)) {
          dataToSend.softskills = JSON.stringify(dataToSend.softskills);
        }
        
        // Controleer of hardskills een array is en zet om naar JSON string
        if (Array.isArray(dataToSend.hardskills)) {
          dataToSend.hardskills = JSON.stringify(dataToSend.hardskills);
        }
        
        // Zorg ervoor dat codeertalen worden opgeslagen als programmeertalen
        if (Array.isArray(dataToSend.codeertalen)) {
          dataToSend.programmeertalen = JSON.stringify(dataToSend.codeertalen);
          console.log("ProfileContext - Codeertalen omgezet naar JSON:", dataToSend.programmeertalen);
        } else if (Array.isArray(dataToSend.codeertaal)) {
          dataToSend.programmeertalen = JSON.stringify(dataToSend.codeertaal);
          console.log("ProfileContext - Codeertaal omgezet naar JSON:", dataToSend.programmeertalen);
        }

        // Controleer of talen een array is en zet om naar JSON string
        if (Array.isArray(dataToSend.talen)) {
          dataToSend.talen = JSON.stringify(dataToSend.talen);
          console.log("ProfileContext - Talen omgezet naar JSON string:", dataToSend.talen);
        }

        console.log("Profiel data voor verzending:", dataToSend);
        
        options = {
          method: "POST", // Gebruik POST voor de profiel route
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        };
        
        // Gebruik de standaard profiel route
        url = `${baseUrl}/profiel`;
      }

      // Log de URL en opties
      console.log("Verzenden request naar:", url);
      console.log("Met opties:", options);

      const response = await fetch(url, options);
      
      if (!response.ok) {
        console.error("Server response status:", response.status);
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }
      
      // Probeer de response als tekst te lezen om te zien wat er terugkomt
      const responseText = await response.text();
      console.log("Server response (raw):", responseText);
      
      // Probeer het als JSON te parsen
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Profile saved to database:", result);
        
        // Update het lokale profiel met de nieuwe gegevens
        if (result.student) {
          // Maak een kopie van de student data
          const updatedStudent = { ...result.student };
          
          // Gebruik de originele arrays in plaats van de waarden uit de database
          updatedStudent.codeertalen = originalCodeertalen;
          updatedStudent.programmeertalen = originalCodeertalen;
          updatedStudent.talen = originalTalen;
          
          // Update het profiel in de context
          setProfiel(updatedStudent);
          
          // Sla het profiel op in localStorage voor persistentie
          localStorage.setItem('userProfile', JSON.stringify(updatedStudent));
          
          console.log("ProfileContext - Lokaal profiel bijgewerkt met originele arrays:", updatedStudent);
        }
      } catch (parseError) {
        console.error("Error parsing response as JSON:", parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`);
      }
      
      setLoading(false);
      return { success: true, data: result };
    } catch (error) {
      console.error("Fout bij updaten profiel:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return (
    <ProfileContext.Provider value={{ 
      profiel, 
      loading, 
      error, 
      fetchProfiel, 
      updateProfiel 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile moet binnen een ProfileProvider worden gebruikt");
  }
  return context;
};

  
