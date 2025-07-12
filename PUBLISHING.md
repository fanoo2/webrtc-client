# Publishing Guide for WebRTC Client SDK

## Prerequisites for Publishing

1. **Create npm account**: Sign up at https://www.npmjs.com/signup
2. **Login to npm**: Run `npm login` in your terminal
3. **Update package.json**: Replace current package.json with the configuration below

## Required package.json Changes

Since the package.json file is protected in this environment, you'll need to manually update it with these changes:

```json
{
  "name": "@your-org/webrtc-client",
  "version": "1.0.0",
  "description": "A TypeScript-based WebRTC client SDK built on top of LiveKit for real-time video and audio communication",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist/",
    "README.md"
  ],
  "scripts": {
    "build": "tsc",
    "test": "node test-sdk.js",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "webrtc",
    "livekit",
    "video",
    "audio",
    "realtime",
    "typescript",
    "sdk"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "ISC",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-org/webrtc-client.git"
  },
  "peerDependencies": {
    "livekit-client": "^2.15.2"
  },
  "devDependencies": {
    "livekit-client": "^2.15.2",
    "livekit-server-sdk": "^2.13.1",
    "typescript": "^5.8.3",
    "ts-node": "^10.9.2",
    "@types/node": "^24.0.13"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## Publishing Steps

1. **Update package.json** with the configuration above
2. **Choose a unique package name**:
   - Check availability: `npm search @your-org/webrtc-client`
   - Or use unscoped name: `webrtc-client-yourname`

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Test the package**:
   ```bash
   npm test
   ```

5. **Publish to npm**:
   ```bash
   npm publish --access public
   ```

## Important Notes

- **Package Name**: Must be unique on npm registry
- **Scoped Packages**: Use `@your-org/package-name` format
- **Version**: Follow semantic versioning (major.minor.patch)
- **Files**: Only `dist/` and `README.md` will be published
- **Dependencies**: LiveKit client is a peer dependency

## After Publishing

Users can install your SDK with:
```bash
npm install @your-org/webrtc-client livekit-client
```

And use it like:
```javascript
const { createRoomClient } = require('@your-org/webrtc-client');
const roomClient = createRoomClient();
```

## Troubleshooting

- **403 Forbidden**: Check package name availability
- **Need Auth**: Run `npm login` first
- **Build Errors**: Ensure TypeScript compiles without errors
- **Missing Files**: Check the `files` array in package.json