/**
 * Simple token server example for generating LiveKit access tokens
 * This should be used with the browser example to provide secure token generation
 */

const { AccessToken } = require('livekit-server-sdk');
const http = require('http');
const url = require('url');

// Configuration - these should be set via environment variables in production
const config = {
  apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
  apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
  port: process.env.PORT || 3000
};

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Handle token generation endpoint
  if (req.method === 'POST' && parsedUrl.pathname === '/api/token') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const requestData = JSON.parse(body);
          const { roomName, participantIdentity, participantMetadata } = requestData;

          // Validate required fields
          if (!roomName || !participantIdentity) {
            res.writeHead(400, corsHeaders);
            res.end(JSON.stringify({ 
              error: 'Missing required fields: roomName and participantIdentity' 
            }));
            return;
          }

          // Generate access token
          const token = new AccessToken(config.apiKey, config.apiSecret, {
            identity: participantIdentity,
            metadata: participantMetadata || ''
          });

          // Add room permissions
          token.addGrant({
            room: roomName,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
            canUpdateOwnMetadata: true
          });

          const jwt = token.toJwt();

          // Send token response
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify({ 
            token: jwt,
            roomName: roomName,
            participantIdentity: participantIdentity
          }));

          console.log(`Generated token for ${participantIdentity} in room ${roomName}`);

        } catch (error) {
          console.error('Token generation error:', error);
          res.writeHead(500, corsHeaders);
          res.end(JSON.stringify({ 
            error: 'Failed to generate token',
            details: error.message 
          }));
        }
      });

    } catch (error) {
      console.error('Request processing error:', error);
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }));
    }
  } else {
    // Handle other endpoints
    res.writeHead(404, corsHeaders);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

// Start server
server.listen(config.port, () => {
  console.log(`Token server running on port ${config.port}`);
  console.log('Endpoints:');
  console.log(`  POST http://localhost:${config.port}/api/token - Generate access tokens`);
  console.log('');
  console.log('Environment variables:');
  console.log(`  LIVEKIT_API_KEY: ${config.apiKey ? '✓ Set' : '✗ Not set'}`);
  console.log(`  LIVEKIT_API_SECRET: ${config.apiSecret ? '✓ Set' : '✗ Not set'}`);
  console.log('');
  console.log('Example request:');
  console.log(`curl -X POST http://localhost:${config.port}/api/token \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"roomName": "test-room", "participantIdentity": "user-1"}\'');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down token server...');
  server.close(() => {
    console.log('Token server stopped');
    process.exit(0);
  });
});

module.exports = server;