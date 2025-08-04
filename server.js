const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Health check endpoint for deployments
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'WebRTC SDK Server is running',
    timestamp: new Date().toISOString(),
    version: require('./package.json').version
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Serve built SDK files
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve examples
app.use('/examples', express.static(path.join(__dirname, 'examples')));

// API endpoint to get SDK info
app.get('/api/sdk-info', (req, res) => {
  const packageInfo = require('./package.json');
  res.json({
    name: packageInfo.name,
    version: packageInfo.version,
    description: packageInfo.description,
    main: packageInfo.main,
    types: packageInfo.types
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`WebRTC SDK Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`SDK info: http://localhost:${PORT}/api/sdk-info`);
});

module.exports = app;