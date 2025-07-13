/**
 * Configuration utility for reading environment variables and settings
 */
export declare class Config {
    /**
     * Get LiveKit API key from environment variables (optional for browser environments)
     */
    static getLiveKitApiKey(): string | undefined;
    /**
     * Get LiveKit API secret from environment variables (optional for browser environments)
     */
    static getLiveKitApiSecret(): string | undefined;
    /**
     * Get LiveKit server URL from environment variables with fallback
     */
    static getLiveKitUrl(): string;
    /**
     * Get all LiveKit configuration from environment (browser-safe)
     */
    static getLiveKitConfig(): {
        url: string;
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    /**
     * Validate that all required environment variables are present for server-side usage
     * Note: This is optional in browser environments where a tokenProvider should be used instead
     */
    static validateEnvironment(): void;
}
