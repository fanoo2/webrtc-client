/**
 * Simple logging utility for the WebRTC client SDK
 */
export declare class Logger {
    private static logLevel;
    /**
     * Set the logging level
     */
    static setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void;
    /**
     * Log debug messages
     */
    static debug(message: string, ...args: any[]): void;
    /**
     * Log info messages
     */
    static info(message: string, ...args: any[]): void;
    /**
     * Log warning messages
     */
    static warn(message: string, ...args: any[]): void;
    /**
     * Log error messages
     */
    static error(message: string, error?: Error, ...args: any[]): void;
    /**
     * Check if we should log at the given level
     */
    private static shouldLog;
}
//# sourceMappingURL=logger.d.ts.map