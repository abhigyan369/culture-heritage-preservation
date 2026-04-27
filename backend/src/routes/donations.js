const express = require('express');
const {
  createPaymentIntent,
  processDonation,
  getMyDonations,
  getDonations,
  getDonationStats,
  stripeWebhook,
  validateDonation
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/webhook', stripeWebhook);

// Protected routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/', protect, validateDonation, processDonation);
router.get('/my-donations', protect, getMyDonations);

// Admin routes
router.get('/', protect, authorize('admin'), getDonations);
router.get('/stats', protect, authorize('admin'), getDonationStats);

module.exports = router;
