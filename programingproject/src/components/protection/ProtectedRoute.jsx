import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    // Niet ingelogd: naar login
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Geen toegang voor deze rol: naar login
    return <Navigate to="/login" replace />;
  }

  return children;
}
