#!/usr/bin/env node

const fs = require('fs');

// Read current package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Set the exact configuration you specified
pkg.scripts.build = "tsup src/index.ts --format cjs,esm --dts";
pkg.main = "dist/index.cjs.js";
pkg.module = "dist/index.esm.js";
pkg.types = "dist/index.d.ts";
pkg.files = ["dist"];

// Update exports to match the file names
pkg.exports = {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.esm.js", 
    "require": "./dist/index.cjs.js"
  }
};

// Write the updated package.json
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log('Updated package.json with your exact specification');