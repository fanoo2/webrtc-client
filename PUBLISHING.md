# Publishing Guide for WebRTC Client SDK

This SDK uses automated publishing through GitHub Actions. Manual publishing steps have been removed in favor of a streamlined release process.

## Automated Release Process

The SDK is automatically published to npm when you create a new release tag. The release workflow handles:

- ✅ Building the SDK
- ✅ Running comprehensive tests (unit and integration)
- ✅ Validating bundle sizes
- ✅ Publishing to npm registry
- ✅ Creating Docker images
- ✅ Notifying dependent repositories

## Creating a Release

1. **Update version in package.json**:
   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

2. **Push the version tag**:
   ```bash
   git push origin main --tags
   ```

3. **The release workflow will automatically**:
   - Validate that the package version matches the git tag
   - Run all tests with environment variables
   - Build and publish to npm
   - Create GitHub release
   - Build and push Docker image
   - Notify frontend repository of new version

## Required Secrets

The following secrets must be configured in the GitHub repository settings:

### Required for Publishing
- **`NPM_TOKEN`**: npm authentication token for publishing to registry
  - Create at: https://www.npmjs.com/settings/tokens
  - Type: Automation token
  - Scope: Publish access

### Required for LiveKit Integration  
- **`LIVEKIT_API_KEY`**: LiveKit API key for integration tests
- **`LIVEKIT_API_SECRET`**: LiveKit API secret for integration tests
- **`LIVEKIT_URL`**: LiveKit server URL (optional, defaults to localhost)

### Optional for Repository Integration
- **`FRONTEND_TOKEN`**: GitHub token for notifying dependent repositories

## Testing

The release process includes comprehensive testing:

### Unit Tests
- Config utility validation
- Logger functionality
- RoomClient API testing
- Factory function validation
- Export verification

### Integration Tests  
- Real LiveKit server connection (when credentials available)
- Mock server testing (when credentials unavailable)
- Error handling and edge cases
- Performance and memory validation

### Environment Variable Handling
- Tests run with mock credentials when real ones are unavailable
- CI automatically falls back to mock values
- Integration tests skip real connections in CI unless credentials are provided

## Manual Testing (Development)

For local development and testing:

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage

# Build and test
npm run build
npm test

# Legacy compatibility test
npm run test:legacy
```

## Version Management

The release workflow enforces consistency between:
- Git tag version (e.g., `v1.2.3`)
- Package.json version (e.g., `1.2.3`)

If versions don't match, the release will fail with a clear error message.

## Installation for Users

After a successful release, users can install the SDK:

```bash
# Latest version
npm install @fanno/webrtc-client livekit-client

# Specific version
npm install @fanno/webrtc-client@1.2.3 livekit-client
```

## Docker Usage

Docker images are also published automatically:

```bash
# Pull latest image
docker pull ghcr.io/fanoo2/webrtc-client:latest

# Pull specific version
docker pull ghcr.io/fanoo2/webrtc-client:1.2.3
```

## Troubleshooting

### Release Fails with "Version Mismatch"
- Ensure `package.json` version matches the git tag
- Use `npm version` command to keep them in sync

### Tests Fail in CI
- Check if LiveKit credentials are valid
- Review test logs for specific failures
- Tests should pass even without real LiveKit credentials

### NPM Publish Fails
- Verify `NPM_TOKEN` secret is valid and has publish access
- Check if package name is available on npm registry
- Ensure package version hasn't been published already

### Bundle Size Exceeded
- Review bundle size report in CI logs
- Optimize dependencies or code to reduce bundle size
- Current limit: 50KB for both CJS and ESM bundles

## Support

For questions about the release process or troubleshooting:
1. Check GitHub Actions logs for detailed error messages
2. Review test outputs in the CI workflow
3. Verify all required secrets are properly configured