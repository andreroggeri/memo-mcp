# Research: Helm Chart Deployment and Automation

## Decision 1: Helm Chart Releaser

- **Decision**: Use `helm/chart-releaser-action`.
- **Rationale**: This is the industry-standard action for hosting Helm charts on GitHub Pages. It automates packaging, versioning, and index updates.
- **Alternatives considered**: Manual packaging and pushing to an OCI registry (GCR/AR), but GitHub Pages is simpler for a public open-source project and specifically requested.

## Decision 2: Transport Layer (SSE vs Streamable HTTP)

- **Decision**: Use the existing `http` transport (which uses `StreamableHTTPServerTransport`) but ensure the Helm chart labels it clearly and supports standard HTTP health checks.
- **Rationale**: The user mentioned "sse configuration". In the MCP SDK, `StreamableHTTPServerTransport` is a streaming HTTP transport that fulfills the same role as SSE but with better performance/bidirectionality. If specific "traditional" SSE is required, `SSEServerTransport` could be used, but `StreamableHTTPServerTransport` is generally preferred for newer MCP servers. I will configure the Helm chart to expose this as an HTTP service.
- **K8s Implications**: Streamable HTTP requires the Ingress/LoadBalancer to support long-lived connections and potentially disabling response buffering.

## Decision 3: Chart Repository

- **Decision**: Use GitHub Pages (`gh-pages` branch) as the target for `chart-releaser-action`.
- **Rationale**: standard practice for GitHub-hosted charts.

## Research Findings: chart-releaser-action

- Requires a `Chart.yaml` with correct versioning.
- Requires a `charts/` directory.
- The workflow should trigger on pushes to the main branch or tags.
- Needs `CR_TOKEN` (GitHub Token) with `contents: write` permissions.
