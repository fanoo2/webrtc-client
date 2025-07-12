"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.Config = exports.RoomClient = void 0;
exports.createRoomClient = createRoomClient;
exports.createRoomClientWithConfig = createRoomClientWithConfig;
exports.setLogLevel = setLogLevel;
const RoomClient_1 = require("./client/RoomClient");
const config_1 = require("./utils/config");
const logger_1 = require("./utils/logger");
/**
 * Create a new LiveKit room client with automatic configuration
 * @returns A configured LiveKitRoom instance
 */
function createRoomClient() {
    try {
        // Validate environment variables
        config_1.Config.validateEnvironment();
        // Get configuration from environment
        const config = config_1.Config.getLiveKitConfig();
        // Create and return the room client
        const roomClient = new RoomClient_1.RoomClient(config);
        logger_1.Logger.info('WebRTC client SDK initialized successfully');
        return roomClient;
    }
    catch (error) {
        logger_1.Logger.error('Failed to create room client', error);
        throw new Error(`Failed to initialize WebRTC client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Create a room client with custom configuration
 * @param config Custom configuration options
 * @returns A configured LiveKitRoom instance
 */
function createRoomClientWithConfig(config) {
    try {
        const roomClient = new RoomClient_1.RoomClient(config);
        logger_1.Logger.info('WebRTC client SDK initialized with custom config');
        return roomClient;
    }
    catch (error) {
        logger_1.Logger.error('Failed to create room client with custom config', error);
        throw new Error(`Failed to initialize WebRTC client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Set the logging level for the SDK
 * @param level The desired log level
 */
function setLogLevel(level) {
    logger_1.Logger.setLogLevel(level);
}
// Re-export the RoomClient class for advanced usage
var RoomClient_2 = require("./client/RoomClient");
Object.defineProperty(exports, "RoomClient", { enumerable: true, get: function () { return RoomClient_2.RoomClient; } });
var config_2 = require("./utils/config");
Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return config_2.Config; } });
var logger_2 = require("./utils/logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_2.Logger; } });
// Default export
exports.default = {
    createRoomClient,
    createRoomClientWithConfig,
    setLogLevel,
    RoomClient: RoomClient_1.RoomClient,
    Config: config_1.Config,
    Logger: logger_1.Logger
};
//# sourceMappingURL=index.js.map