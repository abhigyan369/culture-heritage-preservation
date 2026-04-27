const mongoose = require('mongoose');

const heritageSiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['temple', 'lake', 'monument', 'fort', 'palace', 'museum', 'natural_site', 'archaeological_site', 'other']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: -180,
        max: 180
      },
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: -90,
        max: 90
      }
    }
  },
  geoJson: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  history: {
    established: {
      type: String,
      required: [true, 'Establishment period is required']
    },
    historicalSignificance: {
      type: String,
      required: [true, 'Historical significance is required']
    },
    architecture: String,
    culturalImportance: String
  },
  // images: [{
  //   url: {
  //     type: String,
  //     required: true
  //   },
  //   public_id: String,
  //   caption: String,
  //   isPrimary: {
  //     type: Boolean,
  //     default: false
  //   }
  // }],
  images: {
  type: [Object],
  default: []
  },
  videos: [{
    url: String,
    title: String,
    duration: String
  }],
  visitorInfo: {
    visitingHours: {
      opening: String,
      closing: String,
      closedDays: [String]
    },
    entryFee: {
      adults: Number,
      children: Number,
      foreigners: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    bestTimeToVisit: String,
    estimatedDuration: String,
    facilities: [String]
  },
  accessibility: {
    wheelchairAccess: {
      type: Boolean,
      default: false
    },
    parkingAvailable: {
      type: Boolean,
      default: false
    },
    publicTransport: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000
    },
    images: [String],
    visitDate: Date,
    helpful: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'pending'
  },
  tags: [String],
  contributedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
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

// Index for search functionality
heritageSiteSchema.index({ 
  name: 'text', 
  description: 'text', 
  'location.city': 'text', 
  'location.state': 'text',
  tags: 'text'
});

// Geospatial index for location-based queries (GeoJSON compliant)
heritageSiteSchema.index({ geoJson: '2dsphere' });

// Pre-save hook to sync geoJson from location.coordinates
heritageSiteSchema.pre('save', function(next) {
  if (this.location && this.location.coordinates) {
    this.geoJson = {
      type: 'Point',
      coordinates: [this.location.coordinates.longitude, this.location.coordinates.latitude]
    };
  }
  next();
});

// Update average rating when new review is added
heritageSiteSchema.methods.updateAverageRating = function() {
  const totalRatings = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.ratings.average = totalRatings / this.reviews.length;
  this.ratings.count = this.reviews.length;
  return this.save();
};

module.exports = mongoose.model('HeritageSite', heritageSiteSchema);
