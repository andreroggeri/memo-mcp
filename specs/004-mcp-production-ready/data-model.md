# Data Model: MCP Production-Ready Assets

## Entities

### Docker Image Structure

- **Base Layer**: `node:22-alpine` (Minimal, secure, LTS).
- **Build Layer**: Installs dev dependencies, runs `npm run build`.
- **Runtime Layer**:
  - Only includes production dependencies and compiled JS.
  - Runs as `USER node` (UID 1000).
  - Listens on `stdio` (no exposed ports).
  - Environment Variables: `MEMO_ACCESS_TOKEN`, `MEMO_SERVER_URL`.

### CI/CD Pipeline (GitHub Actions)

- **Workflow Name**: `Production Release`
- **Trigger**: Push to `main` branch.
- **Jobs**:
  - `lint`: Runs `eslint` and `hadolint`.
  - `test`: Runs `npm test` using `testcontainers`.
  - `release`:
    - Executes `semantic-release`.
    - Determines version increment from Conventional Commits.
    - Updates `package.json` (temporarily in CI) and creates Git Tag.
    - Pushes versioned image to GHCR.
    - Updates `latest` tag in GHCR.

### Versioning Logic (Conventional Commits)

- `fix:` -> Patch version (0.0.X).
- `feat:` -> Minor version (0.X.0).
- `BREAKING CHANGE:` -> Major version (X.0.0).
- `chore:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:` -> No version increment (or patch, depending on configuration).

## State Transitions (Deployment)

- **Draft**: Local code changes.
- **Verified**: Tests and linting pass in CI.
- **Released**: `semantic-release` creates a tag and pushes the image.
- **Live**: Image available in GHCR for consumption.
