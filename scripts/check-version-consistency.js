#!/usr/bin/env node

/**
 * Script to check and optionally fix version consistency between package.json and Chart.yaml
 * Usage: node scripts/check-version-consistency.js [--fix]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');

function main() {
  try {
    // Get package.json version
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const packageVersion = packageJson.version;

    // Get Helm chart versions
    const chartPath = path.join(__dirname, '..', 'helm', 'webrtc-client-sdk', 'Chart.yaml');
    const chartContent = fs.readFileSync(chartPath, 'utf8');
    
    const appVersionMatch = chartContent.match(/appVersion: *"?([^"\n]+)"?/);
    const versionMatch = chartContent.match(/^version: *([^\n]+)/m);
    
    if (!appVersionMatch || !versionMatch) {
      console.error('❌ Could not parse Chart.yaml versions');
      process.exit(1);
    }

    const chartAppVersion = appVersionMatch[1].replace(/"/g, '');
    const chartVersion = versionMatch[1].replace(/"/g, '');

    console.log(`Package version: ${packageVersion}`);
    console.log(`Chart version: ${chartVersion}`);
    console.log(`Chart appVersion: ${chartAppVersion}`);

    // Check for mismatches
    const versionMismatch = packageVersion !== chartVersion;
    const appVersionMismatch = packageVersion !== chartAppVersion;

    if (!versionMismatch && !appVersionMismatch) {
      console.log('✓ All versions are consistent');
      process.exit(0);
    }

    if (versionMismatch || appVersionMismatch) {
      console.log(`❌ Version mismatch detected:`);
      if (versionMismatch) {
        console.log(`  - Chart version (${chartVersion}) ≠ Package version (${packageVersion})`);
      }
      if (appVersionMismatch) {
        console.log(`  - Chart appVersion (${chartAppVersion}) ≠ Package version (${packageVersion})`);
      }

      if (shouldFix) {
        console.log('Fixing versions...');
        
        let updatedContent = chartContent;
        
        // Update version
        updatedContent = updatedContent.replace(/^version: *[^\n]+/m, `version: ${packageVersion}`);
        
        // Update appVersion
        updatedContent = updatedContent.replace(/appVersion: *"?[^"\n]+"?/, `appVersion: "${packageVersion}"`);

        fs.writeFileSync(chartPath, updatedContent, 'utf8');
        console.log(`✓ Updated Chart.yaml to version ${packageVersion}`);
        
        // Also update values.yaml image tag if it exists
        const valuesPath = path.join(__dirname, '..', 'helm', 'webrtc-client-sdk', 'values.yaml');
        if (fs.existsSync(valuesPath)) {
          const valuesContent = fs.readFileSync(valuesPath, 'utf8');
          const updatedValues = valuesContent.replace(/tag: *"[^"]*"/, `tag: "${packageVersion}"`);
          fs.writeFileSync(valuesPath, updatedValues, 'utf8');
          console.log(`✓ Updated values.yaml image tag to ${packageVersion}`);
        }
        
        process.exit(0);
      } else {
        console.log('Run with --fix to automatically update Chart.yaml');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Error checking version consistency:', error.message);
    process.exit(1);
  }
}

main();