import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import './UnauthorizedAccess.css';

const UnauthorizedAccess = () => {
  const { gebruiker } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      if (gebruiker) {
        const dashboardPath = getDashboardPath(gebruiker.type);
        navigate(dashboardPath);
      } else {
        navigate('/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [gebruiker, navigate]);

  const getDashboardPath = (userType) => {
    switch (userType) {
      case 'student':
        return '/student';
      case 'bedrijf':
        return '/bedrijf';
      case 'werkzoekende':
        return '/werkzoekende';
      case 'admin':
        return '/admin';
      default:
        return '/login';
    }
  };

  const handleGoToDashboard = () => {
    if (gebruiker) {
      const dashboardPath = getDashboardPath(gebruiker.type);
      navigate(dashboardPath);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          🚫
        </div>
        <h1>Toegang Geweigerd</h1>
        <p>
          Je hebt geen toegang tot deze pagina. 
          {gebruiker && (
            <span> Je bent ingelogd als <strong>{gebruiker.type}</strong>.</span>
          )}
        </p>
        <div className="unauthorized-actions">
          <button 
            onClick={handleGoToDashboard}
            className="btn-primary"
          >
            Ga naar Mijn Dashboard
          </button>
        </div>
        <p className="auto-redirect">
          Je wordt automatisch doorgestuurd over 3 seconden...
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
