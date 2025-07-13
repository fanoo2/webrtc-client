"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
/**
 * Simple logging utility for the WebRTC client SDK
 */
class Logger {
    /**
     * Set the logging level
     */
    static setLogLevel(level) {
        this.logLevel = level;
    }
    /**
     * Log debug messages
     */
    static debug(message, ...args) {
        if (this.shouldLog('debug')) {
            console.debug(`[WebRTC-SDK] ${message}`, ...args);
        }
    }
    /**
     * Log info messages
     */
    static info(message, ...args) {
        if (this.shouldLog('info')) {
            console.info(`[WebRTC-SDK] ${message}`, ...args);
        }
    }
    /**
     * Log warning messages
     */
    static warn(message, ...args) {
        if (this.shouldLog('warn')) {
            console.warn(`[WebRTC-SDK] ${message}`, ...args);
        }
    }
    /**
     * Log error messages
     */
    static error(message, error, ...args) {
        if (this.shouldLog('error')) {
            console.error(`[WebRTC-SDK] ${message}`, error, ...args);
        }
    }
    /**
     * Check if we should log at the given level
     */
    static shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }
}
exports.Logger = Logger;
Logger.logLevel = 'info';
