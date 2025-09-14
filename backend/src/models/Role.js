const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Role description is required'],
    trim: true
  },
  permissions: [{
    type: String,
    enum: [
      'user:read',
      'user:write',
      'user:delete',
      'role:read',
      'role:write',
      'role:delete',
      'dashboard:read',
      'admin:access'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
roleSchema.index({ name: 1 });

module.exports = mongoose.model('Role', roleSchema);
