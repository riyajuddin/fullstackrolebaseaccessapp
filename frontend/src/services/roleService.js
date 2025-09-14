import api from './api';

export const roleService = {
  // Get all roles
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  // Get single role
  getRole: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  // Get available permissions
  getPermissions: async () => {
    const response = await api.get('/roles/permissions');
    return response.data;
  },

  // Create role
  createRole: async (roleData) => {
    const response = await api.post('/roles', roleData);
    return response.data;
  },

  // Update role
  updateRole: async (id, roleData) => {
    const response = await api.put(`/roles/${id}`, roleData);
    return response.data;
  },

  // Delete role
  deleteRole: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  }
};
