import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Não renderizar nada enquanto o estado de autenticação está sendo carregado
  if (loading) {
    return null; 
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
