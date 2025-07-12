#!/usr/bin/env node

// Pre-publish verification script
const fs = require('fs');
const path = require('path');

console.log('🔍 Pre-publish verification for WebRTC Client SDK...\n');

let allChecksPass = true;

function checkFail(message) {
  console.log(`❌ ${message}`);
  allChecksPass = false;
}

function checkPass(message) {
  console.log(`✅ ${message}`);
}

// Check 1: Required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'dist/index.js',
  'dist/index.d.ts',
  'README.md',
  'package.json'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checkPass(`${file} exists`);
  } else {
    checkFail(`${file} is missing`);
  }
});

// Check 2: Package.json validation
console.log('\n📋 Checking package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.name && pkg.name !== 'workspace') {
    checkPass(`Package name: ${pkg.name}`);
  } else {
    checkFail('Package name needs to be changed from "workspace"');
  }
  
  if (pkg.main === 'dist/index.js') {
    checkPass('Main entry point is correct');
  } else {
    checkFail('Main entry point should be "dist/index.js"');
  }
  
  if (pkg.types === 'dist/index.d.ts') {
    checkPass('Types entry point is correct');
  } else {
    checkFail('Types entry point should be "dist/index.d.ts"');
  }
  
  if (pkg.version && pkg.version !== '1.0.0') {
    checkPass(`Version: ${pkg.version}`);
  } else {
    console.log(`⚠️  Version: ${pkg.version} (consider updating)`);
  }
  
} catch (error) {
  checkFail(`Error reading package.json: ${error.message}`);
}

// Check 3: TypeScript compilation
console.log('\n🔨 Checking TypeScript compilation...');
try {
  const { execSync } = require('child_process');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  checkPass('TypeScript compilation successful');
} catch (error) {
  checkFail('TypeScript compilation failed');
  console.log(`   Error: ${error.message}`);
}

// Check 4: Test the built SDK
console.log('\n🧪 Testing built SDK...');
try {
  const sdk = require('./dist/index.js');
  
  if (typeof sdk.createRoomClient === 'function') {
    checkPass('createRoomClient function exported');
  } else {
    checkFail('createRoomClient function not found');
  }
  
  if (typeof sdk.createRoomClientWithConfig === 'function') {
    checkPass('createRoomClientWithConfig function exported');
  } else {
    checkFail('createRoomClientWithConfig function not found');
  }
  
  // Test basic functionality
  const client = sdk.createRoomClient();
  if (client && typeof client.getConnectionStatus === 'function') {
    checkPass('SDK basic functionality works');
  } else {
    checkFail('SDK basic functionality failed');
  }
  
} catch (error) {
  checkFail(`SDK test failed: ${error.message}`);
}

// Check 5: File size check
console.log('\n📊 Checking file sizes...');
try {
  const stats = fs.statSync('dist/index.js');
  const sizeKB = Math.round(stats.size / 1024);
  
  if (sizeKB > 0 && sizeKB < 1000) {
    checkPass(`Built SDK size: ${sizeKB}KB (reasonable)`);
  } else if (sizeKB >= 1000) {
    console.log(`⚠️  Built SDK size: ${sizeKB}KB (large, consider optimization)`);
  } else {
    checkFail('Built SDK file is empty or too small');
  }
} catch (error) {
  checkFail(`Error checking file size: ${error.message}`);
}

// Final result
console.log('\n📋 Pre-publish Summary:');
if (allChecksPass) {
  console.log('✅ All checks passed! Ready for publishing.');
  console.log('\nNext steps:');
  console.log('1. Update package.json with proper name and metadata');
  console.log('2. Run: npm login');
  console.log('3. Run: npm publish --access public');
} else {
  console.log('❌ Some checks failed. Please fix the issues above before publishing.');
  process.exit(1);
}

console.log('\n📖 See PUBLISHING.md for detailed publishing instructions.');