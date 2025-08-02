import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Logger } from '../../src/utils/logger';

describe('Logger', () => {
  // Store original console methods
  const originalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error
  };

  // Mock console methods
  const mockConsole = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  beforeEach(() => {
    // Mock console methods
    console.debug = mockConsole.debug;
    console.info = mockConsole.info;
    console.warn = mockConsole.warn;
    console.error = mockConsole.error;

    // Reset log level to default
    Logger.setLogLevel('info');

    // Clear all mocks
    Object.values(mockConsole).forEach(mock => mock.mockClear());
  });

  afterEach(() => {
    // Restore original console methods
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  describe('setLogLevel', () => {
    test('should set log level to debug', () => {
      Logger.setLogLevel('debug');
      
      Logger.debug('debug message');
      Logger.info('info message');
      Logger.warn('warn message');
      Logger.error('error message');

      expect(mockConsole.debug).toHaveBeenCalledWith('[WebRTC-SDK] debug message');
      expect(mockConsole.info).toHaveBeenCalledWith('[WebRTC-SDK] info message');
      expect(mockConsole.warn).toHaveBeenCalledWith('[WebRTC-SDK] warn message');
      expect(mockConsole.error).toHaveBeenCalledWith('[WebRTC-SDK] error message', undefined);
    });

    test('should set log level to info (default)', () => {
      Logger.setLogLevel('info');
      
      Logger.debug('debug message');
      Logger.info('info message');
      Logger.warn('warn message');
      Logger.error('error message');

      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).toHaveBeenCalledWith('[WebRTC-SDK] info message');
      expect(mockConsole.warn).toHaveBeenCalledWith('[WebRTC-SDK] warn message');
      expect(mockConsole.error).toHaveBeenCalledWith('[WebRTC-SDK] error message', undefined);
    });

    test('should set log level to warn', () => {
      Logger.setLogLevel('warn');
      
      Logger.debug('debug message');
      Logger.info('info message');
      Logger.warn('warn message');
      Logger.error('error message');

      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).toHaveBeenCalledWith('[WebRTC-SDK] warn message');
      expect(mockConsole.error).toHaveBeenCalledWith('[WebRTC-SDK] error message', undefined);
    });

    test('should set log level to error', () => {
      Logger.setLogLevel('error');
      
      Logger.debug('debug message');
      Logger.info('info message');
      Logger.warn('warn message');
      Logger.error('error message');

      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).not.toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalledWith('[WebRTC-SDK] error message', undefined);
    });
  });

  describe('debug', () => {
    test('should log debug message when log level is debug', () => {
      Logger.setLogLevel('debug');
      Logger.debug('test debug message', { extra: 'data' });
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        '[WebRTC-SDK] test debug message',
        { extra: 'data' }
      );
    });

    test('should not log debug message when log level is info', () => {
      Logger.setLogLevel('info');
      Logger.debug('test debug message');
      
      expect(mockConsole.debug).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    test('should log info message when log level is info or debug', () => {
      Logger.setLogLevel('info');
      Logger.info('test info message', { extra: 'data' });
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        '[WebRTC-SDK] test info message',
        { extra: 'data' }
      );
    });

    test('should not log info message when log level is warn', () => {
      Logger.setLogLevel('warn');
      Logger.info('test info message');
      
      expect(mockConsole.info).not.toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    test('should log warn message when log level is warn or lower', () => {
      Logger.setLogLevel('warn');
      Logger.warn('test warn message', { extra: 'data' });
      
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '[WebRTC-SDK] test warn message',
        { extra: 'data' }
      );
    });

    test('should not log warn message when log level is error', () => {
      Logger.setLogLevel('error');
      Logger.warn('test warn message');
      
      expect(mockConsole.warn).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    test('should log error message at any log level', () => {
      Logger.setLogLevel('error');
      const testError = new Error('test error');
      Logger.error('test error message', testError, { extra: 'data' });
      
      expect(mockConsole.error).toHaveBeenCalledWith(
        '[WebRTC-SDK] test error message',
        testError,
        { extra: 'data' }
      );
    });

    test('should log error message without error object', () => {
      Logger.setLogLevel('error');
      Logger.error('test error message', undefined, { extra: 'data' });
      
      expect(mockConsole.error).toHaveBeenCalledWith(
        '[WebRTC-SDK] test error message',
        undefined,
        { extra: 'data' }
      );
    });

    test('should log error message with only message', () => {
      Logger.setLogLevel('error');
      Logger.error('test error message');
      
      expect(mockConsole.error).toHaveBeenCalledWith(
        '[WebRTC-SDK] test error message',
        undefined
      );
    });
  });

  describe('message formatting', () => {
    test('should format messages with [WebRTC-SDK] prefix', () => {
      Logger.setLogLevel('debug');
      
      Logger.debug('debug');
      Logger.info('info');
      Logger.warn('warn');
      Logger.error('error');

      expect(mockConsole.debug).toHaveBeenCalledWith('[WebRTC-SDK] debug');
      expect(mockConsole.info).toHaveBeenCalledWith('[WebRTC-SDK] info');
      expect(mockConsole.warn).toHaveBeenCalledWith('[WebRTC-SDK] warn');
      expect(mockConsole.error).toHaveBeenCalledWith('[WebRTC-SDK] error', undefined);
    });

    test('should handle multiple arguments', () => {
      Logger.setLogLevel('debug');
      Logger.info('message', 'arg1', 'arg2', { object: 'data' });
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        '[WebRTC-SDK] message',
        'arg1',
        'arg2',
        { object: 'data' }
      );
    });
  });
});