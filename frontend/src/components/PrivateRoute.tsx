import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  allowedRoles?: ('admin' | 'coordinator')[];
}

export const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};