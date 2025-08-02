import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Create simpler tests that don't rely on complex mocking
describe('RoomClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Factory Functions', () => {
    test('should export createRoomClient function', () => {
      const { createRoomClient } = require('../../src/client/RoomClient');
      expect(typeof createRoomClient).toBe('function');
    });

    test('should export createRoomClientWithConfig function', () => {
      const { createRoomClientWithConfig } = require('../../src/client/RoomClient');
      expect(typeof createRoomClientWithConfig).toBe('function');
    });

    test('should export RoomClient class', () => {
      const { RoomClient } = require('../../src/client/RoomClient');
      expect(typeof RoomClient).toBe('function');
    });

    test('createRoomClient should require environment variables', () => {
      delete process.env.LIVEKIT_API_KEY;
      delete process.env.LIVEKIT_API_SECRET;

      const { createRoomClient } = require('../../src/client/RoomClient');
      
      expect(() => createRoomClient()).toThrow(
        'Failed to initialize WebRTC client'
      );
    });

    test('createRoomClient should work with environment variables', () => {
      process.env.LIVEKIT_API_KEY = 'test-key';
      process.env.LIVEKIT_API_SECRET = 'test-secret';
      process.env.LIVEKIT_URL = 'ws://localhost:7881';

      const { createRoomClient } = require('../../src/client/RoomClient');
      
      const client = createRoomClient();
      expect(client).toBeDefined();
      expect(typeof client.getConnectionStatus).toBe('function');
      expect(typeof client.getRoomInfo).toBe('function');
      expect(typeof client.connectToRoom).toBe('function');
      expect(typeof client.disconnectFromRoom).toBe('function');
    });

    test('createRoomClientWithConfig should work with custom config', () => {
      const { createRoomClientWithConfig } = require('../../src/client/RoomClient');
      
      const config = {
        url: 'ws://localhost:7881',
        tokenProvider: async () => 'test-token'
      };

      const client = createRoomClientWithConfig(config);
      expect(client).toBeDefined();
      expect(typeof client.getConnectionStatus).toBe('function');
      expect(typeof client.getRoomInfo).toBe('function');
      expect(typeof client.connectToRoom).toBe('function');
      expect(typeof client.disconnectFromRoom).toBe('function');
    });

    test('RoomClient should have proper interface', () => {
      const { RoomClient } = require('../../src/client/RoomClient');
      
      const config = {
        url: 'ws://localhost:7881',
        tokenProvider: async () => 'test-token'
      };

      const client = new RoomClient(config);
      
      // Test initial state
      expect(client.getConnectionStatus()).toBe('disconnected');
      
      const roomInfo = client.getRoomInfo();
      expect(roomInfo).toHaveProperty('name');
      expect(roomInfo).toHaveProperty('participantCount');
      expect(roomInfo).toHaveProperty('connectionState');
      expect(roomInfo).toHaveProperty('connectionStatus');
      
      // Test participant methods exist
      expect(typeof client.getLocalParticipant).toBe('function');
      expect(typeof client.getRemoteParticipants).toBe('function');
      
      // Test initial participant state
      expect(client.getLocalParticipant()).toBeNull();
      expect(client.getRemoteParticipants()).toEqual([]);
    });
  });

  describe('API Interface', () => {
    test('should have correct method signatures', () => {
      const { RoomClient } = require('../../src/client/RoomClient');
      
      const config = {
        url: 'ws://localhost:7881',
        tokenProvider: async () => 'test-token'
      };

      const client = new RoomClient(config);
      
      // Verify all expected methods exist
      const expectedMethods = [
        'connectToRoom',
        'disconnectFromRoom', 
        'getConnectionStatus',
        'getRoomInfo',
        'getLocalParticipant',
        'getRemoteParticipants'
      ];

      expectedMethods.forEach(method => {
        expect(typeof client[method]).toBe('function');
      });
    });

    test('should return consistent data types', () => {
      const { RoomClient } = require('../../src/client/RoomClient');
      
      const config = {
        url: 'ws://localhost:7881',
        tokenProvider: async () => 'test-token'
      };

      const client = new RoomClient(config);
      
      // Test return types
      expect(typeof client.getConnectionStatus()).toBe('string');
      expect(['connected', 'connecting', 'disconnected']).toContain(client.getConnectionStatus());
      
      const roomInfo = client.getRoomInfo();
      expect(typeof roomInfo).toBe('object');
      expect(typeof roomInfo.name).toBe('string');
      expect(typeof roomInfo.participantCount).toBe('number');
      
      expect(Array.isArray(client.getRemoteParticipants())).toBe(true);
    });
  });
});