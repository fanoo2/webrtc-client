/**
 * Simple logging utility for the WebRTC client SDK
 */
export class Logger {
  private static logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  /**
   * Set the logging level
   */
  static setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }

  /**
   * Log debug messages
   */
  static debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[WebRTC-SDK] ${message}`, ...args);
    }
  }

  /**
   * Log info messages
   */
  static info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[WebRTC-SDK] ${message}`, ...args);
    }
  }

  /**
   * Log warning messages
   */
  static warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WebRTC-SDK] ${message}`, ...args);
    }
  }

  /**
   * Log error messages
   */
  static error(message: string, error?: Error, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[WebRTC-SDK] ${message}`, error, ...args);
    }
  }

  /**
   * Check if we should log at the given level
   */
  private static shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
}
