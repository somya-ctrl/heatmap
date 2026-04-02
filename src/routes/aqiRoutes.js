const express = require('express');
const router  = express.Router();
const {
  getCurrentByCity,
  getCurrentByCoords,
} = require('../controllers/aqiController');

// Order matters — /current must come before /current/:city
router.get('/current',       getCurrentByCoords);  // ?lat=&lng=
router.get('/current/:city', getCurrentByCity);    // :city

module.exports = router;