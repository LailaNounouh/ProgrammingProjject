import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { gebruiker, isIngelogd } = useAuth();
  const location = useLocation();

  // Check if user is logged in
  if (requireAuth && !isIngelogd()) {
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && gebruiker) {
    const userType = gebruiker.type;
    
    if (!allowedRoles.includes(userType)) {
      // Redirect to appropriate dashboard based on user type
      const redirectPath = getUserDashboard(userType);
      return <Navigate to={redirectPath} replace />;
    }
  }

  // If all checks pass, render the protected component
  return children;
};

// Helper function to get the correct dashboard for each user type
const getUserDashboard = (userType) => {
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

export default ProtectedRoute;
