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

### Required LiveKit Credentials

**Important**: The WebRTC Client SDK requires LiveKit API credentials to function properly. These credentials must be provided via Kubernetes secrets for security.

**Required secrets:**
- `LIVEKIT_API_KEY`: Your LiveKit API key
- `LIVEKIT_API_SECRET`: Your LiveKit API secret  
- `LIVEKIT_URL`: Your LiveKit server URL

You can configure them in several ways:

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
| `ingress.enabled` | Enable ingress | `false` |
| `ingress.className` | Ingress class name | `""` |
| `nodeSelector` | Node selector for pod assignment | `{}` |
| `tolerations` | Tolerations for pod assignment | `[]` |
| `affinity` | Affinity for pod assignment | `{}` |

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

### Deployment Variables

You can customize various aspects of your deployment using the following values.yaml parameters:

#### Scaling Configuration
- **`replicaCount`**: Number of pod replicas (default: 2)
- **`autoscaling.enabled`**: Enable horizontal pod autoscaling (default: true)
- **`autoscaling.minReplicas`**: Minimum number of replicas for HPA (default: 2)
- **`autoscaling.maxReplicas`**: Maximum number of replicas for HPA (default: 10)
- **`autoscaling.targetCPUUtilizationPercentage`**: CPU threshold for scaling (default: 70%)

#### Resource Management
- **`resources.requests.cpu`**: CPU request per pod (default: 100m)
- **`resources.requests.memory`**: Memory request per pod (default: 128Mi)
- **`resources.limits.cpu`**: CPU limit per pod (default: 500m)
- **`resources.limits.memory`**: Memory limit per pod (default: 512Mi)

#### Ingress and Networking
- **`ingress.enabled`**: Enable external access via ingress (default: false)
- **`ingress.className`**: Ingress controller class (e.g., nginx)
- **`ingress.hosts`**: Configure domain names and paths
- **`service.type`**: Service type (ClusterIP, NodePort, LoadBalancer)
- **`service.port`**: Service port (default: 3000)

#### Environment Configuration
- **`env`**: Additional environment variables
- **`NODE_ENV`**: Node.js environment (set to production via Helm values)

Example production configuration:
```yaml
replicaCount: 3
resources:
  requests:
    cpu: 200m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 1Gi
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 60
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: webrtc.yourdomain.com
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