import { RoomClient } from './client/RoomClient';
import { Config } from './utils/config';
import { Logger } from './utils/logger';
import { LiveKitRoom, RoomClientConfig, RoomConnectionParams } from './types/index';

/**
 * Create a new LiveKit room client with automatic configuration
 * @returns A configured LiveKitRoom instance
 */
export function createRoomClient(): LiveKitRoom {
  try {
    // Validate environment variables
    Config.validateEnvironment();

    // Get configuration from environment
    const config: RoomClientConfig = Config.getLiveKitConfig();

    // Create and return the room client
    const roomClient = new RoomClient(config);
    
    Logger.info('WebRTC client SDK initialized successfully');
    
    return roomClient;
  } catch (error) {
    Logger.error('Failed to create room client', error as Error);
    throw new Error(`Failed to initialize WebRTC client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a room client with custom configuration
 * @param config Custom configuration options
 * @returns A configured LiveKitRoom instance
 */
export function createRoomClientWithConfig(config: RoomClientConfig): LiveKitRoom {
  try {
    const roomClient = new RoomClient(config);
    Logger.info('WebRTC client SDK initialized with custom config');
    return roomClient;
  } catch (error) {
    Logger.error('Failed to create room client with custom config', error as Error);
    throw new Error(`Failed to initialize WebRTC client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Set the logging level for the SDK
 * @param level The desired log level
 */
export function setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
  Logger.setLogLevel(level);
}

// Re-export types for consumers
export type { 
  LiveKitRoom, 
  RoomClientConfig, 
  RoomConnectionParams 
} from './types/index';

// Re-export the RoomClient class for advanced usage
export { RoomClient } from './client/RoomClient';
export { Config } from './utils/config';
export { Logger } from './utils/logger';

// Default export
export default {
  createRoomClient,
  createRoomClientWithConfig,
  setLogLevel,
  RoomClient,
  Config,
  Logger
};
