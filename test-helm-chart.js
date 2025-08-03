#!/usr/bin/env node

/**
 * Simple validation script for Helm chart configuration
 * Tests that the chart renders correctly with the expected environment variables
 */

const { execSync, execFileSync } = require('child_process');
const path = require('path');

const chartPath = path.join(__dirname, 'helm', 'webrtc-client-sdk');

function runHelmTemplate(args = '') {
  try {
    // Split args string into array, but only if non-empty
    const extraArgs = args ? args.split(' ') : [];
    const helmArgs = [
      'template',
      'test-release',
      chartPath,
      '--values',
      `${chartPath}/values.yaml`,
      ...extraArgs
    ];
    return execFileSync('helm', helmArgs, { encoding: 'utf8' });
  } catch (error) {
    console.error('Failed to run helm template:', error.message);
    process.exit(1);
  }
}

function testSecretConfiguration() {
  console.log('Testing secret configuration (blank apiKey/apiSecret)...');
  
  const output = runHelmTemplate();
  
  // Check for expected environment variables
  const expectedEnvVars = [
    'name: LIVEKIT_URL',
    'value: wss://fanno-1s7jndnl.livekit.cloud',
    'name: LIVEKIT_API_KEY',
    'name: webrtc-livekit-config',
    'key: apiKey',
    'name: LIVEKIT_API_SECRET',
    'key: apiSecret',
    'name: NODE_ENV',
    'value: production'
  ];
  
  for (const expectedVar of expectedEnvVars) {
    if (!output.includes(expectedVar)) {
      console.error(`❌ Missing expected configuration: ${expectedVar}`);
      return false;
    }
  }
  
  // Check that HPA is included
  if (!output.includes('kind: HorizontalPodAutoscaler')) {
    console.error('❌ Missing HorizontalPodAutoscaler');
    return false;
  }
  
  // Check replicas is not set (should be managed by HPA)
  if (output.includes('replicas: 2') && output.includes('kind: HorizontalPodAutoscaler')) {
    console.error('❌ Deployment should not have replicas when HPA is enabled');
    return false;
  }
  
  console.log('✅ Secret configuration test passed');
  return true;
}

function testDirectValueConfiguration() {
  console.log('Testing direct value configuration...');
  
  const output = runHelmTemplate('--set livekit.apiKey="test-key",livekit.apiSecret="test-secret"');
  
  // Check that values are used directly, not from secrets
  const shouldContain = [
    'name: LIVEKIT_API_KEY',
    'value: test-key',
    'name: LIVEKIT_API_SECRET',
    'value: test-secret'
  ];
  
  const shouldNotContain = [
    'secretKeyRef:',
    'name: webrtc-livekit-config'
  ];
  
  for (const expected of shouldContain) {
    if (!output.includes(expected)) {
      console.error(`❌ Missing expected direct value: ${expected}`);
      return false;
    }
  }
  
  for (const notExpected of shouldNotContain) {
    if (output.includes(notExpected)) {
      console.error(`❌ Should not contain when using direct values: ${notExpected}`);
      return false;
    }
  }
  
  console.log('✅ Direct value configuration test passed');
  return true;
}

function testAutoscalingDisabled() {
  console.log('Testing autoscaling disabled configuration...');
  
  const output = runHelmTemplate('--set autoscaling.enabled=false');
  
  // Should have explicit replicas and no HPA
  if (!output.includes('replicas: 2')) {
    console.error('❌ Should have explicit replicas when autoscaling is disabled');
    return false;
  }
  
  if (output.includes('kind: HorizontalPodAutoscaler')) {
    console.error('❌ Should not have HPA when autoscaling is disabled');
    return false;
  }
  
  console.log('✅ Autoscaling disabled test passed');
  return true;
}

function testHelmLint() {
  console.log('Testing Helm lint...');
  
  try {
    const result = execSync(`helm lint ${chartPath}`, { encoding: 'utf8' });
    if (!result.includes('0 chart(s) failed')) {
      console.error('❌ Helm lint failed');
      console.error(result);
      return false;
    }
    console.log('✅ Helm lint passed');
    return true;
  } catch (error) {
    console.error('❌ Helm lint failed:', error.message);
    return false;
  }
}

// Run all tests
console.log('🧪 Running Helm chart validation tests...\n');

const tests = [
  testSecretConfiguration,
  testDirectValueConfiguration,
  testAutoscalingDisabled,
  testHelmLint
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    if (test()) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.error(`❌ Test failed with error: ${error.message}`);
    failed++;
  }
  console.log(''); // Add spacing
}

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('❌ Some tests failed');
  process.exit(1);
} else {
  console.log('✅ All tests passed!');
  process.exit(0);
}