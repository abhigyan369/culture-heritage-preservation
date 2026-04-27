const express = require('express');
const {
  getHeritageSites,
  getHeritageSite,
  createHeritageSite,
  updateHeritageSite,
  deleteHeritageSite,
  verifyHeritageSite,
  rejectHeritageSite,
  addReview,
  getNearbySites,
  getHeritageStats,
  searchByBounds,
  externalSearch,
  validateHeritageSite,
  validateReview
} = require('../controllers/heritageController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { upload } = require('../config/multer');

const router = express.Router();

// Public routes (must be before /:id to avoid param collision)
router.get('/stats', getHeritageStats);
router.get('/nearby', getNearbySites);
router.get('/search-bounds', searchByBounds);
router.get('/external-search', externalSearch);
router.get('/', optionalAuth, getHeritageSites);
router.get('/:id', getHeritageSite);

// Protected routes
router.post('/', protect, upload.array('images', 5), validateHeritageSite, createHeritageSite);
router.put('/:id', protect, updateHeritageSite);
router.post('/:id/reviews', protect, validateReview, addReview);

// Admin routes
router.patch('/:id/verify', protect, authorize('admin'), verifyHeritageSite);
router.patch('/:id/reject', protect, authorize('admin'), rejectHeritageSite);
router.delete('/:id', protect, deleteHeritageSite);

module.exports = router;
