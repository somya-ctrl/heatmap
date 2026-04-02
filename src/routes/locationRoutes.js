const express = require('express');
const router  = express.Router();
const { getAllLocations, searchLocation } = require('../controllers/locationController');

router.get('/',       getAllLocations);   // GET /api/locations
router.get('/search', searchLocation);   // GET /api/locations/search?query=delhi

module.exports = router;