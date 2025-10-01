const express = require('express');

const app = express();

/**
 * Health check endpoint
 * Returns 200 OK with basic service status
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
