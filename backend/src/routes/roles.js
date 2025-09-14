const express = require('express');
const router = express.Router();
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getPermissions
} = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/auth');
const { validateRole } = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Routes with permission checks
router.get('/', authorize('role:read'), getRoles);
router.get('/permissions', authorize('role:read'), getPermissions);
router.get('/:id', authorize('role:read'), getRole);
router.post('/', authorize('role:write'), validateRole, createRole);
router.put('/:id', authorize('role:write'), validateRole, updateRole);
router.delete('/:id', authorize('role:delete'), deleteRole);

module.exports = router;
