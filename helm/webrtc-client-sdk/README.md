# WebRTC Client SDK Helm Chart

This Helm chart deploys the WebRTC Client SDK as a containerized application in Kubernetes.

## Prerequisites

- Kubernetes 1.20+
- Helm 3.0+

## Installation

### Add the repository (if published to a chart repository)

```bash
helm repo add webrtc-sdk https://fanoo2.github.io/webrtc-client-helm-charts
helm repo update
```

### Install from source

```bash
git clone https://github.com/fanoo2/webrtc-client.git
cd webrtc-client
helm install my-webrtc-sdk ./helm/webrtc-client-sdk
```

### Install with custom values

```bash
helm install my-webrtc-sdk ./helm/webrtc-client-sdk \
  --set image.tag=1.0.5 \
  --set replicaCount=3 \
  --set resources.requests.memory=256Mi
```

## Configuration

### Required Configuration

The SDK requires LiveKit credentials to function. You can configure them in several ways:

#### Method 1: Using Kubernetes Secrets (Recommended)

```bash
kubectl create secret generic webrtc-livekit-config \
  --from-literal=api-key="your-livekit-api-key" \
  --from-literal=api-secret="your-livekit-api-secret"
```

Then reference the secret in your values:

```yaml
livekit:
  url: "wss://your-livekit-server.com"
  apiKey: "your-api-key"  # This will create a secret reference
  apiSecret: "your-api-secret"  # This will create a secret reference
```

#### Method 2: Using External Secrets

```yaml
livekit:
  url: "wss://your-livekit-server.com"
  # Don't set apiKey/apiSecret here
  # Instead, create your own secret and modify the deployment template
```

### Configuration Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Image repository | `ghcr.io/fanoo2/webrtc-client` |
| `image.tag` | Image tag | `""` (uses Chart appVersion) |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Service type | `ClusterIP` |
| `service.port` | Service port | `3000` |
| `resources.limits.cpu` | CPU limit | `500m` |
| `resources.limits.memory` | Memory limit | `512Mi` |
| `resources.requests.cpu` | CPU request | `100m` |
| `resources.requests.memory` | Memory request | `128Mi` |
| `livekit.url` | LiveKit server URL | `ws://localhost:7881` |
| `autoscaling.enabled` | Enable HPA | `false` |
| `autoscaling.minReplicas` | Min replicas for HPA | `1` |
| `autoscaling.maxReplicas` | Max replicas for HPA | `10` |

### Example values.yaml

```yaml
replicaCount: 2

image:
  repository: ghcr.io/fanoo2/webrtc-client
  tag: "1.0.5"

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 256Mi

livekit:
  url: "wss://my-livekit-server.com"
  apiKey: "my-api-key"
  apiSecret: "my-api-secret"

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: webrtc-sdk.example.com
      paths:
        - path: /
          pathType: Prefix
```

## Uninstall

```bash
helm uninstall my-webrtc-sdk
```

## Development

### Testing the chart

```bash
# Validate the chart
helm lint ./helm/webrtc-client-sdk

# Test template rendering
helm template test-release ./helm/webrtc-client-sdk

# Dry run installation
helm install --dry-run --debug test-release ./helm/webrtc-client-sdk
```

### Upgrading

```bash
helm upgrade my-webrtc-sdk ./helm/webrtc-client-sdk
```