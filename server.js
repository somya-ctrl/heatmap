require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const connectDB = require('./src/config/db');

const locationRoutes = require('./src/routes/locationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/locations', locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));