# WebRTC SDK - Replit Deployment Guide

## Fixed Deployment Issues

The following deployment issues have been resolved:

### ✅ 1. Fixed Run Command
- **Issue**: Invalid run command using `bash -c printf`
- **Solution**: Created proper Node.js server with `node server.js`
- **File**: `server.js` - Express server serving health checks and SDK files

### ✅ 2. Build Command Configuration
- **Issue**: No build command configured
- **Solution**: Created `build.js` script that compiles TypeScript to JavaScript
- **Command**: `node build.js` runs `tsup` to build the SDK

### ✅ 3. HTTP Server with Health Checks
- **Issue**: No health check endpoint
- **Solution**: Created Express server with multiple endpoints:
  - `GET /` - Main health check for deployment
  - `GET /health` - Detailed health status
  - `GET /api/sdk-info` - SDK information
  - `GET /dist/*` - Serve built SDK files
  - `GET /examples/*` - Serve example files

### ✅ 4. Package.json Start Script
- **Issue**: Missing start script
- **Solution**: Created workflow with proper start command
- **Workflow**: "Build and Start Server" runs build and starts server

### ✅ 5. Port Configuration
- **Issue**: No proper port exposure
- **Solution**: Server configured to run on port 5000 (0.0.0.0 binding)
- **Environment**: Uses `PORT` environment variable with fallback to 5000

## Deployment Commands

### For Replit Deployment:
```bash
# Build command
node build.js

# Run command  
node server.js

# Combined deployment
./deploy.sh
```

### For Manual Testing:
```bash
# Build the SDK
npm run build

# Start the server
node server.js

# Test health check
curl http://localhost:5000/health
```

## Server Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/` | Main health check | JSON with status and version |
| `/health` | Detailed health status | JSON with uptime and timestamp |
| `/api/sdk-info` | SDK package information | JSON with name, version, description |
| `/dist/*` | Built SDK files | Static files from dist/ |
| `/examples/*` | Example files | Static files from examples/ |

## Environment Variables

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (production/development)
- `LIVEKIT_API_KEY`: LiveKit API key (for SDK functionality)
- `LIVEKIT_API_SECRET`: LiveKit API secret (for SDK functionality)
- `LIVEKIT_URL`: LiveKit server URL (for SDK functionality)

## Build Process

1. **TypeScript Compilation**: `tsup` compiles `src/index.ts` to multiple formats
2. **Output Formats**: 
   - CommonJS: `dist/index.cjs.js`
   - ES Modules: `dist/index.esm.js`
   - Type Definitions: `dist/index.d.ts`
3. **Health Check**: Server confirms successful build and startup

## Deployment Verification

After deployment, verify the following:

```bash
# Check main endpoint
curl https://your-app.replit.app/

# Check health
curl https://your-app.replit.app/health

# Check SDK info
curl https://your-app.replit.app/api/sdk-info
```

Expected responses:
- All endpoints return JSON
- Status codes are 200
- No error messages in logs

## Troubleshooting

### Build Failures
- Check TypeScript compilation errors in logs
- Verify all source files exist in `src/`
- Ensure `tsconfig.json` is valid

### Server Startup Issues
- Check port 5000 is available
- Verify Express is installed
- Check for syntax errors in `server.js`

### Health Check Failures
- Ensure server is running on correct port
- Verify endpoints return valid JSON
- Check for application errors in logs