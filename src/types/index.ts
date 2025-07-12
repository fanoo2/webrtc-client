import { Room, RoomOptions, RoomConnectOptions } from 'livekit-client';

/**
 * Configuration options for creating a room client
 */
export interface RoomClientConfig {
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
export interface RoomConnectionParams {
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
export interface LiveKitRoom extends Room {
  /** Connect to a room with the given parameters */
  connectToRoom(params: RoomConnectionParams): Promise<void>;
  /** Disconnect from the current room */
  disconnectFromRoom(): Promise<void>;
  /** Get current connection status */
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected';
}

/**
 * Event types for room management
 */
export interface RoomEvents {
  'connection-state-changed': (state: 'connected' | 'connecting' | 'disconnected') => void;
  'participant-joined': (participantId: string) => void;
  'participant-left': (participantId: string) => void;
  'error': (error: Error) => void;
}
