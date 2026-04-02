require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const connectDB = require('./src/config/db');

const locationRoutes = require('./src/routes/locationRoutes');
const aqiRoutes      = require('./src/routes/aqiRoutes');      // ← ADD

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/locations', locationRoutes);
app.use('/api/aqi',       aqiRoutes);                          // ← ADD


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));