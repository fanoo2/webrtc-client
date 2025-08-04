# WebRTC Client SDK

## Overview

This is a complete TypeScript-based WebRTC client SDK built on top of LiveKit. The project provides a simplified wrapper around the LiveKit client library for real-time video and audio communication. The SDK is fully functional with proper TypeScript compilation, comprehensive examples, and ready for integration into web applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The SDK follows a clean, modular architecture with clear separation of concerns:

### Frontend Architecture
- **TypeScript-first approach**: All code is written in TypeScript with strict type checking enabled
- **ES2020 modules**: Uses modern ECMAScript modules for better tree-shaking and bundling
- **Client-side SDK**: Designed to run in browser environments with DOM API access

### Core Components
- **RoomClient**: Main client wrapper that extends LiveKit's Room class
- **Configuration Management**: Environment-based configuration with validation
- **Type System**: Comprehensive TypeScript interfaces for type safety
- **Logging**: Simple, configurable logging system

## Key Components

### 1. RoomClient (`src/client/RoomClient.ts`)
- **Purpose**: Enhanced wrapper around LiveKit's Room class
- **Key Features**: 
  - Automatic connection state management
  - Event handling and lifecycle management
  - Custom configuration support
  - Built-in error handling and logging

### 2. Configuration System (`src/utils/config.ts`)
- **Purpose**: Centralized configuration management
- **Key Features**:
  - Environment variable validation
  - Fallback values for development
  - Type-safe configuration objects
  - Required environment variables: `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
  - Optional: `LIVEKIT_URL` (defaults to `ws://localhost:7881`)

### 3. Type Definitions (`src/types/index.ts`)
- **Purpose**: Comprehensive type safety across the SDK
- **Key Interfaces**:
  - `RoomClientConfig`: Configuration for creating room clients
  - `RoomConnectionParams`: Parameters for room connections
  - `LiveKitRoom`: Extended room interface with custom methods
  - `RoomEvents`: Event type definitions

### 4. Logging System (`src/utils/logger.ts`)
- **Purpose**: Configurable logging with multiple levels
- **Features**: Debug, info, warn, and error levels with conditional output

### 5. Main Entry Point (`src/index.ts`)
- **Purpose**: Public API surface for the SDK
- **Exports**: Factory functions for creating room clients with automatic or custom configuration

## Data Flow

1. **Initialization**: SDK reads configuration from environment variables or accepts custom config
2. **Room Creation**: Factory functions create configured RoomClient instances
3. **Connection**: Clients connect to LiveKit servers using WebRTC protocols
4. **Event Handling**: Real-time events are processed and forwarded to application code
5. **State Management**: Connection states are tracked and exposed to consumers

## External Dependencies

### Core Dependencies
- **livekit-client** (v2.15.2): Main WebRTC client library for real-time communication
- **livekit-server-sdk** (v2.13.1): Server-side SDK for token generation and room management
- **typescript** (v5.8.3): TypeScript compiler and tooling
- **@types/node** (v24.0.13): Node.js type definitions

### LiveKit Protocol Dependencies
- **@livekit/protocol**: Protocol definitions for LiveKit communication
- **@livekit/mutex**: Thread-safe mutex implementation
- **@bufbuild/protobuf**: Protocol buffer implementation

## Deployment Strategy

### Build Configuration
- **Target**: ES2020 for modern browser compatibility
- **Module System**: ES2020 modules for optimal bundling
- **Output**: Compiled JavaScript with source maps and type declarations
- **Source Directory**: `src/` with TypeScript files
- **Build Directory**: `dist/` for compiled output

### Environment Requirements
- **Node.js**: Compatible with modern Node.js versions
- **Browser Support**: Modern browsers with WebRTC support
- **Environment Variables**: Requires LiveKit server credentials for production use

### Integration Approach
- **Package Distribution**: Can be published as npm package
- **Direct Integration**: Can be directly imported into TypeScript/JavaScript projects
- **Development Setup**: Supports local development with default LiveKit server URL

### Security Considerations
- **API Credentials**: Requires secure handling of LiveKit API keys and secrets
- **Environment Variables**: Sensitive configuration should be managed through environment variables
- **Client-Side Safety**: API secrets should not be exposed in client-side builds

## Recent Changes (August 2025)

### GitHub Actions & CI/CD Improvements
- **Standardized Node.js Version**: Updated both CI and Release workflows to use Node 20 only
- **Fixed Secret Fallbacks**: Replaced invalid `${{ secrets.LIVEKIT_API_KEY || 'test-key' }}` syntax with proper conditional expressions
- **Added Helm Validation**: Integrated `helm lint` and `helm template` validation in CI/release pipelines
- **Version Consistency Checking**: Added automated version synchronization between package.json and Chart.yaml
- **Streamlined CI**: Removed Node.js 16.x and 18.x from build matrix for consistency

