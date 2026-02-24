# Quickstart: Deploying with Helm

## Prerequisites

- A Kubernetes cluster (v1.19+)
- Helm v3 installed
- Access to the `memo-mcp` Docker image

## Installation

1. Add the Helm repository (after release):

   ```bash
   helm repo add memo-mcp https://andreroggeri.github.io/memo-mcp/
   helm repo update
   ```

2. Install the chart:

   ```bash
   helm install my-memo-mcp memo-mcp/memo-mcp \
     --set memo.server_url="https://your-memos-instance.com" \
     --set memo.api_key="your-api-key"
   ```

3. Verify the deployment:
   ```bash
   kubectl get pods
   kubectl get svc
   ```

## Connecting to the Server

The server will be reachable at the Service's IP/Hostname on port 80 (or your configured port). Use an MCP client compatible with HTTP/SSE transport.
