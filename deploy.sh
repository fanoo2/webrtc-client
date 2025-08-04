#!/bin/bash

# Deployment script for WebRTC SDK
set -e

echo "Starting WebRTC SDK deployment..."

# Build the TypeScript SDK
echo "Building TypeScript SDK..."
node build.js

# Verify build output
if [ ! -d "dist" ]; then
    echo "Error: Build failed - dist directory not found"
    exit 1
fi

echo "Build completed successfully!"

# Start the server
echo "Starting server on port 5000..."
exec node server.js