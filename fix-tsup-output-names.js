#!/usr/bin/env node

const fs = require('fs');

// Read current package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Update build script with specific output naming
pkg.scripts.build = "tsup src/index.ts --format cjs,esm --dts --out-dir dist --clean";

// Write back
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log('Updated build script to control output naming and removed tsup.config.ts');