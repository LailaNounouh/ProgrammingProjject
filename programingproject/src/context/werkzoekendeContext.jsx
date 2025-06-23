import { createContext, useContext, useState } from 'react';
import axios from 'axios';


const WerkzoekendeContext = createContext();

export function WerkzoekendeProvider({ children }) {
  const [werkzoekende, setWerkzoekende] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWerkzoekende = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/werkzoekendeProfiel/${encodeURIComponent(email)}`);
      
      // Verwijder gevoelige data voor frontend
      const { wachtwoord, resetToken, resetTokenExpires, ...safeData } = response.data;
      
      setWerkzoekende(safeData);
      return { success: true, data: safeData };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateWerkzoekende = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `/api/werkzoekendeProfiel`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Verwijder gevoelige data
      const { wachtwoord, resetToken, resetTokenExpires, ...safeData } = response.data.werkzoekende;
      
      setWerkzoekende(safeData);
      return { success: true, data: safeData };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <WerkzoekendeContext.Provider
      value={{
        werkzoekende,
        loading,
        error,
        fetchWerkzoekende,
        updateWerkzoekende
      }}
    >
      {children}
    </WerkzoekendeContext.Provider>
  );
}

export const useWerkzoekende = () => useContext(WerkzoekendeContext);