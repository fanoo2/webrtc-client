// Re-export everything from client
export * from "./client/RoomClient";

// Re-export configuration utilities  
export * from "./utils/config";

// Re-export specific factory functions for convenience
export { createRoomClient, createRoomClientWithConfig } from "./client/RoomClient";

// Re-export types for consumers
export type { 
  LiveKitRoom, 
  RoomClientConfig, 
  RoomConnectionParams 
} from './types/index';

// Re-export logging utility
import { Logger } from './utils/logger';

/**
 * Set the logging level for the SDK
 * @param level The desired log level
 */
export function setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
  Logger.setLogLevel(level);
}

// Export Logger for direct access
export { Logger };
