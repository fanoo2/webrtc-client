#!/usr/bin/env node

const fs = require('fs');

console.log('Updating package.json for simple tsup configuration...\n');

// Read current package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Update scripts with simple tsup command
pkg.scripts = {
  ...pkg.scripts,
  "build": "tsup src/index.ts --format cjs,esm --dts"
};

// Update entry points for simple tsup output
pkg.main = "dist/index.cjs.js";
pkg.module = "dist/index.esm.js";
pkg.types = "dist/index.d.ts";

// Update files field
pkg.files = ["dist"];

// Update exports field for simple output
pkg.exports = {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.esm.js",
    "require": "./dist/index.cjs.js"
  }
};

// Write updated package.json
fs.writeFileSync('package.json.simple', JSON.stringify(pkg, null, 2));

console.log('Created package.json.simple with simplified tsup configuration');
console.log('\nKey changes:');
console.log('- Build script: "tsup src/index.ts --format cjs,esm --dts"');
console.log('- Main: "dist/index.cjs.js"');
console.log('- Module: "dist/index.esm.js"');
console.log('- Types: "dist/index.d.ts"');
console.log('- Files: ["dist"]');
console.log('\nThis removes the need for tsup.config.ts file');