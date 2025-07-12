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
    try {
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
