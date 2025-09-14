import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasPermission, hasAnyPermission, hasRole, hasAnyRole } from '../utils/permissions';

const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requiredPermissions = [], 
  requiredRole, 
  requiredRoles = [],
  fallback = '/login' 
}) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check authentication
  if (!isAuthenticated || !user) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check multiple permissions (any)
  if (requiredPermissions.length > 0 && !hasAnyPermission(user, requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check single role
  if (requiredRole && !hasRole(user, requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check multiple roles (any)
  if (requiredRoles.length > 0 && !hasAnyRole(user, requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
