const Pollution = require('../models/Location');

// GET /api/locations
// Returns summary of available date range + pollutant stats
const getAllLocations = async (req, res) => {
  try {
    const stats = await Pollution.aggregate([
      {
        $group: {
          _id: null,
          total_records: { $sum: 1 },
          from_date:     { $min: '$datetimeutc' },
          to_date:       { $max: '$datetimeutc' },
          avg_aqi_pm25:  { $avg: '$pm25' },
          avg_pm10:      { $avg: '$pm10' },
          avg_no2:       { $avg: '$no2' },
          avg_co:        { $avg: '$co' },
        }
      }
    ]);

    res.json({
      region: 'NCR',
      stats: stats[0] || {},
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/locations/search?query=delhi
// Since this is NCR-wide data, return records filtered by date or pollutant range
const searchLocation = async (req, res) => {
  try {
    const { query, from, to } = req.query;

    // Build filter
    const filter = {};
    if (from || to) {
      filter.datetimeutc = {};
      if (from) filter.datetimeutc.$gte = new Date(from);
      if (to)   filter.datetimeutc.$lte = new Date(to);
    }

    const results = await Pollution.find(filter)
      .sort({ datetimeutc: -1 })
      .limit(20)
      .select('-_id -__v');

    res.json({
      region: 'NCR',
      query: query || 'NCR',
      count: results.length,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllLocations, searchLocation };