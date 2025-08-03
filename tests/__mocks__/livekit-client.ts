// Mock for livekit-client
export const ConnectionState = {
  Connected: 'connected',
  Connecting: 'connecting',
  Disconnected: 'disconnected',
  Reconnecting: 'reconnecting'
};

export const RoomEvent = {
  Connected: 'connected',
  Disconnected: 'disconnected',
  Reconnecting: 'reconnecting',
  ParticipantConnected: 'participantConnected',
  ParticipantDisconnected: 'participantDisconnected',
  ConnectionQualityChanged: 'connectionQualityChanged',
  TrackSubscribed: 'trackSubscribed',
  TrackUnsubscribed: 'trackUnsubscribed'
};

export class Room {
  name = '';
  numParticipants = 0;
  state = ConnectionState.Disconnected;
  metadata?: string;
  localParticipant: any = null;
  remoteParticipants = new Map();
  
  private eventHandlers = new Map<string, Function[]>();

  constructor(options?: any) {
    // Mock constructor
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }

  emit(event: string, ...args: any[]) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(...args));
  }

  async connect(url: string, token: string, options?: any) {
    this.state = ConnectionState.Connected;
    this.emit(RoomEvent.Connected);
  }

  async disconnect() {
    this.state = ConnectionState.Disconnected;
    this.emit(RoomEvent.Disconnected);
  }
}

export const RemoteParticipant = class {
  identity = 'test-participant';
  name = 'Test Participant';
  metadata = '';
  isSpeaking = false;
  audioTrackPublications = new Map();
  videoTrackPublications = new Map();
};

export const LocalParticipant = class {
  identity = 'local-participant';
  name = 'Local Participant';
  metadata = '';
  isSpeaking = false;
  audioTrackPublications = new Map();
  videoTrackPublications = new Map();
};