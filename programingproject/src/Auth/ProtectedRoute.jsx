import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Zorg dat deze path klopt

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // Als niet ingelogd → naar login pagina
  if (!user) return <Navigate to="/login" replace />;

  // Als ingelogd, maar geen toegang tot deze rol → naar login
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  // Toegang toegestaan
  return children;
}