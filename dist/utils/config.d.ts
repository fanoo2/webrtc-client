/**
 * Configuration utility for reading environment variables and settings
 */
export declare class Config {
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
