import * as livekit_client from 'livekit-client';
import { Room, RoomOptions, RoomConnectOptions, ConnectionState } from 'livekit-client';

/**
 * Configuration options for creating a room client
 */
interface RoomClientConfig {
    /** LiveKit server URL */
    url: string;
    /** API key for authentication */
    apiKey: string;
    /** API secret for authentication */
    apiSecret: string;
    /** Optional room options */
    roomOptions?: RoomOptions;
    /** Optional connection options */
    connectOptions?: RoomConnectOptions;
}
/**
 * Room connection parameters
 */
interface RoomConnectionParams {
    /** Room name to connect to */
    roomName: string;
    /** Participant identity */
    participantIdentity: string;
    /** Optional participant metadata */
    participantMetadata?: string;
    /** Optional room metadata */
    roomMetadata?: string;
}
/**
 * LiveKit room wrapper with additional functionality
 */
interface LiveKitRoom extends Room {
    /** Connect to a room with the given parameters */
    connectToRoom(params: RoomConnectionParams): Promise<void>;
    /** Disconnect from the current room */
    disconnectFromRoom(): Promise<void>;
    /** Get current connection status */
    getConnectionStatus(): 'connected' | 'connecting' | 'disconnected';
}

/**
 * Enhanced LiveKit room client with additional functionality
 */
declare class RoomClient extends Room implements LiveKitRoom {
    private config;
    private connectionStatus;
    constructor(config: RoomClientConfig);
    /**
     * Setup event listeners for room state management
     */
    private setupEventListeners;
    /**
     * Connect to a LiveKit room with the given parameters
     */
    connectToRoom(params: RoomConnectionParams): Promise<void>;
    /**
     * Disconnect from the current room
     */
    disconnectFromRoom(): Promise<void>;
    /**
     * Get current connection status
     */
    getConnectionStatus(): 'connected' | 'connecting' | 'disconnected';
    /**
     * Generate access token for room connection
     * Note: In a production environment, this should be done on the server side
     */
    private generateAccessToken;
    /**
     * Get room information
     */
    getRoomInfo(): {
        name: string;
        participantCount: number;
        connectionState: ConnectionState;
        connectionStatus: "connected" | "connecting" | "disconnected";
        metadata: string | undefined;
    };
    /**
     * Get local participant information
     */
    getLocalParticipant(): {
        identity: string;
        name: string | undefined;
        metadata: string | undefined;
        isSpeaking: boolean;
        audioTracks: livekit_client.LocalTrackPublication[];
        videoTracks: livekit_client.LocalTrackPublication[];
    } | null;
    /**
     * Get all remote participants information
     */
    getRemoteParticipants(): {
        identity: string;
        name: string | undefined;
        metadata: string | undefined;
        isSpeaking: boolean;
        audioTracks: livekit_client.RemoteTrackPublication[];
        videoTracks: livekit_client.RemoteTrackPublication[];
    }[];
}
/**
 * Create a new LiveKit room client with automatic configuration
 * @returns A configured LiveKitRoom instance
 */
declare function createRoomClient(): LiveKitRoom;
/**
 * Create a room client with custom configuration
 * @param config Custom configuration options
 * @returns A configured LiveKitRoom instance
 */
declare function createRoomClientWithConfig(config: RoomClientConfig): LiveKitRoom;

/**
 * Configuration utility for reading environment variables and settings
 */
declare class Config {
    /**
     * Get LiveKit API key from environment variables
     */
    static getLiveKitApiKey(): string;
    /**
     * Get LiveKit API secret from environment variables
     */
    static getLiveKitApiSecret(): string;
    /**
     * Get LiveKit server URL from environment variables with fallback
     */
    static getLiveKitUrl(): string;
    /**
     * Get all LiveKit configuration from environment
     */
    static getLiveKitConfig(): {
        url: string;
        apiKey: string;
        apiSecret: string;
    };
    /**
     * Validate that all required environment variables are present
     */
    static validateEnvironment(): void;
}

/**
 * Simple logging utility for the WebRTC client SDK
 */
declare class Logger {
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

/**
 * Set the logging level for the SDK
 * @param level The desired log level
 */
declare function setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void;

export { Config, type LiveKitRoom, Logger, RoomClient, type RoomClientConfig, type RoomConnectionParams, createRoomClient, createRoomClientWithConfig, setLogLevel };
