import { RoomClient } from './client/RoomClient';
import { Config } from './utils/config';
import { Logger } from './utils/logger';
import { LiveKitRoom, RoomClientConfig } from './types/index';
/**
 * Create a new LiveKit room client with automatic configuration
 * @returns A configured LiveKitRoom instance
 */
export declare function createRoomClient(): LiveKitRoom;
/**
 * Create a room client with custom configuration
 * @param config Custom configuration options
 * @returns A configured LiveKitRoom instance
 */
export declare function createRoomClientWithConfig(config: RoomClientConfig): LiveKitRoom;
/**
 * Set the logging level for the SDK
 * @param level The desired log level
 */
export declare function setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void;
export type { LiveKitRoom, RoomClientConfig, RoomConnectionParams } from './types/index';
export { RoomClient } from './client/RoomClient';
export { Config } from './utils/config';
export { Logger } from './utils/logger';
declare const _default: {
    createRoomClient: typeof createRoomClient;
    createRoomClientWithConfig: typeof createRoomClientWithConfig;
    setLogLevel: typeof setLogLevel;
    RoomClient: typeof RoomClient;
    Config: typeof Config;
    Logger: typeof Logger;
};
export default _default;
//# sourceMappingURL=index.d.ts.map