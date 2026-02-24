# Feature Specification: Helm Chart Deployment and Automation

**Feature Branch**: `005-helm-chart-deployment`  
**Created**: 2026-02-23  
**Status**: Draft  
**Input**: User description: "Create a helm chart for this repo. It should also automatically deploy to github actions using helm/chart-releaser-action (Note: Only deploy using the sse configuration as using stdio would be bonkers on k8s)"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Deploying MCP Server to Kubernetes (Priority: P1)

As a DevOps engineer, I want to deploy the `memo-mcp` server to a Kubernetes cluster using a Helm chart so that I can manage the application lifecycle using standard cloud-native tools. I specifically need to use the SSE transport mode because standard I/O is not suitable for networked Kubernetes services.

**Why this priority**: Core value of the feature. Without a working Helm chart, the server cannot be easily deployed to production-like environments.

**Independent Test**: Can be fully tested by running `helm install` in a local Kubernetes environment (like Minikube or Kind) and verifying the server starts and accepts SSE connections.

**Acceptance Scenarios**:

1. **Given** a Kubernetes cluster and the Helm chart, **When** I run `helm install memo-mcp ./charts/memo-mcp`, **Then** a Deployment and Service are created.
2. **Given** the application is running, **When** I connect to the Service endpoint, **Then** I receive a valid SSE stream for the MCP protocol.

---

### User Story 2 - Automated Chart Releasing (Priority: P2)

As a maintainer, I want the Helm chart to be automatically packaged and released to a chart repository whenever I release a new version of the software, ensuring that users always have access to the latest deployment configurations.

**Why this priority**: Ensures long-term maintainability and ease of use for downstream users.

**Independent Test**: Can be tested by triggering a GitHub Action via a tag push and verifying the new chart version appears in the repository's `index.yaml`.

**Acceptance Scenarios**:

1. **Given** a new version tag is pushed to GitHub, **When** the release workflow completes, **Then** the Helm chart is packaged and uploaded to the designated chart repository.

---

### Edge Cases

- **Service Connectivity**: How does the system handle cases where the Ingress/LoadBalancer is not yet ready?
- **Configuration Overrides**: What happens if a user tries to force `stdio` transport via `values.yaml`? (Should probably be discouraged or explicitly handled in documentation).

## Assumptions & Dependencies

- **SSE Support**: The `memo-mcp` application is assumed to support HTTP/SSE transport mode as requested.
- **Container Image**: A Docker image for the application is available in a registry accessible by the Kubernetes cluster.
- **GitHub Permissions**: The repository has sufficient permissions to publish to a chart repository (e.g., GitHub Pages).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a valid Helm chart structure in the `charts/` directory.
- **FR-002**: The Helm chart MUST configure the container to use SSE transport mode for MCP communication.
- **FR-003**: The Helm chart MUST expose the necessary ports for HTTP/SSE traffic (defaulting to a configurable port).
- **FR-004**: System MUST include a GitHub Actions workflow that implements `helm/chart-releaser-action`.
- **FR-005**: The Helm chart MUST support standard Kubernetes configuration options (resource limits, node selectors, environment variables) via `values.yaml`.
- **FR-006**: The Helm chart MUST support configuration of the backend Memo API via `memo.server_url` and `memo.api_key` parameters.
- **FR-007**: The GitHub Actions workflow MUST handle version incrementing and updating the chart's `index.yaml`.

### Key Entities _(include if feature involves data)_

- **Helm Chart**: The package containing Kubernetes manifest templates and default configurations.
- **GitHub Actions Workflow**: The automation definition for testing, packaging, and releasing the chart.
- **Values Configuration**: The set of user-defined parameters for customizing the deployment.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A full deployment of the MCP server can be completed in under 1 minute using the Helm chart.
- **SC-002**: 100% of automated chart releases succeed when valid tags are pushed to the repository.
- **SC-003**: The deployed MCP server maintains 99.9% availability of the SSE endpoint under standard health check conditions.
- **SC-004**: Zero manual steps are required to update the Helm repository index after a software release.
