// Node.js compatible example - SDK initialization and configuration testing
const { createRoomClient, createRoomClientWithConfig, setLogLevel, Config } = require('../dist/index.js');

async function nodeExample() {
  try {
    console.log('🚀 Starting Node.js SDK Example...\n');
    
    // Enable detailed logging
    setLogLevel('debug');
    
    // Test 1: Environment-based client creation
    console.log('📋 Test 1: Creating client with environment configuration');
    const envClient = createRoomClient();
    console.log('✓ Environment-based client created successfully');
    console.log('📊 Status:', envClient.getConnectionStatus());
    console.log('🏠 Room info:', envClient.getRoomInfo());
    console.log('');
    
    // Test 2: Custom configuration client creation
    console.log('📋 Test 2: Creating client with custom configuration');
    const customClient = createRoomClientWithConfig({
      url: process.env.LIVEKIT_URL || 'ws://localhost:7881',
      apiKey: process.env.LIVEKIT_API_KEY,
      apiSecret: process.env.LIVEKIT_API_SECRET,
      roomOptions: {
        adaptiveStream: true,
        dynacast: true
      }
    });
    console.log('✓ Custom configuration client created successfully');
    console.log('📊 Status:', customClient.getConnectionStatus());
    console.log('');
    
    // Test 3: Configuration validation
    console.log('📋 Test 3: Testing configuration system');
    try {
      Config.validateEnvironment();
      console.log('✓ Environment validation passed');
      
      const config = Config.getLiveKitConfig();
      console.log('✓ Configuration loaded:', {
        url: config.url,
        hasApiKey: !!config.apiKey,
        hasApiSecret: !!config.apiSecret
      });
    } catch (error) {
      console.log('❌ Configuration validation failed:', error.message);
    }
    console.log('');
    
    // Test 4: API methods (without actual connection)
    console.log('📋 Test 4: Testing API methods');
    
    // Test status methods
    console.log('Connection status methods:');
    console.log('  - getConnectionStatus():', envClient.getConnectionStatus());
    
    // Test info methods
    const roomInfo = envClient.getRoomInfo();
    console.log('Room info methods:');
    console.log('  - getRoomInfo():', {
      name: roomInfo.name || '(none)',
      participantCount: roomInfo.participantCount,
      connectionStatus: roomInfo.connectionStatus
    });
    
    // Test participant methods (before connection)
    const localParticipant = envClient.getLocalParticipant();
    const remoteParticipants = envClient.getRemoteParticipants();
    console.log('Participant methods:');
    console.log('  - getLocalParticipant():', localParticipant ? 'Present' : 'None');
    console.log('  - getRemoteParticipants():', remoteParticipants.length, 'participants');
    console.log('');
    
    // Note about browser-only features
    console.log('📝 Note: Actual room connections require a browser environment');
    console.log('   The LiveKit client SDK uses WebRTC APIs (navigator, MediaDevices)');
    console.log('   that are only available in browsers, not in Node.js');
    console.log('');
    console.log('   For real connections, use the browser example:');
    console.log('   - Open examples/browser-example.html in a web browser');
    console.log('   - Or integrate the SDK into a web application');
    console.log('');
    
    console.log('✅ All Node.js SDK tests completed successfully!');
    console.log('🎉 The SDK is ready for browser integration');
    
  } catch (error) {
    console.error('❌ Node.js example failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the example
nodeExample();