const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const Role = require('../models/Role');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from token
    const user = await User.findById(decoded.id).populate('role');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid or user is inactive.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is not valid.'
    });
  }
};

// Check if user has specific permission
const authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User role not found.'
      });
    }

    const userPermissions = req.user.role.permissions || [];
    const hasPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Check if user has specific role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User role not found.'
      });
    }

    const userRole = req.user.role.name.toLowerCase();
    const hasRole = roles.some(role => 
      role.toLowerCase() === userRole
    );

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient role privileges.'
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  requireRole
};
