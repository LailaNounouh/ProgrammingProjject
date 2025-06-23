import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useWerkzoekende } from '../../context/werkzoekendeContext';
import './werkzoekendeModule.css';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function WerkzoekendeModule() {
  const navigate = useNavigate();
  const { gebruiker } = useAuth();
  const { werkzoekende, fetchWerkzoekende, updateWerkzoekende, loading: contextLoading, error: contextError } = useWerkzoekende();
  const [userData, setUserData] = useState({
    email: '',
    naam: '',
    foto_url: null,
    linkedin_url: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const haalGebruikerOp = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        if (!gebruiker) {
          console.log('Geen gebruiker gevonden, redirect naar login');
          navigate('/login');
          return;
        }

        console.log('Ophalen werkzoekende profiel voor:', gebruiker.email);
        const result = await fetchWerkzoekende(gebruiker.email);

        if (!result.success) {
          setErrorMessage(`Fout bij laden profiel: ${result.error}`);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error in haalGebruikerOp:', error);
        setErrorMessage(`Er is een probleem opgetreden bij het laden van je gegevens: ${error.message}`);
        setLoading(false);
      }
    };

    if (gebruiker) {
      haalGebruikerOp();
    }
  }, [navigate, gebruiker, fetchWerkzoekende]);

  useEffect(() => {
    if (werkzoekende) {
      setUserData({
        email: werkzoekende.email || '',
        naam: werkzoekende.naam || '',
        foto_url: werkzoekende.foto_url || null,
        linkedin_url: werkzoekende.linkedin_url || '',
      });
    }
  }, [werkzoekende]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Profielfoto moet een afbeelding zijn (JPEG, PNG, etc.).');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Profielfoto mag niet groter zijn dan 5MB.');
      return;
    }
    
    setUserData({
      ...userData,
      foto_url: file
    });
    setErrorMessage('');
  };

  const opslaanWijzigingen = async (e) => {
    e.preventDefault();
    if (saving) return;
    
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('naam', userData.naam || '');
      formData.append('email', userData.email || '');
      formData.append('linkedin_url', userData.linkedin_url || '');

      if (userData.foto_url && typeof userData.foto_url !== 'string') {
        formData.append('profilePicture', userData.foto_url);
      }

      const result = await updateWerkzoekende(formData);
      if (!result.success) {
        throw new Error(result.error || 'Fout bij opslaan profiel');
      }
      
      setSuccessMessage('Profiel succesvol opgeslagen!');
      setEditMode(false);
      await fetchWerkzoekende(gebruiker.email);
    } catch (err) {
      setErrorMessage(`Fout bij opslaan profiel: ${err.message || 'Onbekende fout'}`);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setErrorMessage('');
  };

  if (loading || contextLoading) {
    return (
      <div className="page-container account-module">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Gegevens laden...</p>
        </div>
      </div>
    );
  }

  // Show context error if available
  const displayError = errorMessage || contextError;

  return (
    <div className="page-container account-module">
      <div className="account-header">
        <h2>Mijn Account (Werkzoekende)</h2>
        {!editMode && (
          <button className="edit-btn" onClick={() => setEditMode(true)}>
            <FaEdit /> Bewerken
          </button>
        )}
      </div>

      {displayError && <div className="error-message">{displayError}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="account-sections">
        {editMode ? (
          <div className="persoonlijke-info">
            <form onSubmit={opslaanWijzigingen}>
              {/* Formuliervelden */}
            </form>
          </div>
        ) : (
          <div className="account-details">
            {/* Profielweergave */}
          </div>
        )}
      </div>
    </div>
  );
}