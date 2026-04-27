const express = require('express');
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  bulkApproveSites,
  bulkRejectSites,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Bulk site operations
router.post('/sites/bulk-approve', bulkApproveSites);
router.post('/sites/bulk-reject', bulkRejectSites);

module.exports = router;
