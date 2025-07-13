#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 Updating package.json for tsup bundler...\n');

// Read current package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Update scripts to use tsup
pkg.scripts = {
  ...pkg.scripts,
  "build": "tsup",
  "build:watch": "tsup --watch",
  "build:dev": "tsup --watch --sourcemap",
  "test": "node test-sdk.js",
  "prepublishOnly": "npm run build"
};

// Update main entry points for dual package
pkg.main = "dist/index.js";
pkg.module = "dist/index.mjs";
pkg.types = "dist/index.d.ts";

// Add exports field for better module resolution
pkg.exports = {
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
};

// Write updated package.json
fs.writeFileSync('package.json.tsup', JSON.stringify(pkg, null, 2));

console.log('✅ Created package.json.tsup with tsup configuration');
console.log('');
console.log('📋 Key changes:');
console.log('✅ Build script: "tsup" (instead of "tsc")');
console.log('✅ Main: "dist/index.js" (CommonJS)');
console.log('✅ Module: "dist/index.mjs" (ES modules)');
console.log('✅ Types: "dist/index.d.ts"');
console.log('✅ Exports: Dual package support');
console.log('✅ Added development scripts (build:watch, build:dev)');
console.log('');
console.log('🚀 To apply changes:');
console.log('cp package.json.tsup package.json');
console.log('npm run build');
console.log('');
console.log('💡 Benefits of tsup:');
console.log('- Faster builds with esbuild');
console.log('- Dual package output (CJS + ESM)');
console.log('- Better tree-shaking');
console.log('- Optimized bundles');
console.log('- Watch mode for development');