import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Config } from '../../src/utils/config';

describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getLiveKitApiKey', () => {
    test('should return API key from environment variables', () => {
      process.env.LIVEKIT_API_KEY = 'test-api-key';
      expect(Config.getLiveKitApiKey()).toBe('test-api-key');
    });

    test('should return undefined when API key is not set', () => {
      delete process.env.LIVEKIT_API_KEY;
      expect(Config.getLiveKitApiKey()).toBeUndefined();
    });

    test('should handle browser environment safely', () => {
      // Mock browser environment
      const originalProcess = global.process;
      // @ts-ignore
      global.process = undefined;
      
      expect(Config.getLiveKitApiKey()).toBeUndefined();
      
      // Restore
      global.process = originalProcess;
    });
  });

  describe('getLiveKitApiSecret', () => {
    test('should return API secret from environment variables', () => {
      process.env.LIVEKIT_API_SECRET = 'test-api-secret';
      expect(Config.getLiveKitApiSecret()).toBe('test-api-secret');
    });

    test('should return undefined when API secret is not set', () => {
      delete process.env.LIVEKIT_API_SECRET;
      expect(Config.getLiveKitApiSecret()).toBeUndefined();
    });

    test('should handle browser environment safely', () => {
      // Mock browser environment
      const originalProcess = global.process;
      // @ts-ignore
      global.process = undefined;
      
      expect(Config.getLiveKitApiSecret()).toBeUndefined();
      
      // Restore
      global.process = originalProcess;
    });
  });

  describe('getLiveKitUrl', () => {
    test('should return URL from environment variables', () => {
      process.env.LIVEKIT_URL = 'wss://test.livekit.cloud';
      expect(Config.getLiveKitUrl()).toBe('wss://test.livekit.cloud');
    });

    test('should return default URL when not set', () => {
      delete process.env.LIVEKIT_URL;
      expect(Config.getLiveKitUrl()).toBe('ws://localhost:7881');
    });

    test('should return default URL in browser environment', () => {
      // Mock browser environment
      const originalProcess = global.process;
      // @ts-ignore
      global.process = undefined;
      
      expect(Config.getLiveKitUrl()).toBe('ws://localhost:7881');
      
      // Restore
      global.process = originalProcess;
    });
  });

  describe('getLiveKitConfig', () => {
    test('should return complete configuration', () => {
      process.env.LIVEKIT_URL = 'wss://test.livekit.cloud';
      process.env.LIVEKIT_API_KEY = 'test-key';
      process.env.LIVEKIT_API_SECRET = 'test-secret';

      const config = Config.getLiveKitConfig();
      
      expect(config).toEqual({
        url: 'wss://test.livekit.cloud',
        apiKey: 'test-key',
        apiSecret: 'test-secret'
      });
    });

    test('should handle missing environment variables', () => {
      delete process.env.LIVEKIT_URL;
      delete process.env.LIVEKIT_API_KEY;
      delete process.env.LIVEKIT_API_SECRET;

      const config = Config.getLiveKitConfig();
      
      expect(config).toEqual({
        url: 'ws://localhost:7881',
        apiKey: undefined,
        apiSecret: undefined
      });
    });
  });

  describe('validateEnvironment', () => {
    test('should pass validation with valid environment variables', () => {
      process.env.LIVEKIT_API_KEY = 'test-key';
      process.env.LIVEKIT_API_SECRET = 'test-secret';

      expect(() => Config.validateEnvironment()).not.toThrow();
    });

    test('should throw error when API key is missing', () => {
      delete process.env.LIVEKIT_API_KEY;
      process.env.LIVEKIT_API_SECRET = 'test-secret';

      expect(() => Config.validateEnvironment()).toThrow(
        'LIVEKIT_API_KEY and LIVEKIT_API_SECRET environment variables are required'
      );
    });

    test('should throw error when API secret is missing', () => {
      process.env.LIVEKIT_API_KEY = 'test-key';
      delete process.env.LIVEKIT_API_SECRET;

      expect(() => Config.validateEnvironment()).toThrow(
        'LIVEKIT_API_KEY and LIVEKIT_API_SECRET environment variables are required'
      );
    });

    test('should throw error when both API key and secret are missing', () => {
      delete process.env.LIVEKIT_API_KEY;
      delete process.env.LIVEKIT_API_SECRET;

      expect(() => Config.validateEnvironment()).toThrow(
        'LIVEKIT_API_KEY and LIVEKIT_API_SECRET environment variables are required'
      );
    });
  });
});