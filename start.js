#!/usr/bin/env node

// Build and start script for deployment
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting WebRTC SDK deployment...');

try {
  // Build the TypeScript SDK
  console.log('Building TypeScript SDK...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Start the server
  console.log('Starting server...');
  require('./server.js');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}