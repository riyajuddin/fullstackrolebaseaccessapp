const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validateUser, validateUserUpdate } = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Routes with permission checks
router.get('/', authorize('user:read'), getUsers);
router.get('/:id', authorize('user:read'), getUser);
router.post('/', authorize('user:write'), validateUser, createUser);
router.put('/:id', authorize('user:write'), validateUserUpdate, updateUser);
router.delete('/:id', authorize('user:delete'), deleteUser);

module.exports = router;
