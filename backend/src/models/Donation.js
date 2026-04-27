const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Minimum donation amount is 1']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'bank_transfer', 'upi', 'paypal']
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  donationType: {
    type: String,
    enum: ['general', 'site_specific', 'restoration', 'maintenance'],
    default: 'general'
  },
  heritageSite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HeritageSite'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  receipt: {
    receiptUrl: String,
    receiptNumber: String,
    issuedAt: Date
  },
  taxDeduction: {
    eligible: {
      type: Boolean,
      default: true
    },
    certificateUrl: String,
    panNumber: String
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    },
    nextDonationDate: Date,
    endDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for donor queries
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ status: 1 });
donationSchema.index({ donationType: 1 });

module.exports = mongoose.model('Donation', donationSchema);
