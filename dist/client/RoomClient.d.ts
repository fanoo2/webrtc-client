import { Room, ConnectionState } from 'livekit-client';
import { LiveKitRoom, RoomConnectionParams, RoomClientConfig } from '../types/index';
/**
 * Enhanced LiveKit room client with additional functionality
 */
export declare class RoomClient extends Room implements LiveKitRoom {
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
        audioTracks: import("livekit-client").LocalTrackPublication[];
        videoTracks: import("livekit-client").LocalTrackPublication[];
    } | null;
    /**
     * Get all remote participants information
     */
    getRemoteParticipants(): {
        identity: string;
        name: string | undefined;
        metadata: string | undefined;
        isSpeaking: boolean;
        audioTracks: import("livekit-client").RemoteTrackPublication[];
        videoTracks: import("livekit-client").RemoteTrackPublication[];
    }[];
}
//# sourceMappingURL=RoomClient.d.ts.map