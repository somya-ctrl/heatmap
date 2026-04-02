const mongoose = require('mongoose');

const PollutionSchema = new mongoose.Schema({
  datetimeutc:      { type: Date, required: true, index: true },
  co:               Number,
  no:               Number,
  no2:              Number,
  nox:              Number,
  o3:               Number,
  pm10:             Number,
  pm25:             Number,
  relativehumidity: Number,
  so2:              Number,
  temperature:      Number,
  wind_direction:   Number,
  wind_speed:       Number,
}, { timestamps: true });

module.exports = mongoose.model('Pollution', PollutionSchema);