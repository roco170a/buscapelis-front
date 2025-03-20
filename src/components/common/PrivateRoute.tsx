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

  // RCC Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // RCC If a specific role is required, check if the user has that role
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  // RCC If everything is ok, render the child components
  return <Outlet />;
};

export default PrivateRoute; 