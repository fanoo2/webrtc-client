# WebRTC Client SDK

A TypeScript-based WebRTC client SDK built on top of LiveKit for real-time video and audio communication.

## Features

- 🎥 Real-time video and audio communication
- 🔧 TypeScript-first with comprehensive type safety
- 🚀 Easy-to-use factory functions
- 📊 Built-in logging and debugging
- 🔌 Extensible configuration system
- 🌐 Modern ES2020/CommonJS compatible
- 🌍 **Dual CJS/ESM builds** - Works in both Node.js and browser environments
- 🔒 **Browser-safe** - Proper server-side token generation with client-side security

## Installation

```bash
npm install
npm run build
```

## Quick Start

### 1. Set up environment variables

Create a `.env` file or set environment variables:

```env
LIVEKIT_API_KEY=your_api_key_here
LIVEKIT_API_SECRET=your_api_secret_here
LIVEKIT_URL=ws://localhost:7881  # Optional, defaults to localhost
```

### 2. Basic Usage

```javascript
const { createRoomClient } = require('./dist/index.js');

async function startVideoCall() {
  // Create room client with automatic configuration
  const roomClient = createRoomClient();
  
  // Connect to a room
  await roomClient.connectToRoom({
    roomName: 'my-video-room',
    participantIdentity: 'user-123',
    participantMetadata: 'John Doe'
  });
  
  console.log('Connected to room!');
  console.log('Room info:', roomClient.getRoomInfo());
}

startVideoCall().catch(console.error);
```

### 3. Custom Configuration

```javascript
const { createRoomClientWithConfig } = require('./dist/index.js');

const roomClient = createRoomClientWithConfig({
  url: 'wss://your-livekit-server.com',
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  roomOptions: {
    adaptiveStream: true,
    dynacast: true
  }
});
```

## Browser Usage

The SDK supports both Node.js and browser environments with dual CJS/ESM builds. For browser security, use a token provider instead of API keys.

### Browser Example with Token Provider

```javascript
// ES module import in browser
import { createRoomClientWithConfig } from '@fanno/webrtc-client';

// Token provider function that calls your server
async function tokenProvider(params) {
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const data = await response.json();
  return data.token;
}

// Create browser-safe room client
const roomClient = createRoomClientWithConfig({
  url: 'wss://your-livekit-server.com',
  tokenProvider: tokenProvider, // Secure token generation
  roomOptions: {
    adaptiveStream: true,
    dynacast: true
  }
});
```

### Package Exports

The package provides proper module exports for different environments:

```json
{
  "main": "dist/index.cjs.js",     // CommonJS for Node.js
  "module": "dist/index.esm.js",   // ES modules for browsers/bundlers
  "types": "dist/index.d.ts",      // TypeScript declarations
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  }
}
```

**📖 See [BROWSER_USAGE.md](./BROWSER_USAGE.md) for complete browser setup guide and security best practices.**

## API Reference

### Factory Functions

- `createRoomClient()` - Creates a room client with environment configuration
- `createRoomClientWithConfig(config)` - Creates a room client with custom configuration
- `setLogLevel(level)` - Sets the logging level ('debug', 'info', 'warn', 'error')

### RoomClient Methods

- `connectToRoom(params)` - Connect to a LiveKit room
- `disconnectFromRoom()` - Disconnect from the current room
- `getConnectionStatus()` - Get current connection status
- `getRoomInfo()` - Get room information
- `getLocalParticipant()` - Get local participant info
- `getRemoteParticipants()` - Get all remote participants

## Development

### Build the project
```bash
npm run build
```

### Test the SDK
```bash
node test-sdk.js
```

### Project Structure

```
src/
├── client/          # Room client implementation
├── types/           # TypeScript type definitions
├── utils/           # Utilities (config, logging)
└── index.ts         # Main entry point
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LIVEKIT_API_KEY` | ✅ | - | LiveKit API key |
| `LIVEKIT_API_SECRET` | ✅ | - | LiveKit API secret |
| `LIVEKIT_URL` | ❌ | `ws://localhost:7881` | LiveKit server URL |

## License

ISC License