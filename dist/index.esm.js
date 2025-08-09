// src/client/RoomClient.ts
import {
  Room,
  RoomEvent
} from "livekit-client";

// src/utils/logger.ts
var Logger = class {
  /**
   * Set the logging level
   */
  static setLogLevel(level) {
    this.logLevel = level;
  }
  /**
   * Log debug messages
   */
  static debug(message, ...args) {
    if (this.shouldLog("debug")) {
      console.debug(`[WebRTC-SDK] ${message}`, ...args);
    }
  }
  /**
   * Log info messages
   */
  static info(message, ...args) {
    if (this.shouldLog("info")) {
      console.info(`[WebRTC-SDK] ${message}`, ...args);
    }
  }
  /**
   * Log warning messages
   */
  static warn(message, ...args) {
    if (this.shouldLog("warn")) {
      console.warn(`[WebRTC-SDK] ${message}`, ...args);
    }
  }
  /**
   * Log error messages
   */
  static error(message, error, ...args) {
    if (this.shouldLog("error")) {
      console.error(`[WebRTC-SDK] ${message}`, error, ...args);
    }
  }
  /**
   * Check if we should log at the given level
   */
  static shouldLog(level) {
    const levels = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
};
Logger.logLevel = "info";

// src/utils/config.ts
var Config = class {
  /**
   * Get LiveKit API key from environment variables (optional for browser environments)
   */
  static getLiveKitApiKey() {
    if (typeof process === "undefined" || !process.env) {
      return void 0;
    }
    return process.env.LIVEKIT_API_KEY;
  }
  /**
   * Get LiveKit API secret from environment variables (optional for browser environments)
   */
  static getLiveKitApiSecret() {
    if (typeof process === "undefined" || !process.env) {
      return void 0;
    }
    return process.env.LIVEKIT_API_SECRET;
  }
  /**
   * Get LiveKit server URL from environment variables with fallback
   */
  static getLiveKitUrl() {
    if (typeof process === "undefined" || !process.env) {
      return "ws://localhost:7881";
    }
    return process.env.LIVEKIT_URL || "ws://localhost:7881";
  }
  /**
   * Get all LiveKit configuration from environment (browser-safe)
   */
  static getLiveKitConfig() {
    return {
      url: this.getLiveKitUrl(),
      apiKey: this.getLiveKitApiKey(),
      apiSecret: this.getLiveKitApiSecret()
    };
  }
  /**
   * Validate that all required environment variables are present for server-side usage
   * Note: This is optional in browser environments where a tokenProvider should be used instead
   */
  static validateEnvironment() {
    const apiKey = this.getLiveKitApiKey();
    const apiSecret = this.getLiveKitApiSecret();
    if (!apiKey || !apiSecret) {
      throw new Error("LIVEKIT_API_KEY and LIVEKIT_API_SECRET environment variables are required for server-side token generation. In browser environments, provide a custom tokenProvider instead.");
    }
  }
};

// src/client/RoomClient.ts
var RoomClient = class extends Room {
  constructor(config) {
    const roomOptions = {
      adaptiveStream: true,
      dynacast: true,
      ...config.roomOptions
    };
    super(roomOptions);
    this.connectionStatus = "disconnected";
    this.config = config;
    this.setupEventListeners();
    Logger.info("RoomClient initialized with config", { url: config.url });
  }
  /**
   * Setup event listeners for room state management
   */
  setupEventListeners() {
    this.on(RoomEvent.Connected, () => {
      this.connectionStatus = "connected";
      Logger.info("Successfully connected to room");
    });
    this.on(RoomEvent.Disconnected, (reason) => {
      this.connectionStatus = "disconnected";
      Logger.info("Disconnected from room", { reason });
    });
    this.on(RoomEvent.Reconnecting, () => {
      this.connectionStatus = "connecting";
      Logger.info("Reconnecting to room...");
    });
    this.on(RoomEvent.ParticipantConnected, (participant) => {
      Logger.info("Participant joined", { identity: participant.identity });
    });
    this.on(RoomEvent.ParticipantDisconnected, (participant) => {
      Logger.info("Participant left", { identity: participant.identity });
    });
    this.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      Logger.debug("Connection quality changed", {
        quality,
        participant: participant?.identity || "local"
      });
    });
    this.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      Logger.debug("Track subscribed", {
        trackKind: track.kind,
        participant: participant.identity
      });
    });
    this.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      Logger.debug("Track unsubscribed", {
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
      Logger.info("Attempting to connect to room", {
        roomName: params.roomName,
        participantIdentity: params.participantIdentity
      });
      const token = await this.generateAccessToken(params);
      const connectOptions = {
        autoSubscribe: true,
        ...this.config.connectOptions
      };
      await this.connect(this.config.url, token, connectOptions);
      Logger.info("Successfully connected to room", {
        roomName: params.roomName,
        participantCount: this.numParticipants
      });
    } catch (error) {
      this.connectionStatus = "disconnected";
      Logger.error("Failed to connect to room", error);
      throw error;
    }
  }
  /**
   * Disconnect from the current room
   */
  async disconnectFromRoom() {
    try {
      Logger.info("Disconnecting from room...");
      await this.disconnect();
      this.connectionStatus = "disconnected";
      Logger.info("Successfully disconnected from room");
    } catch (error) {
      Logger.error("Error during disconnection", error);
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
    if (this.config.tokenProvider) {
      Logger.info("Using custom token provider");
      return await this.config.tokenProvider(params);
    }
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error("API key and secret are required for server-side token generation, or provide a custom tokenProvider");
    }
    try {
      if (typeof window !== "undefined") {
        throw new Error("Server-side token generation is not available in browser environments. Please provide a tokenProvider function in your config that calls your server endpoint.");
      }
      const { AccessToken } = await import("livekit-server-sdk");
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
    } catch {
      Logger.warn("Using fallback token generation - implement server-side token generation for production");
      const payload = {
        iss: this.config.apiKey,
        sub: params.participantIdentity,
        exp: Math.floor(Date.now() / 1e3) + 3600,
        // 1 hour
        room: params.roomName,
        metadata: params.participantMetadata || ""
      };
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
    return Array.from(this.remoteParticipants.values()).map((participant) => ({
      identity: participant.identity,
      name: participant.name,
      metadata: participant.metadata,
      isSpeaking: participant.isSpeaking,
      audioTracks: Array.from(participant.audioTrackPublications.values()),
      videoTracks: Array.from(participant.videoTrackPublications.values())
    }));
  }
};
function createRoomClient() {
  try {
    Config.validateEnvironment();
    const config = Config.getLiveKitConfig();
    const roomClient = new RoomClient(config);
    Logger.info("WebRTC client SDK initialized successfully");
    return roomClient;
  } catch (error) {
    Logger.error("Failed to create room client", error);
    throw new Error(`Failed to initialize WebRTC client: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
function createRoomClientWithConfig(config) {
  try {
    const roomClient = new RoomClient(config);
    Logger.info("WebRTC client SDK initialized with custom config");
    return roomClient;
  } catch (error) {
    Logger.error("Failed to create room client with custom config", error);
    throw new Error(`Failed to initialize WebRTC client: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// src/index.ts
function setLogLevel(level) {
  Logger.setLogLevel(level);
}
export {
  Config,
  Logger,
  RoomClient,
  createRoomClient,
  createRoomClientWithConfig,
  setLogLevel
};
