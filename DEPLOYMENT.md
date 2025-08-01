# WebRTC Client SDK - Deployment Examples

This document provides examples for deploying the WebRTC Client SDK in different ways.

## NPM Package Usage

### Basic Node.js Application

```javascript
const { createRoomClient } = require('@fanno/webrtc-client');

async function main() {
  const roomClient = createRoomClient();
  
  await roomClient.connectToRoom({
    roomName: 'my-room',
    participantIdentity: 'user-123',
    participantMetadata: 'John Doe'
  });
  
  console.log('Connected to room:', roomClient.getRoomInfo());
}

main().catch(console.error);
```

## Docker Deployment

### Simple Docker Run

```bash
# Run the SDK container with environment variables
docker run -d \
  --name webrtc-sdk \
  -e LIVEKIT_API_KEY=your_api_key_here \
  -e LIVEKIT_API_SECRET=your_api_secret_here \
  -e LIVEKIT_URL=wss://your-livekit-server.com \
  -p 3000:3000 \
  ghcr.io/fanoo2/webrtc-client:latest
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  webrtc-sdk:
    image: ghcr.io/fanoo2/webrtc-client:latest
    ports:
      - "3000:3000"
    environment:
      - LIVEKIT_API_KEY=your_api_key_here
      - LIVEKIT_API_SECRET=your_api_secret_here
      - LIVEKIT_URL=wss://your-livekit-server.com
      - NODE_ENV=production
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

## Kubernetes with Helm

### Quick Start

```bash
# Install with default values
helm install webrtc-sdk ./helm/webrtc-client-sdk

# Check the deployment
kubectl get pods -l app.kubernetes.io/name=webrtc-client-sdk
```

### Production Deployment

Create a `values-production.yaml` file:

```yaml
replicaCount: 3

image:
  repository: ghcr.io/fanoo2/webrtc-client
  tag: "1.0.5"
  pullPolicy: IfNotPresent

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 256Mi

livekit:
  url: "wss://your-livekit-server.com"
  # Set these via secrets in production
  apiKey: "your-api-key"
  apiSecret: "your-api-secret"

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
    - host: webrtc-sdk.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: webrtc-sdk-tls
      hosts:
        - webrtc-sdk.yourdomain.com

nodeSelector:
  kubernetes.io/arch: amd64

tolerations:
  - key: "app"
    operator: "Equal"
    value: "webrtc"
    effect: "NoSchedule"
```

Deploy with production values:

```bash
helm install webrtc-sdk ./helm/webrtc-client-sdk -f values-production.yaml
```

### Using Secrets for Sensitive Data

For production deployments, create secrets for LiveKit credentials:

```bash
# Create secret for LiveKit credentials
kubectl create secret generic webrtc-livekit-secret \
  --from-literal=api-key=your_actual_api_key \
  --from-literal=api-secret=your_actual_api_secret
```

Then reference it in your Helm values:

```yaml
livekit:
  url: "wss://your-livekit-server.com"
  # Don't set apiKey/apiSecret in values
  # Instead, modify the deployment to use the secret above
```

## CI/CD Integration

### Frontend Notification Setup

To receive notifications when new SDK versions are released, configure these repository variables:

```bash
# Set in GitHub repository settings -> Secrets and variables -> Actions
FRONTEND_WEBHOOK_URL=https://your-frontend-api.com/webhooks/sdk-release
FRONTEND_REPO=your-org/your-frontend-repo
FRONTEND_TOKEN=ghp_your_personal_access_token
```

The notification payload will include:

```json
{
  "event": "sdk_release",
  "timestamp": "2024-01-01T00:00:00Z",
  "sdk": {
    "name": "@fanno/webrtc-client",
    "version": "1.0.6",
    "tag": "v1.0.6",
    "repository": "fanoo2/webrtc-client",
    "release_url": "https://github.com/fanoo2/webrtc-client/releases/tag/v1.0.6"
  },
  "artifacts": {
    "npm_package": "@fanno/webrtc-client@1.0.6",
    "docker_image": "ghcr.io/fanoo2/webrtc-client:1.0.6",
    "helm_chart": "helm/webrtc-client-sdk"
  },
  "installation": {
    "npm": "npm install @fanno/webrtc-client@1.0.6",
    "docker": "docker pull ghcr.io/fanoo2/webrtc-client:1.0.6",
    "helm": "helm install webrtc-sdk ./helm/webrtc-client-sdk --set image.tag=1.0.6"
  }
}
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check container health
docker exec webrtc-sdk node -e "console.log('SDK is running')"

# Check Kubernetes deployment
kubectl describe deployment webrtc-sdk
kubectl logs -l app.kubernetes.io/name=webrtc-client-sdk
```

### Upgrades

```bash
# Docker: Pull new image and restart
docker pull ghcr.io/fanoo2/webrtc-client:latest
docker-compose up -d

# Helm: Upgrade to new version
helm upgrade webrtc-sdk ./helm/webrtc-client-sdk --set image.tag=1.0.6
```