// Test script to verify the WebRTC SDK functionality
const { createRoomClient, setLogLevel } = require('./dist/index.js');

async function testSDK() {
  try {
    console.log('Testing WebRTC SDK...');
    
    // Set debug logging
    setLogLevel('debug');
    
    // Create room client with environment credentials
    const roomClient = createRoomClient();
    console.log('✓ Room client created successfully');
    
    // Test connection status
    const status = roomClient.getConnectionStatus();
    console.log('✓ Connection status:', status);
    
    // Test room info (before connection)
    const roomInfo = roomClient.getRoomInfo();
    console.log('✓ Room info:', roomInfo);
    
    console.log('✓ All SDK tests passed!');
    
  } catch (error) {
    console.error('✗ SDK test failed:', error.message);
    process.exit(1);
  }
}

testSDK();