const express = require('express');
const {
  searchSites,
  getRecommendations,
  getCategories,
  getTopDestinations,
  getSitesByLocation
} = require('../controllers/exploreController');

const router = express.Router();

// Public routes
router.get('/search', searchSites);
router.get('/recommendations', getRecommendations);
router.get('/categories', getCategories);
router.get('/top-destinations', getTopDestinations);
router.get('/locations', getSitesByLocation);

module.exports = router;
