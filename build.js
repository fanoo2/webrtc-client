#!/usr/bin/env node

// Build script for deployment
const { execSync } = require('child_process');

console.log('Building WebRTC TypeScript SDK...');

try {
  // Clean any existing build
  console.log('Cleaning previous build...');
  execSync('rm -rf dist', { stdio: 'inherit' });
  
  // Build TypeScript SDK
  console.log('Running TypeScript build...');
  execSync('npx tsup src/index.ts --format cjs,esm --dts', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}