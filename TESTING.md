# WebRTC Client SDK - Testing Documentation

## Overview

This SDK now includes comprehensive Jest-based testing with unit and integration tests that work both with real LiveKit servers and mock environments.

## Test Structure

```
tests/
├── __mocks__/              # Mock implementations
│   ├── livekit-client.ts   # Mock LiveKit client
│   └── livekit-server-sdk.ts # Mock server SDK
├── unit/                   # Unit tests
│   ├── config.test.ts      # Config utility tests
│   ├── logger.test.ts      # Logger utility tests
│   ├── room-client.test.ts # RoomClient API tests
│   └── index.test.ts       # Main exports tests
├── integration/            # Integration tests
│   └── sdk-integration.test.ts # End-to-end tests
└── setup.ts               # Test configuration
```

## Test Categories

### Unit Tests (51 test cases)
- **Config Utility**: Environment variable handling, validation, browser compatibility
- **Logger**: Log level management, message formatting, console output
- **RoomClient**: API interface validation, error handling, type checking
- **Index Exports**: Module structure, function availability, type exports

### Integration Tests (8 test cases)  
- **Mock Server Testing**: Connection simulation, token provider validation
- **Real Server Testing**: Actual LiveKit connection (when credentials available)
- **Error Handling**: Invalid URLs, timeouts, token failures
- **Performance**: Memory management, multiple client instances

## Test Commands

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:coverage      # With coverage report
npm run test:watch         # Watch mode for development
npm run test:legacy        # Legacy compatibility test
```

## Environment Variables

The tests automatically handle different environments:

### With Real LiveKit Credentials
```bash
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-secret
LIVEKIT_URL=wss://your-server.livekit.cloud
npm test
```

### With Mock Credentials (CI/Default)
```bash
LIVEKIT_API_KEY=test-key
LIVEKIT_API_SECRET=test-secret
LIVEKIT_URL=ws://localhost:7881
CI=true
npm test
```

## Coverage Report

Current coverage metrics:
- **Overall**: 69.48% statement coverage
- **Utils**: 100% coverage (Config, Logger)
- **Client**: 61.98% coverage (RoomClient)

## CI Integration

### GitHub Actions Workflow
- Tests run on Node.js 16.x, 18.x, 20.x
- Automatic fallback to mock credentials
- Coverage reporting to Codecov
- Bundle size validation
- Legacy test compatibility

### Required Secrets
- `NPM_TOKEN`: For publishing to npm
- `LIVEKIT_API_KEY`: For integration tests (optional)
- `LIVEKIT_API_SECRET`: For integration tests (optional)
- `LIVEKIT_URL`: LiveKit server URL (optional)

## Mock Implementation

### LiveKit Client Mock
- Simulates Room, RemoteParticipant, LocalParticipant
- Event system for connection state changes
- Configurable responses for different scenarios

### Server SDK Mock
- JWT token generation simulation
- Access token creation with grants
- Realistic token structure for testing

## Best Practices

### Writing Tests
1. Use environment variables for configuration
2. Mock external dependencies (LiveKit)
3. Test both success and error scenarios
4. Validate API interfaces and types
5. Include performance and memory tests

### Running Tests Locally
1. Install dependencies: `npm ci`
2. Build project: `npm run build`
3. Run tests: `npm test`
4. Check coverage: `npm run test:coverage`

### Debugging Tests
- Use `npm run test:watch` for development
- Set breakpoints in Jest with `--inspect-brk`
- Review test logs for connection details
- Check environment variable configuration

## Integration with LiveKit

### Real Server Testing
When real LiveKit credentials are provided:
- Tests connect to actual LiveKit server
- Validates end-to-end functionality
- Tests real token generation and room joining
- Performs cleanup after each test

### Mock Server Testing
When using mock credentials:
- Simulates LiveKit behavior without network calls
- Focuses on SDK API correctness
- Tests error handling and edge cases
- Runs quickly and reliably in CI

## Troubleshooting

### Common Issues

**Tests fail with "Connection refused"**
- Normal in CI environment with mock credentials
- Integration tests gracefully handle connection failures
- Unit tests run independently of LiveKit server

**Coverage below expectations**
- Some code paths require real LiveKit server
- Error handling branches may not be reached in mocks
- Consider adding more edge case tests

**Tests timeout**
- Check LiveKit server availability
- Verify network connectivity
- Reduce test timeout for faster feedback

### Getting Help
1. Check test logs for specific error messages
2. Verify environment variable configuration
3. Review GitHub Actions logs for CI failures
4. Test locally with same environment setup