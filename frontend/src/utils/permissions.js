// Permission checking utilities

export const hasPermission = (user, permission) => {
  if (!user || !user.role || !user.role.permissions) {
    return false;
  }
  return user.role.permissions.includes(permission);
};

export const hasAnyPermission = (user, permissions) => {
  if (!user || !user.role || !user.role.permissions) {
    return false;
  }
  return permissions.some(permission => user.role.permissions.includes(permission));
};

export const hasAllPermissions = (user, permissions) => {
  if (!user || !user.role || !user.role.permissions) {
    return false;
  }
  return permissions.every(permission => user.role.permissions.includes(permission));
};

export const hasRole = (user, roleName) => {
  if (!user || !user.role) {
    return false;
  }
  return user.role.name.toLowerCase() === roleName.toLowerCase();
};

export const hasAnyRole = (user, roleNames) => {
  if (!user || !user.role) {
    return false;
  }
  return roleNames.some(roleName => 
    user.role.name.toLowerCase() === roleName.toLowerCase()
  );
};

// Specific permission checks
export const canReadUsers = (user) => hasPermission(user, 'user:read');
export const canWriteUsers = (user) => hasPermission(user, 'user:write');
export const canDeleteUsers = (user) => hasPermission(user, 'user:delete');
export const canReadRoles = (user) => hasPermission(user, 'role:read');
export const canWriteRoles = (user) => hasPermission(user, 'role:write');
export const canDeleteRoles = (user) => hasPermission(user, 'role:delete');
export const canAccessDashboard = (user) => hasPermission(user, 'dashboard:read');
export const canAccessAdmin = (user) => hasPermission(user, 'admin:access');

// Role-based checks
export const isAdmin = (user) => hasRole(user, 'admin');
export const isEditor = (user) => hasRole(user, 'editor');
export const isViewer = (user) => hasRole(user, 'viewer');
export const isManager = (user) => hasRole(user, 'manager');
