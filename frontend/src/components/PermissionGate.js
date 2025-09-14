import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission, hasAnyPermission, hasRole, hasAnyRole } from '../utils/permissions';

const PermissionGate = ({ 
  children, 
  permission, 
  permissions = [], 
  role, 
  roles = [],
  fallback = null,
  requireAll = false 
}) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return fallback;
  }

  // Check single permission
  if (permission && !hasPermission(user, permission)) {
    return fallback;
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? permissions.every(perm => hasPermission(user, perm))
      : permissions.some(perm => hasPermission(user, perm));
    
    if (!hasRequiredPermissions) {
      return fallback;
    }
  }

  // Check single role
  if (role && !hasRole(user, role)) {
    return fallback;
  }

  // Check multiple roles
  if (roles.length > 0) {
    const hasRequiredRoles = requireAll 
      ? roles.every(roleName => hasRole(user, roleName))
      : roles.some(roleName => hasRole(user, roleName));
    
    if (!hasRequiredRoles) {
      return fallback;
    }
  }

  return children;
};

export default PermissionGate;
