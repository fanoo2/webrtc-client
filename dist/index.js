"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.createRoomClientWithConfig = exports.createRoomClient = void 0;
exports.setLogLevel = setLogLevel;
// Re-export everything from client
__exportStar(require("./client/RoomClient"), exports);
// Re-export configuration utilities  
__exportStar(require("./utils/config"), exports);
// Re-export specific factory functions for convenience
var RoomClient_1 = require("./client/RoomClient");
Object.defineProperty(exports, "createRoomClient", { enumerable: true, get: function () { return RoomClient_1.createRoomClient; } });
Object.defineProperty(exports, "createRoomClientWithConfig", { enumerable: true, get: function () { return RoomClient_1.createRoomClientWithConfig; } });
// Re-export logging utility
const logger_1 = require("./utils/logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
/**
 * Set the logging level for the SDK
 * @param level The desired log level
 */
function setLogLevel(level) {
    logger_1.Logger.setLogLevel(level);
}
