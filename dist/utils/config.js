"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
/**
 * Configuration utility for reading environment variables and settings
 */
class Config {
    /**
     * Get LiveKit API key from environment variables (optional for browser environments)
     */
    static getLiveKitApiKey() {
        // Guard against browser environments where process.env might not be available
        if (typeof process === 'undefined' || !process.env) {
            return undefined;
        }
        return process.env.LIVEKIT_API_KEY;
    }
    /**
     * Get LiveKit API secret from environment variables (optional for browser environments)
     */
    static getLiveKitApiSecret() {
        // Guard against browser environments where process.env might not be available
        if (typeof process === 'undefined' || !process.env) {
            return undefined;
        }
        return process.env.LIVEKIT_API_SECRET;
    }
    /**
     * Get LiveKit server URL from environment variables with fallback
     */
    static getLiveKitUrl() {
        // Guard against browser environments where process.env might not be available
        if (typeof process === 'undefined' || !process.env) {
            return 'ws://localhost:7881';
        }
        return process.env.LIVEKIT_URL || 'ws://localhost:7881';
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
            throw new Error('LIVEKIT_API_KEY and LIVEKIT_API_SECRET environment variables are required for server-side token generation. In browser environments, provide a custom tokenProvider instead.');
        }
    }
}
exports.Config = Config;
