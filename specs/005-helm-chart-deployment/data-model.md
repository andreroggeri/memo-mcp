# Data Model: Helm Chart Configuration

The Helm chart for `memo-mcp` is configured via `values.yaml`.

## Entities

### Chart Configuration (`values.yaml`)

| Field              | Description                              | Default                         |
| ------------------ | ---------------------------------------- | ------------------------------- |
| `image.repository` | Docker image repository                  | `ghcr.io/yourusername/memo-mcp` |
| `image.tag`        | Docker image tag                         | `latest`                        |
| `image.pullPolicy` | Image pull policy                        | `IfNotPresent`                  |
| `service.type`     | Kubernetes Service type                  | `ClusterIP`                     |
| `service.port`     | External port for the Service            | `80`                            |
| `mcp.transport`    | MCP transport mode (MUST be `http`)      | `http`                          |
| `mcp.port`         | Internal container port                  | `3000`                          |
| `memo.server_url`  | URL of the backend Memo API              | `""`                            |
| `memo.api_key`     | API Key for the backend Memo API         | `""`                            |
| `env`              | List of additional environment variables | `[]`                            |
| `resources`        | CPU/Memory limits and requests           | `{}`                            |
| `nodeSelector`     | Node selection labels                    | `{}`                            |
| `tolerations`      | Pod tolerations                          | `[]`                            |
| `affinity`         | Pod affinity rules                       | `{}`                            |

## Validation Rules

- `mcp.transport` should be locked or defaulted to `http`.
- `image.repository` must be a valid Docker registry path.
- `service.port` must be a valid port number (1-65535).
