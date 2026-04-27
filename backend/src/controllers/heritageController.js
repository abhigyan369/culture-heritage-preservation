const HeritageSite = require('../models/HeritageSite');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const path = require('path');

// @desc    Get all heritage sites
// @route   GET /api/heritage
// @access  Public
exports.getHeritageSites = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const city = req.query.city;
    const state = req.query.state;

    // All sites are now active by default
    const query = { status: 'active' };

    if (category) {
      query.category = category;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }

    if (req.query.contributedBy) {
      query.contributedBy = req.query.contributedBy;
    }

    const sites = await HeritageSite.find(query)
      .populate('contributedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HeritageSite.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sites.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: sites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single heritage site
// @route   GET /api/heritage/:id
// @access  Public
exports.getHeritageSite = async (req, res, next) => {
  try {
    const site = await HeritageSite.findById(req.params.id)
      .populate('contributedBy', 'name email')
      .populate('reviews.user', 'name');

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    res.status(200).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new heritage site (always pending)
// @route   POST /api/heritage
// @access  Private
// exports.createHeritageSite = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     // Force status to pending regardless of input
//     req.body.status = 'active';
//     req.body.verified = true;
//     req.body.contributedBy = req.user.id;

//     // Process uploaded images from multer/cloudinary
//     if (req.files && req.files.length > 0) {
//       req.body.images = req.files.map((file, index) => ({
//         url: file.path,
//         public_id: file.filename,
//         caption: req.body[`imageCaption_${index}`] || '',
//         isPrimary: index === 0,
//       }));
//     }

//     const site = await HeritageSite.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: site
//     });
//   } catch (error) {
//     next(error);
//   }
// };
exports.createHeritageSite = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(err => err.msg).join(', ')
      });
    }

    // Set status to active immediately - no review required
    req.body.status = 'active';
    req.body.verified = true;
    req.body.contributedBy = req.user.id;

    // Process uploaded images from local storage
    if (req.files && req.files.length > 0) {
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/heritage-sites/`;
      req.body.images = req.files.map((file, index) => ({
        url: baseUrl + file.filename,
        filename: file.filename,
        caption: req.body[`imageCaption_${index}`] || '',
        isPrimary: index === 0,
      }));
    } else {
      req.body.images = [];
    }

    const site = await HeritageSite.create(req.body);

    res.status(201).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update heritage site
// @route   PUT /api/heritage/:id
// @access  Private
exports.updateHeritageSite = async (req, res, next) => {
  try {
    let site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Check if user is the contributor or admin
    if (site.contributedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this site'
      });
    }

    // Non-admin cannot change status
    if (req.user.role !== 'admin') {
      delete req.body.status;
      delete req.body.verified;
    }

    site = await HeritageSite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete heritage site
// @route   DELETE /api/heritage/:id
// @access  Private/Admin
exports.deleteHeritageSite = async (req, res, next) => {
  try {
    const site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Check authorization: must be admin or the original contributor
    if (site.contributedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this site'
      });
    }

    // Delete local image files
    const fs = require('fs');
    const uploadDir = path.join(__dirname, '../../uploads/heritage-sites/');

    if (site.images && site.images.length > 0) {
      for (const img of site.images) {
        if (img.filename) {
          try {
            fs.unlinkSync(uploadDir + img.filename);
          } catch (err) {
            // Continue even if file delete fails
          }
        }
      }
    }

    await site.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a heritage site (admin only)
// @route   PATCH /api/heritage/:id/verify
// @access  Private/Admin
exports.verifyHeritageSite = async (req, res, next) => {
  try {
    const site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    site.status = 'active';
    site.verified = true;
    site.verifiedBy = req.user.id;
    site.verifiedAt = new Date();
    await site.save();

    res.status(200).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a heritage site (admin only)
// @route   PATCH /api/heritage/:id/reject
// @access  Private/Admin
exports.rejectHeritageSite = async (req, res, next) => {
  try {
    const site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    site.status = 'rejected';
    site.verified = false;
    await site.save();

    res.status(200).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get heritage site statistics
// @route   GET /api/heritage/stats
// @access  Public
exports.getHeritageStats = async (req, res, next) => {
  try {
    const [totalVerified, totalContributors, categoryBreakdown] = await Promise.all([
      HeritageSite.countDocuments({ status: 'active' }),
      HeritageSite.distinct('contributedBy').then(ids => ids.length),
      HeritageSite.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVerified,
        totalContributors,
        categoryBreakdown: categoryBreakdown.map(c => ({
          category: c._id,
          count: c.count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to heritage site
// @route   POST /api/heritage/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = site.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this site'
      });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      visitDate: req.body.visitDate,
      images: req.body.images || []
    };

    site.reviews.push(review);
    await site.updateAverageRating();

    res.status(201).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby heritage sites (GeoJSON compliant)
// @route   GET /api/heritage/nearby
// @access  Public
exports.getNearbySites = async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 50000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const sites = await HeritageSite.find({
      status: 'active',
      geoJson: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).limit(20);

    res.status(200).json({
      success: true,
      count: sites.length,
      data: sites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search heritage sites within map bounds
// @route   GET /api/heritage/search-bounds
// @access  Public
exports.searchByBounds = async (req, res, next) => {
  try {
    const { southWestLng, southWestLat, northEastLng, northEastLat } = req.query;

    if (!southWestLng || !southWestLat || !northEastLng || !northEastLat) {
      return res.status(400).json({
        success: false,
        message: 'Map bounds (southWestLng, southWestLat, northEastLng, northEastLat) are required'
      });
    }

    const sites = await HeritageSite.find({
      status: 'active',
      'location.coordinates.longitude': { $gte: parseFloat(southWestLng), $lte: parseFloat(northEastLng) },
      'location.coordinates.latitude': { $gte: parseFloat(southWestLat), $lte: parseFloat(northEastLat) }
    }).populate('contributedBy', 'name').limit(50);

    res.status(200).json({
      success: true,
      count: sites.length,
      data: sites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search heritage sites with Google Places API fallback
// @route   GET /api/heritage/external-search
// @access  Public
exports.externalSearch = async (req, res, next) => {
  try {
    const { q: query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // First check if we already have it in our database
    const existingSites = await HeritageSite.find({
      $text: { $search: query },
      status: 'active'
    }).limit(5);

    if (existingSites && existingSites.length > 0) {
      return res.status(200).json({
        success: true,
        source: 'database',
        count: existingSites.length,
        data: existingSites
      });
    }

    // If no local results, search Google Places API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        source: 'database',
        count: 0,
        data: [],
        message: 'No results found. Google Places API is not configured for external search.'
      });
    }

    const placesResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query: `${query} heritage site India`,
          key: apiKey,
        }
      }
    );

    const results = placesResponse.data.results;

    if (!results || results.length === 0) {
      return res.status(200).json({
        success: true,
        source: 'external',
        count: 0,
        data: [],
        message: 'No heritage sites found matching your search.'
      });
    }

    // Format results from Google Places
    const formattedResults = results.slice(0, 5).map(place => ({
      name: place.name,
      description: place.formatted_address || 'Real-world heritage location from Google Places',
      category: 'other',
      location: {
        address: place.formatted_address || '',
        city: '',
        state: '',
        country: 'India',
        coordinates: {
          type: 'Point',
          longitude: place.geometry.location.lng,
          latitude: place.geometry.location.lat,
        }
      },
      images: place.photos ? [{
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`,
        caption: place.name,
        isPrimary: true,
      }] : [],
      ratings: {
        average: place.rating || 0,
        count: place.user_ratings_total || 0
      },
      status: 'external', // Mark as external source
      tags: place.types || [],
      isExternal: true, // Flag to indicate this is from external API
    }));

    res.status(200).json({
      success: true,
      source: 'external',
      count: formattedResults.length,
      data: formattedResults,
      message: 'Results from Google Places API. These sites are not yet in our database.'
    });
  } catch (error) {
    next(error);
  }
};

// Validation middleware
exports.validateHeritageSite = [
  body('name').trim().notEmpty().withMessage('Site name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['temple', 'lake', 'monument', 'fort', 'palace', 'museum', 'natural_site', 'archaeological_site', 'other']).withMessage('Invalid category'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('history.established').notEmpty().withMessage('Establishment period is required'),
  body('history.historicalSignificance').notEmpty().withMessage('Historical significance is required')
];

exports.validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required')
];
