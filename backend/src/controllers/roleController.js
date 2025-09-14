const Role = require('../models/Role');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private (role:read permission)
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true })
      .sort({ name: 1 });

    res.json({
      success: true,
      data: { roles }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Private (role:read permission)
const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      data: { role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new role
// @route   POST /api/roles
// @access  Private (role:write permission)
const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name: name.toLowerCase() });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role already exists with this name'
      });
    }

    const role = await Role.create({
      name: name.toLowerCase(),
      description,
      permissions
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: { role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private (role:write permission)
const updateRole = async (req, res) => {
  try {
    const { name, description, permissions, isActive } = req.body;

    // Check if role exists
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name.toLowerCase() !== role.name) {
      const existingRole = await Role.findOne({ name: name.toLowerCase() });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role already exists with this name'
        });
      }
    }

    // Update role
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { 
        name: name ? name.toLowerCase() : role.name,
        description,
        permissions,
        isActive
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: { role: updatedRole }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete role (soft delete)
// @route   DELETE /api/roles/:id
// @access  Private (role:delete permission)
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if any users are using this role
    const User = require('../models/User');
    const usersWithRole = await User.countDocuments({ role: req.params.id, isActive: true });
    
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. ${usersWithRole} user(s) are currently assigned to this role.`
      });
    }

    // Soft delete by setting isActive to false
    role.isActive = false;
    await role.save();

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get available permissions
// @route   GET /api/roles/permissions
// @access  Private (role:read permission)
const getPermissions = async (req, res) => {
  try {
    const permissions = [
      {
        key: 'user:read',
        description: 'View users'
      },
      {
        key: 'user:write',
        description: 'Create and edit users'
      },
      {
        key: 'user:delete',
        description: 'Delete users'
      },
      {
        key: 'role:read',
        description: 'View roles'
      },
      {
        key: 'role:write',
        description: 'Create and edit roles'
      },
      {
        key: 'role:delete',
        description: 'Delete roles'
      },
      {
        key: 'dashboard:read',
        description: 'Access dashboard'
      },
      {
        key: 'admin:access',
        description: 'Access admin panel'
      }
    ];

    res.json({
      success: true,
      data: { permissions }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getPermissions
};
