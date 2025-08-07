// Test setup file
import { jest } from '@jest/globals';

// Mock console methods to reduce noise during tests
const _originalConsole = global.console;

// Store original environment variables
const originalEnv = process.env;

beforeEach(() => {
  // Reset console mocks
  jest.clearAllMocks();
  
  // Reset environment variables
  process.env = { ...originalEnv };
});

afterEach(() => {
  // Restore environment
  process.env = originalEnv;
});

// Global test utilities
global.testUtils = {
  // Helper to set mock environment variables
  setMockEnv: (env: Record<string, string>) => {
    Object.assign(process.env, env);
  },
  
  // Helper to clear environment variables
  clearEnv: (keys: string[]) => {
    keys.forEach(key => {
      delete process.env[key];
    });
  },
  
  // Helper to create mock configuration
  createMockConfig: () => ({
    url: 'ws://localhost:7881',
    apiKey: 'test-key',
    apiSecret: 'test-secret'
  })
};

// Declare types for global test utilities
declare global {
  var testUtils: {
    setMockEnv: (env: Record<string, string>) => void;
    clearEnv: (keys: string[]) => void;
    createMockConfig: () => any;
  };
}