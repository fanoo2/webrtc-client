# Browser Usage Guide

This guide explains how to use the WebRTC Client SDK in browser environments with proper token security.

## Installation

The SDK is available as both CommonJS and ES modules:

```bash
npm install @fanno/webrtc-client
```

## Browser Compatibility

The SDK provides dual-build support:

- **ESM Build**: `dist/index.esm.js` - For modern browsers and bundlers
- **CJS Build**: `dist/index.cjs.js` - For Node.js environments

### Import in Browser (ES Modules)

```javascript
import { createRoomClientWithConfig, setLogLevel } from '@fanno/webrtc-client';
```

### Import in Node.js (CommonJS)

```javascript
const { createRoomClientWithConfig, setLogLevel } = require('@fanno/webrtc-client');
```

## Token Security in Browser Environments

**Important**: For security reasons, API keys and secrets should NEVER be included in client-side code. Instead, use a token provider function that calls your secure server endpoint.

### 1. Set Up Token Server

Create a secure server endpoint to generate tokens:

```javascript
// examples/token-server.js
const { AccessToken } = require('livekit-server-sdk');

app.post('/api/token', async (req, res) => {
  const { roomName, participantIdentity, participantMetadata } = req.body;
  
  const token = new AccessToken(API_KEY, API_SECRET, {
    identity: participantIdentity,
    metadata: participantMetadata || ''
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true
  });

  res.json({ token: token.toJwt() });
});
```

### 2. Configure Client with Token Provider

```javascript
import { createRoomClientWithConfig } from '@fanno/webrtc-client';

// Token provider function that calls your server
async function tokenProvider(params) {
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomName: params.roomName,
      participantIdentity: params.participantIdentity,
      participantMetadata: params.participantMetadata
    })
  });
  
  const data = await response.json();
  return data.token;
}

// Create room client with token provider
const roomClient = createRoomClientWithConfig({
  url: 'wss://your-livekit-server.com',
  tokenProvider: tokenProvider, // Use token provider instead of API keys
  roomOptions: {
    adaptiveStream: true,
    dynacast: true
  }
});
```

### 3. Connect to Room

```javascript
// Connect to a room
await roomClient.connectToRoom({
  roomName: 'my-room',
  participantIdentity: 'user-123',
  participantMetadata: JSON.stringify({ role: 'participant' })
});

// Set up event listeners
roomClient.on('participantConnected', (participant) => {
  console.log('Participant joined:', participant.identity);
});

roomClient.on('participantDisconnected', (participant) => {
  console.log('Participant left:', participant.identity);
});
```

## Complete Browser Example

See `examples/browser-token-provider.html` for a complete working example that demonstrates:

- Proper ES module imports
- Secure token generation via server endpoint
- Room connection and participant management
- Event handling and UI updates

## Running the Examples

1. **Start the token server**:
   ```bash
   LIVEKIT_API_KEY=your-key LIVEKIT_API_SECRET=your-secret node examples/token-server.js
   ```

2. **Serve the browser example**:
   ```bash
   # Use any static file server
   python -m http.server 8000
   # Then open http://localhost:8000/examples/browser-token-provider.html
   ```

3. **Configure the browser example**:
   - Set your LiveKit server URL
   - Set token endpoint to `http://localhost:3000/api/token`
   - Enter room name and participant name
   - Click "Connect to Room"

## Package.json Exports

The package properly supports both module systems:

```json
{
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  }
}
```

## Best Practices

1. **Never expose API secrets in browser code**
2. **Always use HTTPS in production**
3. **Implement proper authentication on your token endpoint**
4. **Add rate limiting to your token endpoint**
5. **Validate room access permissions server-side**
6. **Set appropriate token expiration times**

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution issues, ensure your bundler supports the `exports` field in package.json. Most modern bundlers (Webpack 5+, Vite, etc.) support this automatically.

### CORS Issues

Make sure your token server includes proper CORS headers for browser requests:

```javascript
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type');
```