### Helm Chart Enhancements
- **Version Synchronization**: Updated Chart.yaml version from 0.1.0 to 1.0.5 to match package.json
- **Improved Documentation**: Enhanced README with clear LiveKit secrets requirements
- **Production Values Template**: Added comprehensive production values example
- **Deployment Variables Guide**: Documented all customizable parameters for scaling, resources, and networking
- **Security Documentation**: Clarified required Kubernetes secrets for LiveKit credentials

### Automation Scripts
- **Version Consistency Tool**: Created `scripts/check-version-consistency.js` for automated version management
- **CI Integration**: Both workflows now use the script for version validation and automatic fixes

## Deployment Fixes (August 2025)

### Replit Deployment Configuration
All deployment issues have been resolved with the following fixes:

#### ✅ Fixed Run Command Issue
- **Problem**: Invalid run command using `bash -c printf` instead of proper application start
- **Solution**: Created `server.js` - Express server with health check endpoints
- **Command**: `node server.js` now properly starts the application

#### ✅ Build Command Configuration  
- **Problem**: No build command configured for TypeScript compilation
- **Solution**: Created `build.js` script that runs TypeScript compilation via tsup
- **Command**: `node build.js` compiles TypeScript to JavaScript in dist/

#### ✅ HTTP Server with Health Checks
- **Problem**: Deployment failing health checks on / endpoint
- **Solution**: Express server with multiple endpoints:
  - `GET /` - Main health check returning JSON status
  - `GET /health` - Detailed health status with uptime
  - `GET /api/sdk-info` - SDK package information
  - `GET /dist/*` - Serve built SDK files
  - `GET /examples/*` - Serve example files

#### ✅ Start Script Addition
- **Problem**: Missing start script in package.json
- **Solution**: Created workflow "Build and Start Server" with proper startup sequence
- **Process**: Builds TypeScript SDK then starts Express server

#### ✅ Port Configuration
- **Problem**: No proper port exposure configured
- **Solution**: Server runs on port 5000 with 0.0.0.0 binding for external access
- **Environment**: Uses PORT environment variable with fallback to 5000

### Deployment Files Created
- `server.js` - Express server for health checks and file serving
- `build.js` - TypeScript compilation script
- `start.js` - Combined build and start script
- `deploy.sh` - Complete deployment script
- `deployment-config.json` - Deployment configuration reference
- `REPLIT_DEPLOYMENT.md` - Comprehensive deployment guide

### Verification
The deployment is now working correctly:
- ✅ Health check endpoint responds with JSON status
- ✅ Build process compiles TypeScript successfully  
- ✅ Server starts on correct port (5000)
- ✅ All endpoints return proper responses
- ✅ Ready for Replit deployment

### Documentation Updates
- **Main README**: Added explicit LiveKit credentials requirements and Kubernetes deployment guidance
- **Helm README**: Comprehensive deployment variables documentation and production examples
- **Security Guidelines**: Clear guidance on handling API keys in development vs production

## Project Status

### Completed Features ✅
- **Core SDK Implementation**: Fully functional WebRTC client wrapper
- **Dual CJS/ESM Builds**: Both CommonJS and ES module outputs via TSUp bundling
- **Browser Compatibility**: Proper server-side import guarding and token provider support
- **Configuration System**: Environment variable support with browser-safe fallbacks
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions
- **Logging System**: Configurable logging with multiple levels
- **Factory Functions**: Easy-to-use client creation methods
- **Error Handling**: Robust error handling and connection state management
- **Documentation**: Complete README with API reference and browser usage guide
- **Testing**: Basic SDK testing to verify functionality
- **Security**: Browser-safe token generation via server endpoints
- **CI/CD Pipeline**: Standardized GitHub Actions with Node 20, proper secret handling, and Helm validation
- **Helm Deployment**: Production-ready Helm chart with comprehensive configuration options
- **Version Management**: Automated synchronization between package.json and Helm chart versions

### Testing Results
- **SDK Initialization**: ✅ Successfully creates room clients
- **Configuration Loading**: ✅ Reads environment variables correctly (with browser fallbacks)
- **TypeScript Compilation**: ✅ Builds without errors to dist/ directory (dual CJS/ESM)
- **API Compatibility**: ✅ Works with LiveKit 2.15.2 client SDK
- **Node.js Testing**: ✅ Basic functionality verified (creation, status checks)
- **Browser Compatibility**: ✅ ES module imports work correctly with proper token provider setup
- **Server-Side Imports**: ✅ Properly guarded to prevent browser loading issues

### Project Files
- **Source Code**: Complete TypeScript implementation in `src/`
- **Compiled Output**: JavaScript files in `dist/` directory
- **Examples**: Node.js and browser examples in `examples/`
- **Tests**: Basic functionality test in `test-sdk.js`
- **Documentation**: README.md with usage instructions

### Environment Setup
- **Dependencies**: LiveKit client and server SDKs installed
- **Secrets**: LIVEKIT_API_KEY and LIVEKIT_API_SECRET configured
- **Workflows**: Build, test, and example workflows configured

The SDK is ready for integration into web applications requiring WebRTC functionality.