const HeritageSite = require('../models/HeritageSite');
const { validationResult } = require('express-validator');

// @desc    Search heritage sites
// @route   GET /api/explore/search
// @access  Public
exports.searchSites = async (req, res, next) => {
  try {
    const {
      q: query,
      category,
      city,
      state,
      minRating,
      maxDistance,
      lat,
      lng,
      page = 1,
      limit = 10
    } = req.query;

    // Build search query
    const searchQuery = { status: 'active' };

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Category filter
    if (category) {
      searchQuery.category = category;
    }

    // Location filters
    if (city) {
      searchQuery['location.city'] = new RegExp(city, 'i');
    }

    if (state) {
      searchQuery['location.state'] = new RegExp(state, 'i');
    }

    // Rating filter
    if (minRating) {
      searchQuery['ratings.average'] = { $gte: parseFloat(minRating) };
    }

    // Geospatial search
    let sites;
    if (lat && lng && maxDistance) {
      // Use geospatial query
      let queryObj = HeritageSite.find(searchQuery)
        .where('location.coordinates')
        .near({
          center: [parseFloat(lng), parseFloat(lat)],
          maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
        });
        
      if (query) {
        queryObj = queryObj.sort({ score: { $meta: 'textScore' } });
      }
      
      sites = await queryObj
        .populate('contributedBy', 'name')
        .limit(parseInt(limit) * 1)
        .skip((parseInt(page) - 1) * parseInt(limit));
    } else {
      // Regular search
      let queryObj = HeritageSite.find(searchQuery)
        .populate('contributedBy', 'name');
        
      if (query) {
        queryObj = queryObj.sort({ score: { $meta: 'textScore' }, 'ratings.average': -1 });
      } else {
        queryObj = queryObj.sort({ 'ratings.average': -1, createdAt: -1 });
      }
      
      sites = await queryObj
        .limit(parseInt(limit) * 1)
        .skip((parseInt(page) - 1) * parseInt(limit));
    }

    const total = await HeritageSite.countDocuments(searchQuery);

    // Calculate distances if coordinates are provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      
      sites = sites.map(site => {
        const siteObj = site.toObject();
        const distance = calculateDistance(
          userLat,
          userLng,
          site.location.coordinates.latitude,
          site.location.coordinates.longitude
        );
        siteObj.distance = distance;
        return siteObj;
      });
    }

    res.status(200).json({
      success: true,
      count: sites.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: sites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended heritage sites
// @route   GET /api/explore/recommendations
// @access  Public
exports.getRecommendations = async (req, res, next) => {
  try {
    const { limit = 6, category, lat, lng } = req.query;

    // Build query for active sites (include both rated and unrated)
    const query = { status: 'active' };

    if (category) {
      query.category = category;
    }

    let sites;
    if (lat && lng) {
      // Get nearby sites
      sites = await HeritageSite.find(query)
        .where('location.coordinates')
        .near({
          center: [parseFloat(lng), parseFloat(lat)],
          maxDistance: 100000 // 100km radius
        })
        .populate('contributedBy', 'name')
        .sort({ 'ratings.average': -1, createdAt: -1 })
        .limit(parseInt(limit));
    } else {
      // Get recent and highly rated sites
      sites = await HeritageSite.find(query)
        .populate('contributedBy', 'name')
        .sort({ 'ratings.average': -1, createdAt: -1 })
        .limit(parseInt(limit));
    }

    // Add distance if coordinates provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      sites = sites.map(site => {
        const siteObj = site.toObject();
        const distance = calculateDistance(
          userLat,
          userLng,
          site.location.coordinates.latitude,
          site.location.coordinates.longitude
        );
        siteObj.distance = distance;
        return siteObj;
      });
    }

    res.status(200).json({
      success: true,
      count: sites.length,
      data: sites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular categories
// @route   GET /api/explore/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await HeritageSite.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$ratings.average' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Format response
    const formattedCategories = categories.map(cat => ({
      name: cat._id,
      count: cat.count,
      averageRating: Math.round(cat.avgRating * 10) / 10
    }));

    res.status(200).json({
      success: true,
      data: formattedCategories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top destinations
// @route   GET /api/explore/top-destinations
// @access  Public
exports.getTopDestinations = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const topSites = await HeritageSite.find({ status: 'active' })
      .populate('contributedBy', 'name')
      .sort({ 'ratings.average': -1, 'ratings.count': -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: topSites.length,
      data: topSites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sites by state/city
// @route   GET /api/explore/locations
// @access  Public
exports.getSitesByLocation = async (req, res, next) => {
  try {
    const { type = 'state', limit = 20 } = req.query;

    let groupBy;
    if (type === 'city') {
      groupBy = '$location.city';
    } else {
      groupBy = '$location.state';
    }

    const locations = await HeritageSite.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
          avgRating: { $avg: '$ratings.average' },
          sites: { $push: { name: '$name', _id: '$_id', category: '$category' } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Format response
    const formattedLocations = locations.map(loc => ({
      name: loc._id,
      count: loc.count,
      averageRating: Math.round(loc.avgRating * 10) / 10,
      sites: loc.sites.slice(0, 5) // Limit to 5 sites per location
    }));

    res.status(200).json({
      success: true,
      count: formattedLocations.length,
      data: formattedLocations
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Validation middleware
exports.validateSearch = [
  // Add validation if needed for search parameters
];
