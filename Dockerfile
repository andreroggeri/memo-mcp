# Stage 1: Build
FROM node:22-alpine AS build

# Install protoc
RUN apk add --no-cache protobuf

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
# Skip husky and other scripts during build
RUN npm ci --ignore-scripts

# Copy source code and build the application
COPY . .
RUN npm run gen:api
RUN npm run build

# Stage 2: Production Dependencies
FROM node:22-alpine AS prod-deps

WORKDIR /app
COPY package*.json ./
# Only install production dependencies, skip scripts
RUN npm ci --omit=dev --ignore-scripts

# Stage 3: Runtime
FROM node:22-alpine AS runtime

# Ensure the application directory is owned by the non-privileged user
RUN mkdir -p /app && chown node:node /app
WORKDIR /app

# Set non-privileged user for security
USER node

# Copy only the necessary assets from previous stages
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./

# Configuration - must be provided at runtime
ENV MEMO_SERVER_URL=""
ENV MCP_TRANSPORT="stdio"
ENV PORT="3000"

# Expose port for HTTP transport (ignored for stdio)
EXPOSE 3000

# The MCP server communicates over stdio or HTTP
ENTRYPOINT ["node", "dist/index.js"]
