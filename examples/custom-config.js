// Example: Using custom configuration instead of environment variables
const { createRoomClientWithConfig, setLogLevel } = require('../dist/index.js');

async function customConfigExample() {
  try {
    console.log('🔧 Starting custom configuration example...\n');
    
    setLogLevel('info');
    
    // Create room client with custom configuration
    // Note: In a real application, never hardcode credentials like this
    const roomClient = createRoomClientWithConfig({
      url: process.env.LIVEKIT_URL || 'ws://localhost:7881',
      apiKey: process.env.LIVEKIT_API_KEY,
      apiSecret: process.env.LIVEKIT_API_SECRET,
      roomOptions: {
        adaptiveStream: true,
        dynacast: true,
        // Additional custom room options can go here
      },
      connectOptions: {
        autoSubscribe: true,
        // Additional custom connect options can go here
      }
    });
    
    console.log('✅ Room client created with custom configuration');
    
    // Test basic functionality
    console.log('📊 Initial connection status:', roomClient.getConnectionStatus());
    
    const roomInfo = roomClient.getRoomInfo();
    console.log('🏠 Room info before connection:', {
      name: roomInfo.name || '(none)',
      participantCount: roomInfo.participantCount,
      connectionStatus: roomInfo.connectionStatus
    });
    
    console.log('✅ Custom configuration example completed!');
    
  } catch (error) {
    console.error('❌ Custom configuration example failed:', error.message);
    process.exit(1);
  }
}

// Run the example
customConfigExample();