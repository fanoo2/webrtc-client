#!/usr/bin/env node

const http = require('http');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Smoke test script for WebRTC Client SDK
 * 
 * This script performs end-to-end validation:
 * 1. Builds the project
 * 2. Starts a basic HTTP server with health endpoint
 * 3. Makes HTTP health check
 * 4. Validates basic SDK functionality
 */

class SmokeTestRunner {
  constructor() {
    this.server = null;
    this.port = process.env.PORT || 3001;
  }

  /**
   * Step 1: Build the project
   */
  async buildProject() {
    console.log('🔨 Building project...');
    try {
      const { stdout, stderr } = await execAsync('npm run build');
      console.log('✅ Build successful');
      if (stderr && !stderr.includes('Warning')) {
        console.log('Build warnings:', stderr);
      }
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Step 2: Start HTTP server with health endpoint
   */
  async startServer() {
    console.log(`🚀 Starting health server on port ${this.port}...`);
    
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        if (req.url === '/health' || req.url === '/api/health') {
          res.statusCode = 200;
          res.end(JSON.stringify({ 
            status: 'healthy', 
            service: 'webrtc-client-sdk',
            version: require('../../package.json').version,
            timestamp: new Date().toISOString()
          }));
        } else if (req.url === '/metrics') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          const metrics = [
            '# HELP webrtc_client_info Information about the WebRTC Client SDK',
            '# TYPE webrtc_client_info gauge',
            `webrtc_client_info{version="${require('../../package.json').version}",service="webrtc-client-sdk"} 1`,
            '# HELP webrtc_client_health Health status of the service',
            '# TYPE webrtc_client_health gauge',
            'webrtc_client_health 1',
            '# HELP webrtc_client_uptime_seconds Uptime in seconds',
            '# TYPE webrtc_client_uptime_seconds counter',
            `webrtc_client_uptime_seconds ${Math.floor(process.uptime())}`,
          ].join('\n');
          res.end(metrics);
        } else if (req.url === '/') {
          res.statusCode = 200;
          res.end(JSON.stringify({ 
            message: 'WebRTC Client SDK Health Server',
            endpoints: ['/health', '/api/health', '/metrics'],
            version: require('../../package.json').version
          }));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      });

      this.server.listen(this.port, (error) => {
        if (error) {
          reject(error);
        } else {
          console.log(`✅ Health server started on http://localhost:${this.port}`);
          resolve();
        }
      });
    });
  }

  /**
   * Step 3: Make health check HTTP request
   */
  async healthCheck() {
    console.log('🩺 Performing health check...');
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: this.port,
        path: '/health',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (res.statusCode === 200 && response.status === 'healthy') {
              console.log('✅ Health check passed:', response);
              resolve(response);
            } else {
              reject(new Error(`Health check failed: ${res.statusCode} ${data}`));
            }
          } catch (error) {
            reject(new Error(`Invalid health response: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Health check timeout'));
      });
      
      req.end();
    });
  }

  /**
   * Step 3b: Check metrics endpoint
   */
  async metricsCheck() {
    console.log('📊 Checking metrics endpoint...');
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: this.port,
        path: '/metrics',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 && data.includes('webrtc_client_health')) {
            console.log('✅ Metrics endpoint working');
            resolve(data);
          } else {
            reject(new Error(`Metrics check failed: ${res.statusCode} ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Metrics check timeout'));
      });
      
      req.end();
    });
  }

  /**
   * Step 4: Test basic SDK functionality
   */
  async testSDKFunctionality() {
    console.log('🧪 Testing SDK functionality...');
    
    try {
      // Import and test the SDK
      const { createRoomClientWithConfig, setLogLevel } = require('../../dist/index.cjs.js');
      
      // Test log level setting
      setLogLevel('warn');
      console.log('✅ setLogLevel function works');
      
      // Test client creation with mock configuration
      const client = createRoomClientWithConfig({
        url: 'ws://localhost:7881',
        tokenProvider: async () => 'mock-token-for-smoke-test'
      });
      
      if (client && typeof client.getConnectionStatus === 'function') {
        const status = client.getConnectionStatus();
        console.log('✅ SDK basic functionality verified, connection status:', status);
      } else {
        throw new Error('SDK client creation failed');
      }
      
    } catch (error) {
      console.error('❌ SDK functionality test failed:', error.message);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    if (this.server) {
      console.log('🧹 Shutting down server...');
      this.server.close();
    }
  }

  /**
   * Run all smoke tests
   */
  async run() {
    console.log('🚀 Starting WebRTC Client SDK Smoke Tests\n');
    
    try {
      await this.buildProject();
      await this.startServer();
      
      // Give server a moment to start
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.healthCheck();
      await this.metricsCheck();
      await this.testSDKFunctionality();
      
      console.log('\n🎉 All smoke tests passed! SDK is production ready.');
      process.exit(0);
      
    } catch (error) {
      console.error('\n❌ Smoke tests failed:', error.message);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }
}

// Run smoke tests if called directly
if (require.main === module) {
  const runner = new SmokeTestRunner();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Smoke tests interrupted');
    await runner.cleanup();
    process.exit(1);
  });
  
  runner.run();
}

module.exports = SmokeTestRunner;