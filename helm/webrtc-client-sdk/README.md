# WebRTC Client SDK Helm Chart

This Helm chart deploys the WebRTC Client SDK as a containerized application in Kubernetes.

## Prerequisites

- Kubernetes 1.20+
- Helm 3.0+

## Installation

### Quick Start with LiveKit Secrets

1. **Create the Kubernetes Secret** 

Run this on your cluster (replace `your-namespace` with the namespace where you'll install the chart):

```bash
kubectl create secret generic webrtc-livekit-config \
  --namespace your-namespace \
  --from-literal=apiKey="APIjCjk8gybWtYv" \
  --from-literal=apiSecret="5WXXakL3GvYAW0mNXBqDW8YwQX6hoJYrVotShmh9o7J"
```

2. **Install the Helm Chart**

Deploy the chart, pointing at your namespace:

```bash
helm upgrade --install my-webrtc-sdk ./helm/webrtc-client-sdk \
  --namespace your-namespace \
  --values ./helm/webrtc-client-sdk/values.yaml
```

The default `values.yaml` is already configured to use the secret with blank `apiKey`/`apiSecret` values.

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

Create a Kubernetes Secret with your LiveKit credentials:

```bash
kubectl create secret generic webrtc-livekit-config \
  --namespace your-namespace \
  --from-literal=apiKey="your-livekit-api-key" \
  --from-literal=apiSecret="your-livekit-api-secret"
```

Then leave the apiKey and apiSecret blank in your values.yaml to use the secret:

```yaml
livekit:
  url: "wss://your-livekit-server.com"
  apiKey: ""     # leave blank → will use webrtc-livekit-config/apiKey
  apiSecret: ""  # leave blank → will use webrtc-livekit-config/apiSecret
```

#### Method 2: Using Direct Values (Not Recommended for Production)

```yaml
livekit:
  url: "wss://your-livekit-server.com"
  apiKey: "your-api-key"     # This will be set as a direct environment variable
  apiSecret: "your-api-secret"  # This will be set as a direct environment variable
```

### Configuration Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `2` |
| `image.repository` | Image repository | `ghcr.io/fanoo2/webrtc-client` |
| `image.tag` | Image tag | `"1.0.5"` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Service type | `ClusterIP` |
| `service.port` | Service port | `3000` |
| `resources.limits.cpu` | CPU limit | `500m` |
| `resources.limits.memory` | Memory limit | `512Mi` |
| `resources.requests.cpu` | CPU request | `100m` |
| `resources.requests.memory` | Memory request | `128Mi` |
| `livekit.url` | LiveKit server URL | `"wss://fanno-1s7jndnl.livekit.cloud"` |
| `livekit.apiKey` | LiveKit API key (leave blank to use secret) | `""` |
| `livekit.apiSecret` | LiveKit API secret (leave blank to use secret) | `""` |
| `autoscaling.enabled` | Enable HPA | `true` |
| `autoscaling.minReplicas` | Min replicas for HPA | `2` |
| `autoscaling.maxReplicas` | Max replicas for HPA | `10` |
| `autoscaling.targetCPUUtilizationPercentage` | Target CPU for HPA | `70` |

### Example values.yaml

```yaml
replicaCount: 2

image:
  repository: ghcr.io/fanoo2/webrtc-client
  tag: "1.0.5"

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi

livekit:
  url: "wss://fanno-1s7jndnl.livekit.cloud"
  apiKey: ""     # leave blank → will use webrtc-livekit-config/apiKey
  apiSecret: ""  # leave blank → will use webrtc-livekit-config/apiSecret

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