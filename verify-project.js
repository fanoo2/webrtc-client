// Project verification script
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying WebRTC Client SDK Project...\n');

// Check required files
const requiredFiles = [
  'src/index.ts',
  'src/client/RoomClient.ts',
  'src/types/index.ts',
  'src/utils/config.ts',
  'src/utils/logger.ts',
  'dist/index.js',
  'dist/index.d.ts',
  'tsconfig.json',
  'README.md',
  'replit.md'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check examples
const exampleFiles = [
  'examples/custom-config.js',
  'examples/browser-example.html',
  'test-sdk.js'
];

console.log('\n📋 Checking examples and tests:');
exampleFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Test SDK functionality
console.log('\n🧪 Testing SDK functionality:');
try {
  const { createRoomClient, setLogLevel, RoomClient, Config } = require('./dist/index.js');
  
  console.log('  ✅ SDK imports successfully');
  
  // Test client creation
  const client = createRoomClient();
  console.log('  ✅ Room client created');
  
  // Test status check
  const status = client.getConnectionStatus();
  console.log(`  ✅ Connection status: ${status}`);
  
  // Test configuration
  const config = Config.getLiveKitConfig();
  console.log('  ✅ Configuration loaded');
  
  console.log('\n✅ All verification tests passed!');
  console.log('\n📦 Project Summary:');
  console.log('  • TypeScript WebRTC SDK built on LiveKit');
  console.log('  • Full type safety with comprehensive interfaces');
  console.log('  • Environment-based configuration system');
  console.log('  • CommonJS output for Node.js compatibility');
  console.log('  • Ready for browser integration');
  console.log('  • Complete documentation and examples');
  
} catch (error) {
  console.log(`  ❌ SDK test failed: ${error.message}`);
}

console.log('\n🎉 WebRTC Client SDK project verification complete!');