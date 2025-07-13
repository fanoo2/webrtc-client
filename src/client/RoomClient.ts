import { 
  Room, 
  RoomOptions, 
  RoomConnectOptions, 
  ConnectionState,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant
} from 'livekit-client';
import { LiveKitRoom, RoomConnectionParams, RoomClientConfig } from '../types/index';
import { Logger } from '../utils/logger';
import { Config } from '../utils/config';

/**
 * Enhanced LiveKit room client with additional functionality
 */
export class RoomClient extends Room implements LiveKitRoom {
  private config: RoomClientConfig;
  private connectionStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected';

  constructor(config: RoomClientConfig) {
    const roomOptions: RoomOptions = {
      adaptiveStream: true,
      dynacast: true,
      ...config.roomOptions
    };

    super(roomOptions);
    this.config = config;
    this.setupEventListeners();
    
    Logger.info('RoomClient initialized with config', { url: config.url });
  }

  /**
   * Setup event listeners for room state management
   */
  private setupEventListeners(): void {
    this.on(RoomEvent.Connected, () => {
      this.connectionStatus = 'connected';
      Logger.info('Successfully connected to room');
    });

    this.on(RoomEvent.Disconnected, (reason) => {
      this.connectionStatus = 'disconnected';
      Logger.info('Disconnected from room', { reason });
    });

    this.on(RoomEvent.Reconnecting, () => {
      this.connectionStatus = 'connecting';
      Logger.info('Reconnecting to room...');
    });

    this.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      Logger.info('Participant joined', { identity: participant.identity });
    });

    this.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      Logger.info('Participant left', { identity: participant.identity });
    });

    this.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      Logger.debug('Connection quality changed', { 
        quality, 
        participant: participant?.identity || 'local' 
      });
    });

    this.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      Logger.debug('Track subscribed', { 
        trackKind: track.kind,
        participant: participant.identity 
      });
    });

    this.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      Logger.debug('Track unsubscribed', { 
        trackKind: track.kind,
        participant: participant.identity 
      });
    });
  }

  /**
   * Connect to a LiveKit room with the given parameters
   */
  async connectToRoom(params: RoomConnectionParams): Promise<void> {
    try {
      Logger.info('Attempting to connect to room', { 
        roomName: params.roomName,
        participantIdentity: params.participantIdentity 
      });

      // Generate access token for the participant
      const token = await this.generateAccessToken(params);

      const connectOptions: RoomConnectOptions = {
        autoSubscribe: true,
        ...this.config.connectOptions
      };

      await this.connect(this.config.url, token, connectOptions);
      
      Logger.info('Successfully connected to room', { 
        roomName: params.roomName,
        participantCount: this.numParticipants
      });

    } catch (error) {
      this.connectionStatus = 'disconnected';
      Logger.error('Failed to connect to room', error as Error);
      throw error;
    }
  }

  /**
   * Disconnect from the current room
   */
  async disconnectFromRoom(): Promise<void> {
    try {
      Logger.info('Disconnecting from room...');
      await this.disconnect();
      this.connectionStatus = 'disconnected';
      Logger.info('Successfully disconnected from room');
    } catch (error) {
      Logger.error('Error during disconnection', error as Error);
      throw error;
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    return this.connectionStatus;
  }

  /**
   * Generate access token for room connection
   * Note: In a production environment, this should be done on the server side
   */
  private async generateAccessToken(params: RoomConnectionParams): Promise<string> {
    // If a custom token provider is configured, use it (ideal for browser environments)
    if (this.config.tokenProvider) {
      Logger.info('Using custom token provider');
      return await this.config.tokenProvider(params);
    }

    // Validate server-side requirements
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error('API key and secret are required for server-side token generation, or provide a custom tokenProvider');
    }

    try {
      // Guard server-side imports - only load livekit-server-sdk in Node.js environments
      if (typeof window !== "undefined") {
        throw new Error('Server-side token generation is not available in browser environments. Please provide a tokenProvider function in your config that calls your server endpoint.');
      }
      
      // This is a simplified token generation for demonstration
      // In production, you should use the LiveKit server SDK to generate tokens server-side
      const { AccessToken } = await import('livekit-server-sdk');
      
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
    } catch (error) {
      // Fallback: Return a basic token structure
      // This should be replaced with proper server-side token generation
      Logger.warn('Using fallback token generation - implement server-side token generation for production');
      
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
