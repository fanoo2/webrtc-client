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

## Project Status

### Completed Features ✅
- **Core SDK Implementation**: Fully functional WebRTC client wrapper
- **TypeScript Compilation**: CommonJS output for Node.js compatibility  
- **Configuration System**: Environment variable support with validation
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions
- **Logging System**: Configurable logging with multiple levels
- **Factory Functions**: Easy-to-use client creation methods
- **Error Handling**: Robust error handling and connection state management
- **Documentation**: Complete README with API reference and examples
- **Testing**: Basic SDK testing to verify functionality

### Testing Results
- **SDK Initialization**: ✅ Successfully creates room clients
- **Configuration Loading**: ✅ Reads environment variables correctly
- **TypeScript Compilation**: ✅ Builds without errors to dist/ directory
- **API Compatibility**: ✅ Works with LiveKit 2.15.2 client SDK
- **Node.js Testing**: ✅ Basic functionality verified (creation, status checks)
- **Browser Compatibility**: ⚠️ Requires browser environment for actual connections

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