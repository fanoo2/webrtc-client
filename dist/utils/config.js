"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
/**
 * Configuration utility for reading environment variables and settings
 */
class Config {
    /**
     * Get LiveKit API key from environment variables
     */
    static getLiveKitApiKey() {
        const apiKey = process.env.LIVEKIT_API_KEY;
        if (!apiKey) {
            throw new Error('LIVEKIT_API_KEY environment variable is required');
        }
        return apiKey;
    }
    /**
     * Get LiveKit API secret from environment variables
     */
    static getLiveKitApiSecret() {
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        if (!apiSecret) {
            throw new Error('LIVEKIT_API_SECRET environment variable is required');
        }
        return apiSecret;
    }
    /**
     * Get LiveKit server URL from environment variables with fallback
     */
    static getLiveKitUrl() {
        return process.env.LIVEKIT_URL || 'ws://localhost:7881';
    }
    /**
     * Get all LiveKit configuration from environment
     */
    static getLiveKitConfig() {
        return {
            url: this.getLiveKitUrl(),
            apiKey: this.getLiveKitApiKey(),
            apiSecret: this.getLiveKitApiSecret()
        };
    }
    /**
     * Validate that all required environment variables are present
     */
    static validateEnvironment() {
        try {
            this.getLiveKitApiKey();
            this.getLiveKitApiSecret();
        }
        catch (error) {
            throw new Error(`Environment validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.Config = Config;
