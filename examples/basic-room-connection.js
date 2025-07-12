// Example: Basic room connection and event handling
const { createRoomClient, setLogLevel } = require('../dist/index.js');

async function basicRoomExample() {
  try {
    console.log('🚀 Starting basic room connection example...\n');
    
    // Enable debug logging to see what's happening
    setLogLevel('info');
    
    // Create room client with environment credentials
    const roomClient = createRoomClient();
    
    // Set up event listeners before connecting
    roomClient.on('connected', () => {
      console.log('🎉 Successfully connected to room!');
      console.log('📊 Room info:', roomClient.getRoomInfo());
    });
    
    roomClient.on('disconnected', (reason) => {
      console.log('👋 Disconnected from room:', reason);
    });
    
    roomClient.on('participantConnected', (participant) => {
      console.log('👤 New participant joined:', participant.identity);
    });
    
    roomClient.on('participantDisconnected', (participant) => {
      console.log('👤 Participant left:', participant.identity);
    });
    
    // Connect to a test room
    console.log('🔌 Connecting to room...');
    await roomClient.connectToRoom({
      roomName: 'test-room-' + Date.now(),
      participantIdentity: 'sdk-test-user',
      participantMetadata: JSON.stringify({
        name: 'SDK Test User',
        timestamp: new Date().toISOString()
      })
    });
    
    // Get participant information
    const localParticipant = roomClient.getLocalParticipant();
    console.log('👤 Local participant:', localParticipant?.identity);
    
    const remoteParticipants = roomClient.getRemoteParticipants();
    console.log('👥 Remote participants:', remoteParticipants.length);
    
    // Wait a bit to see any events
    console.log('⏳ Waiting for 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Disconnect
    console.log('🔌 Disconnecting...');
    await roomClient.disconnectFromRoom();
    
    console.log('✅ Example completed successfully!');
    
  } catch (error) {
    console.error('❌ Example failed:', error.message);
    
    // Log the full error for debugging
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    
    process.exit(1);
  }
}

// Run the example
basicRoomExample();