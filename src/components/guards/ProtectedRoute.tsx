import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { type Role } from '@/types/auth';

type ProtectedRouteProps = {
  allowedRoles?: Role[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="p-4">Loading access...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'SUPER_ADMIN') {
    if (user.role === 'GUEST' || user.role === 'REPRESENTATIVE') {
      return <Navigate to="/app/dashboards/department" replace />;
    }
    return <Navigate to="/app/me/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
