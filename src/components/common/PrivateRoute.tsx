import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PrivateRouteProps {
  requireRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requireRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificar si el usuario tiene ese rol
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderizar los componentes hijos
  return <Outlet />;
};

export default PrivateRoute; 