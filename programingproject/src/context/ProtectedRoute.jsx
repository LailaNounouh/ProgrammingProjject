import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoute = ({ children, toegestaneRollen }) => {
  const { isIngelogd, heeftToegang } = useAuth();

  if (!isIngelogd()) {
    return <Navigate to="/login" />;
  }

  if (!heeftToegang(toegestaneRollen)) {
    return <Navigate to="/" />;
  }

  return children;
};