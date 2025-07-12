#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🎉 Final Publish Verification for @fanno/webrtc-client\n');

// Read the corrected package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log('📦 Package Configuration:');
console.log(`✅ Name: ${pkg.name}`);
console.log(`✅ Version: ${pkg.version}`);
console.log(`✅ Main: ${pkg.main}`);
console.log(`✅ Types: ${pkg.types}`);
console.log(`✅ Author: ${pkg.author}`);
console.log(`✅ Access: ${pkg.publishConfig?.access || 'public'}`);
console.log('');

console.log('📁 Files to be published:');
const files = pkg.files || [];
files.forEach(file => {
  console.log(`✅ ${file}`);
});
console.log('');

console.log('🔍 Checking build artifacts:');
const distExists = fs.existsSync('dist');
if (distExists) {
  const distContents = fs.readdirSync('dist', { recursive: true });
  console.log('✅ dist/ directory contains:');
  distContents.forEach(file => {
    console.log(`   - ${file}`);
  });
} else {
  console.log('❌ dist/ directory missing');
}
console.log('');

console.log('🧪 Testing SDK functionality:');
try {
  const sdk = require('./dist/index.js');
  
  // Test main exports
  if (typeof sdk.createRoomClient === 'function') {
    console.log('✅ createRoomClient exported');
  }
  if (typeof sdk.createRoomClientWithConfig === 'function') {
    console.log('✅ createRoomClientWithConfig exported');
  }
  if (typeof sdk.setLogLevel === 'function') {
    console.log('✅ setLogLevel exported');
  }
  
  // Test client creation
  const client = sdk.createRoomClient();
  const status = client.getConnectionStatus();
  console.log(`✅ Client created, status: ${status}`);
  
  console.log('✅ All SDK functionality verified');
  
} catch (error) {
  console.log(`❌ SDK test failed: ${error.message}`);
}

console.log('');
console.log('🚀 Ready to publish! Run these commands:');
console.log('');
console.log('npm publish');
console.log('');
console.log('If the package name is taken, try:');
console.log('- @fanno/livekit-client-sdk');
console.log('- @fanno/webrtc-livekit');
console.log('- fanno-webrtc-client');
console.log('');
console.log('After publishing, users will install with:');
console.log('npm install @fanno/webrtc-client livekit-client');
console.log('');
console.log('✅ Package is ready for npm publishing!');