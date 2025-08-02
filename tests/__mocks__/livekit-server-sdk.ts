// Mock for livekit-server-sdk
export class AccessToken {
  private apiKey: string;
  private apiSecret: string;
  private options: any;
  private grants: any;

  constructor(apiKey: string, apiSecret: string, options?: any) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.options = options;
  }

  addGrant(grant: any) {
    this.grants = grant;
  }

  toJwt(): string {
    // Return a mock JWT token
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      iss: this.apiKey,
      sub: this.options?.identity || 'test-identity',
      exp: Math.floor(Date.now() / 1000) + 3600,
      ...this.grants
    }));
    const signature = 'mock-signature';
    
    return `${header}.${payload}.${signature}`;
  }
}