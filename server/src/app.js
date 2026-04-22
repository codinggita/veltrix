const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
const routes = require('./routes');
app.use('/api/v1', routes);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

module.exports = app;
