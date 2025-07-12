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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomClient = void 0;
exports.createRoomClient = createRoomClient;
exports.createRoomClientWithConfig = createRoomClientWithConfig;
const livekit_client_1 = require("livekit-client");
const logger_1 = require("../utils/logger");
const config_1 = require("../utils/config");
/**
 * Enhanced LiveKit room client with additional functionality
 */
class RoomClient extends livekit_client_1.Room {
    constructor(config) {
        const roomOptions = {
            adaptiveStream: true,
            dynacast: true,
            ...config.roomOptions
        };
        super(roomOptions);
        this.connectionStatus = 'disconnected';
        this.config = config;
        this.setupEventListeners();
        logger_1.Logger.info('RoomClient initialized with config', { url: config.url });
    }
    /**
     * Setup event listeners for room state management
     */
    setupEventListeners() {
        this.on(livekit_client_1.RoomEvent.Connected, () => {
            this.connectionStatus = 'connected';
            logger_1.Logger.info('Successfully connected to room');
        });
        this.on(livekit_client_1.RoomEvent.Disconnected, (reason) => {
            this.connectionStatus = 'disconnected';
            logger_1.Logger.info('Disconnected from room', { reason });
        });
        this.on(livekit_client_1.RoomEvent.Reconnecting, () => {
            this.connectionStatus = 'connecting';
            logger_1.Logger.info('Reconnecting to room...');
        });
        this.on(livekit_client_1.RoomEvent.ParticipantConnected, (participant) => {
            logger_1.Logger.info('Participant joined', { identity: participant.identity });
        });
        this.on(livekit_client_1.RoomEvent.ParticipantDisconnected, (participant) => {
            logger_1.Logger.info('Participant left', { identity: participant.identity });
        });
        this.on(livekit_client_1.RoomEvent.ConnectionQualityChanged, (quality, participant) => {
            logger_1.Logger.debug('Connection quality changed', {
                quality,
                participant: participant?.identity || 'local'
            });
        });
        this.on(livekit_client_1.RoomEvent.TrackSubscribed, (track, publication, participant) => {
            logger_1.Logger.debug('Track subscribed', {
                trackKind: track.kind,
                participant: participant.identity
            });
        });
        this.on(livekit_client_1.RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
            logger_1.Logger.debug('Track unsubscribed', {
                trackKind: track.kind,
                participant: participant.identity
            });
        });
    }
    /**
     * Connect to a LiveKit room with the given parameters
     */
    async connectToRoom(params) {
        try {
            logger_1.Logger.info('Attempting to connect to room', {
                roomName: params.roomName,
                participantIdentity: params.participantIdentity
            });
            // Generate access token for the participant
            const token = await this.generateAccessToken(params);
            const connectOptions = {
                autoSubscribe: true,
                ...this.config.connectOptions
            };
            await this.connect(this.config.url, token, connectOptions);
            logger_1.Logger.info('Successfully connected to room', {
                roomName: params.roomName,
                participantCount: this.numParticipants
            });
        }
        catch (error) {
            this.connectionStatus = 'disconnected';
            logger_1.Logger.error('Failed to connect to room', error);
            throw error;
        }
    }
    /**
     * Disconnect from the current room
     */
    async disconnectFromRoom() {
        try {
            logger_1.Logger.info('Disconnecting from room...');
            await this.disconnect();
            this.connectionStatus = 'disconnected';
            logger_1.Logger.info('Successfully disconnected from room');
        }
        catch (error) {
            logger_1.Logger.error('Error during disconnection', error);
            throw error;
        }
    }
    /**
     * Get current connection status
     */
    getConnectionStatus() {
        return this.connectionStatus;
    }
    /**
     * Generate access token for room connection
     * Note: In a production environment, this should be done on the server side
     */
    async generateAccessToken(params) {
        try {
            // This is a simplified token generation for demonstration
            // In production, you should use the LiveKit server SDK to generate tokens server-side
            const { AccessToken } = await Promise.resolve().then(() => __importStar(require('livekit-server-sdk')));
            const token = new AccessToken(this.config.apiKey, this.config.apiSecret, {
                identity: params.participantIdentity,
                metadata: params.participantMetadata
            });
            token.addGrant({
                room: params.roomName,
                roomJoin: true,
                canPublish: true,
                canSubscribe: true,
                canPublishData: true
            });
            return token.toJwt();
        }
        catch (error) {
            // Fallback: Return a basic token structure
            // This should be replaced with proper server-side token generation
            logger_1.Logger.warn('Using fallback token generation - implement server-side token generation for production');
            const payload = {
                iss: this.config.apiKey,
                sub: params.participantIdentity,
                exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
                room: params.roomName,
                metadata: params.participantMetadata || ''
            };
            // This is a placeholder - you need proper JWT signing
            return btoa(JSON.stringify(payload));
        }
    }
    /**
     * Get room information
     */
    getRoomInfo() {
        return {
            name: this.name,
            participantCount: this.numParticipants,
            connectionState: this.state,
            connectionStatus: this.connectionStatus,
            metadata: this.metadata
        };
    }
    /**
     * Get local participant information
     */
    getLocalParticipant() {
        if (!this.localParticipant) {
            return null;
        }
        return {
            identity: this.localParticipant.identity,
            name: this.localParticipant.name,
            metadata: this.localParticipant.metadata,
            isSpeaking: this.localParticipant.isSpeaking,
            audioTracks: Array.from(this.localParticipant.audioTrackPublications.values()),
            videoTracks: Array.from(this.localParticipant.videoTrackPublications.values())
        };
    }
    /**
     * Get all remote participants information
     */
    getRemoteParticipants() {
        return Array.from(this.remoteParticipants.values()).map(participant => ({
            identity: participant.identity,
            name: participant.name,
            metadata: participant.metadata,
            isSpeaking: participant.isSpeaking,
            audioTracks: Array.from(participant.audioTrackPublications.values()),
            videoTracks: Array.from(participant.videoTrackPublications.values())
        }));
    }
}
exports.RoomClient = RoomClient;
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
        const roomClient = new RoomClient(config);
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
        const roomClient = new RoomClient(config);
        logger_1.Logger.info('WebRTC client SDK initialized with custom config');
        return roomClient;
    }
    catch (error) {
        logger_1.Logger.error('Failed to create room client with custom config', error);
        throw new Error(`Failed to initialize WebRTC client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=RoomClient.js.map