import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock the dependencies before importing the main module
jest.mock('../../src/client/RoomClient');
jest.mock('../../src/utils/logger');

import * as SDK from '../../src/index';
import { Logger } from '../../src/utils/logger';

describe('SDK Index Exports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exports', () => {
    test('should export createRoomClient function', () => {
      expect(typeof SDK.createRoomClient).toBe('function');
    });

    test('should export createRoomClientWithConfig function', () => {
      expect(typeof SDK.createRoomClientWithConfig).toBe('function');
    });

    test('should export setLogLevel function', () => {
      expect(typeof SDK.setLogLevel).toBe('function');
    });

    test('should export Logger class', () => {
      expect(SDK.Logger).toBeDefined();
    });

    test('should export TypeScript types', () => {
      // These are type-only exports, so we can't test them at runtime
      // But we can verify the module structure
      expect(SDK).toHaveProperty('createRoomClient');
      expect(SDK).toHaveProperty('createRoomClientWithConfig');
      expect(SDK).toHaveProperty('setLogLevel');
      expect(SDK).toHaveProperty('Logger');
    });
  });

  describe('setLogLevel', () => {
    test('should call Logger.setLogLevel with debug level', () => {
      const mockSetLogLevel = jest.mocked(Logger.setLogLevel);
      
      SDK.setLogLevel('debug');
      
      expect(mockSetLogLevel).toHaveBeenCalledWith('debug');
    });

    test('should call Logger.setLogLevel with info level', () => {
      const mockSetLogLevel = jest.mocked(Logger.setLogLevel);
      
      SDK.setLogLevel('info');
      
      expect(mockSetLogLevel).toHaveBeenCalledWith('info');
    });

    test('should call Logger.setLogLevel with warn level', () => {
      const mockSetLogLevel = jest.mocked(Logger.setLogLevel);
      
      SDK.setLogLevel('warn');
      
      expect(mockSetLogLevel).toHaveBeenCalledWith('warn');
    });

    test('should call Logger.setLogLevel with error level', () => {
      const mockSetLogLevel = jest.mocked(Logger.setLogLevel);
      
      SDK.setLogLevel('error');
      
      expect(mockSetLogLevel).toHaveBeenCalledWith('error');
    });
  });

  describe('re-exports from RoomClient', () => {
    test('should re-export createRoomClient from RoomClient module', () => {
      // Import the actual module to verify the export exists
      const RoomClientModule = require('../../src/client/RoomClient');
      expect(SDK.createRoomClient).toBe(RoomClientModule.createRoomClient);
    });

    test('should re-export createRoomClientWithConfig from RoomClient module', () => {
      const RoomClientModule = require('../../src/client/RoomClient');
      expect(SDK.createRoomClientWithConfig).toBe(RoomClientModule.createRoomClientWithConfig);
    });
  });

  describe('Logger export', () => {
    test('should export Logger class directly', () => {
      expect(SDK.Logger).toBe(Logger);
    });
  });
});