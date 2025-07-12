#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('📦 Publishing @fanno/webrtc-client without git version...\n');

try {
  // Read current package.json
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`Current version: ${pkg.version}`);
  
  // Since we can't use npm version due to git issues, 
  // we'll publish with the current version
  console.log('Building the package...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\nPackage built successfully!');
  console.log('\nTo publish:');
  console.log('1. If this is your first publish, run: npm publish');
  console.log('2. If you need to update the version manually, edit package.json outside of this environment');
  console.log('3. Or use: npm publish --force (not recommended for production)');
  
  console.log('\n📋 Package information:');
  console.log(`Name: ${pkg.name}`);
  console.log(`Version: ${pkg.version}`);
  console.log(`Main: ${pkg.main}`);
  console.log(`Types: ${pkg.types}`);
  
  // Show what files will be published
  console.log('\n📁 Files that will be published:');
  const files = pkg.files || [];
  files.forEach(file => {
    console.log(`   - ${file}`);
  });
  
  console.log('\n✅ Ready to publish! Run: npm publish');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}