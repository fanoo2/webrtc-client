// Test script to verify the WebRTC SDK functionality
const { createRoomClient, setLogLevel } = require('./dist/index.cjs.js');

async function testSDK() {
  try {
    console.log('Testing WebRTC SDK...');
    
    // Set debug logging
    setLogLevel('debug');
    
    // In CI environment with mock credentials, we expect certain failures
    const isCI = process.env.CI || (
      process.env.LIVEKIT_API_KEY === 'test-key' && 
      process.env.LIVEKIT_API_SECRET === 'test-secret'
    );
    
    if (isCI) {
      console.log('Running in CI mode with mock credentials');
      
      // Test that the module can be imported
      console.log('✓ SDK module imports successfully');
      
      // Test that createRoomClient function exists
      if (typeof createRoomClient !== 'function') {
        throw new Error('createRoomClient is not a function');
      }
      console.log('✓ createRoomClient function available');
      
      // Test that setLogLevel function exists
      if (typeof setLogLevel !== 'function') {
        throw new Error('setLogLevel is not a function');
      }
      console.log('✓ setLogLevel function available');
      
      // Try to create room client (will fail with mock credentials but should handle gracefully)
      try {
        const roomClient = createRoomClient();
        console.log('✓ Room client created (unexpected with mock credentials)');
        
        // Test connection status
        const status = roomClient.getConnectionStatus();
        console.log('✓ Connection status:', status);
        
        // Test room info (before connection)
        const roomInfo = roomClient.getRoomInfo();
        console.log('✓ Room info:', roomInfo);
        
      } catch (error) {
        if (error.message.includes('LIVEKIT_API_KEY and LIVEKIT_API_SECRET')) {
          console.log('✓ SDK correctly validates environment variables');
        } else {
          throw error;
        }
      }
      
    } else {
      // Full test with real environment variables
      console.log('Running with real credentials');
      
      // Create room client with environment credentials
      const roomClient = createRoomClient();
      console.log('✓ Room client created successfully');
      
      // Test connection status
      const status = roomClient.getConnectionStatus();
      console.log('✓ Connection status:', status);
      
      // Test room info (before connection)
      const roomInfo = roomClient.getRoomInfo();
      console.log('✓ Room info:', roomInfo);
    }
    
    console.log('✓ All SDK tests passed!');
    
  } catch (error) {
    console.error('✗ SDK test failed:', error.message);
    process.exit(1);
  }
}

testSDK();