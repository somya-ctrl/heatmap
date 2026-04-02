require('dotenv').config();
const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');
const csv      = require('csv-parser');
const Pollution = require('../models/Location');

const CSV_PATH = path.join(__dirname, '..', '..', 'ncr_cleaned_pollution_dataset.csv');

const importCSV = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Clear old data
  await Pollution.deleteMany({});
  console.log('Old data cleared');

  const records = [];

  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', (row) => {
      records.push({
        datetimeutc:      new Date(row.datetimeutc),
        co:               parseFloat(row.co)               || null,
        no:               parseFloat(row.no)               || null,
        no2:              parseFloat(row.no2)              || null,
        nox:              parseFloat(row.nox)              || null,
        o3:               parseFloat(row.o3)               || null,
        pm10:             parseFloat(row.pm10)             || null,
        pm25:             parseFloat(row.pm25)             || null,
        relativehumidity: parseFloat(row.relativehumidity) || null,
        so2:              parseFloat(row.so2)              || null,
        temperature:      parseFloat(row.temperature)      || null,
        wind_direction:   parseFloat(row.wind_direction)   || null,
        wind_speed:       parseFloat(row.wind_speed)       || null,
      });
    })
    .on('end', async () => {
      await Pollution.insertMany(records);
      console.log(`✅ Imported ${records.length} records from CSV`);
      process.exit();
    })
    .on('error', (err) => {
      console.error('CSV Error:', err.message);
      process.exit(1);
    });
};

importCSV();