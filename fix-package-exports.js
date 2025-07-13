#!/usr/bin/env node

const fs = require('fs');

// Read current package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Fix exports field - types should come first
pkg.exports = {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.mjs",
    "require": "./dist/index.js"
  }
};

// Write fixed package.json
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log('✅ Fixed package.json exports field - types condition now comes first');