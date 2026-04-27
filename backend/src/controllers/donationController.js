const Donation = require('../models/Donation');
const HeritageSite = require('../models/HeritageSite');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');

// @desc    Create payment intent
// @route   POST /api/donations/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid donation amount'
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId: req.user.id,
        type: 'heritage_donation'
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process donation
// @route   POST /api/donations
// @access  Private
exports.processDonation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      amount,
      currency = 'INR',
      paymentMethod,
      paymentId,
      donationType = 'general',
      heritageSite,
      isAnonymous = false,
      message,
      recurring
    } = req.body;

    // Verify payment — skip Stripe for UPI (UTR-based manual verification)
    let paymentStatus = 'pending';
    if (paymentMethod === 'card' || paymentMethod === 'bank_transfer') {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        paymentStatus = paymentIntent.status === 'succeeded' ? 'completed' : 'failed';
      } catch (error) {
        paymentStatus = 'failed';
      }
    }

    // Create donation record
    const donation = await Donation.create({
      donor: req.user.id,
      amount,
      currency,
      paymentMethod,
      paymentId,
      status: paymentStatus,
      donationType,
      heritageSite,
      isAnonymous,
      message,
      recurring
    });

    // If donation is site-specific, update the heritage site
    if (heritageSite && paymentStatus === 'completed') {
      await HeritageSite.findByIdAndUpdate(heritageSite, {
        $push: { donations: donation._id }
      });
    }

    // Send confirmation notification (Twilio integration can be added here)
    if (paymentStatus === 'completed') {
      // TODO: Send SMS/Email confirmation
    }

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user donations
// @route   GET /api/donations/my-donations
// @access  Private
exports.getMyDonations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const donations = await Donation.find({ donor: req.user.id })
      .populate('heritageSite', 'name location.city')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments({ donor: req.user.id });

    res.status(200).json({
      success: true,
      count: donations.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations
// @access  Private/Admin
exports.getDonations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name email')
      .populate('heritageSite', 'name location.city')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    res.status(200).json({
      success: true,
      count: donations.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private/Admin
exports.getDonationStats = async (req, res, next) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const donationsByType = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$donationType', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const monthlyDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalDonations[0] || { total: 0, count: 0 },
        byType: donationsByType,
        monthly: monthlyDonations
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Webhook for Stripe events
// @route   POST /api/donations/webhook
// @access  Public
exports.stripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await Donation.findOneAndUpdate(
          { paymentId: paymentIntent.id },
          { status: 'completed' },
          { new: true }
        );
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await Donation.findOneAndUpdate(
          { paymentId: failedPayment.id },
          { status: 'failed' },
          { new: true }
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

// Validation middleware
exports.validateDonation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('paymentMethod').isIn(['card', 'bank_transfer', 'upi', 'paypal']).withMessage('Invalid payment method'),
  body('paymentId').notEmpty().withMessage('Payment ID is required'),
  body('donationType').optional().isIn(['general', 'site_specific', 'restoration', 'maintenance']).withMessage('Invalid donation type'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters')
];
