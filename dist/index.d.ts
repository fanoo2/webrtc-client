export * from "./client/RoomClient";
export * from "./utils/config";
export { createRoomClient, createRoomClientWithConfig } from "./client/RoomClient";
export type { LiveKitRoom, RoomClientConfig, RoomConnectionParams } from './types/index';
import { Logger } from './utils/logger';
/**
 * Set the logging level for the SDK
 * @param level The desired log level
 */
export declare function setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void;
export { Logger };
//# sourceMappingURL=index.d.ts.map