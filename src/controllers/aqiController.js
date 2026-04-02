const {
  getCurrentAQIByCity,
  getCurrentAQIByCoords,
} = require('../services/aqiService');

// GET /api/aqi/current/:city
const getCurrentByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const data = await getCurrentAQIByCity(city);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// GET /api/aqi/current?lat=28.61&lng=77.20
const getCurrentByCoords = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const data = await getCurrentAQIByCoords(lat, lng);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCurrentByCity, getCurrentByCoords };