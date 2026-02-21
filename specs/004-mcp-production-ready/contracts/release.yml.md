# GitHub Actions Workflow Contract: CI/CD Pipeline

**Purpose**: Define the automated pipeline for testing, linting, versioning, and publishing the `memo-mcp` server.

## Trigger Conditions

- **Push** to the `main` branch.
- **Pull Request** to the `main` branch (lint and test only).

## Job Definitions

### 1. `lint-and-test`

- Runs on `ubuntu-latest`.
- **Steps**:
  - Checkout repository.
  - Setup Node.js (v22).
  - Install dependencies (`npm ci`).
  - Run **ESLint** (`npm run lint`).
  - Run **Hadolint** for `Dockerfile`.
  - Run **Tests** with `testcontainers` (`npm test`).

### 2. `release` (Only on `main`)

- Runs on `ubuntu-latest`.
- **Dependencies**: `lint-and-test` must pass.
- **Steps**:
  - Checkout repository.
  - Setup Node.js (v22).
  - Install dependencies (`npm ci`).
  - Setup Docker **Buildx** for multi-platform builds.
  - Login to **GitHub Container Registry (GHCR)**.
  - Execute **Semantic Release** (`cycjimmy/semantic-release-action`).
  - Determine next version from Conventional Commits.
  - Build and Push multi-platform images (`linux/amd64`, `linux/arm64`).
  - Tag with semantic version and `latest`.

## Environment Variables

- `GITHUB_TOKEN`: Built-in token for registry login and release creation.
- `NODE_AUTH_TOKEN`: (Optional) for private packages.
