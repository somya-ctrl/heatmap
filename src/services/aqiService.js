const Pollution        = require('../models/Location');
const { pm25ToAQI, getAQICategory, getAQIColor } = require('../utils/aqiCategory');

// NCR city coordinates — for /api/aqi/current/:city
const NCR_CITIES = {
  delhi:     { lat: 28.6139, lng: 77.2090 },
  noida:     { lat: 28.5355, lng: 77.3910 },
  gurugram:  { lat: 28.4595, lng: 77.0266 },
  ghaziabad: { lat: 28.6692, lng: 77.4538 },
  faridabad: { lat: 28.4089, lng: 77.3178 },
  ncr:       { lat: 28.6139, lng: 77.2090 },
};

// Build formatted AQI response from a DB record
const formatAQIResponse = (record, city) => {
  const aqi = pm25ToAQI(record.pm25);

  return {
    city:     city,
    region:   'NCR',
    current_aqi: aqi,
    category:    getAQICategory(aqi),
    color:       getAQIColor(aqi),
    pollutants: {
      pm25: parseFloat(record.pm25?.toFixed(2)),
      pm10: parseFloat(record.pm10?.toFixed(2)),
      no2:  parseFloat(record.no2?.toFixed(2)),
      no:   parseFloat(record.no?.toFixed(2)),
      nox:  parseFloat(record.nox?.toFixed(2)),
      so2:  parseFloat(record.so2?.toFixed(2)),
      co:   parseFloat(record.co?.toFixed(2)),
      o3:   parseFloat(record.o3?.toFixed(2)),
    },
    weather: {
      temperature:      parseFloat(record.temperature?.toFixed(2)),
      humidity:         parseFloat(record.relativehumidity?.toFixed(2)),
      wind_speed:       parseFloat(record.wind_speed?.toFixed(2)),
      wind_direction:   parseFloat(record.wind_direction?.toFixed(2)),
    },
    recorded_at: record.datetimeutc,
  };
};

// GET /api/aqi/current/:city
const getCurrentAQIByCity = async (city) => {
  const cityKey = city.toLowerCase();

  // Check if city is in NCR
  if (!NCR_CITIES[cityKey] && cityKey !== 'ncr') {
    throw new Error(`City "${city}" not found. Supported: ${Object.keys(NCR_CITIES).join(', ')}`);
  }

  // Get latest record from DB
  const latest = await Pollution.findOne()
    .sort({ datetimeutc: -1 })
    .select('-_id -__v');

  if (!latest) throw new Error('No data available in database');

  return formatAQIResponse(latest, city);
};

// GET /api/aqi/current?lat=28.61&lng=77.20
const getCurrentAQIByCoords = async (lat, lng) => {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  // Find closest NCR city to given coordinates
  let closestCity = 'NCR';
  let minDistance = Infinity;

  for (const [city, coords] of Object.entries(NCR_CITIES)) {
    const dist = Math.sqrt(
      Math.pow(parsedLat - coords.lat, 2) +
      Math.pow(parsedLng - coords.lng, 2)
    );
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city;
    }
  }

  // Check if coords are within NCR range (roughly)
  const NCR_CENTER = { lat: 28.6139, lng: 77.2090 };
  const distFromNCR = Math.sqrt(
    Math.pow(parsedLat - NCR_CENTER.lat, 2) +
    Math.pow(parsedLng - NCR_CENTER.lng, 2)
  );

  // If too far from NCR (> ~1.5 degrees), warn but still return data
  const isInNCR = distFromNCR < 1.5;

  const latest = await Pollution.findOne()
    .sort({ datetimeutc: -1 })
    .select('-_id -__v');

  if (!latest) throw new Error('No data available in database');

  const response = formatAQIResponse(latest, closestCity);

  return {
    ...response,
    requested_coords: { lat: parsedLat, lng: parsedLng },
    nearest_city: closestCity,
    in_ncr_region: isInNCR,
    note: isInNCR
      ? 'Data from NCR sensor network'
      : 'Coordinates outside NCR — showing nearest NCR data',
  };
};

module.exports = {
  getCurrentAQIByCity,
  getCurrentAQIByCoords,
  NCR_CITIES,
};