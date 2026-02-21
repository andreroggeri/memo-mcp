#!/bin/bash
set -e

# Base URL for Memos proto files
BASE_URL_MEMOS="https://raw.githubusercontent.com/usememos/memos/main/proto"
BASE_URL_GOOGLE="https://raw.githubusercontent.com/googleapis/googleapis/master"

# Target directories
rm -rf proto/api/v1 proto/google/api
mkdir -p proto/api/v1
mkdir -p proto/google/api
mkdir -p proto/google/protobuf  # Needed for imports like google/protobuf/empty.proto, even if files are provided by tooling

# Memos files to fetch
MEMOS_FILES=(
  "api/v1/memo_service.proto"
  "api/v1/common.proto"
  "api/v1/user_service.proto"
  "api/v1/attachment_service.proto"
  "api/v1/resource_service.proto"
  "api/v1/workspace_service.proto"
  "api/v1/workspace_setting_service.proto"
  "api/v1/activity_service.proto"
  "api/v1/auth_service.proto"
  "api/v1/webhook_service.proto"
  "api/v1/inbox_service.proto"
  "api/v1/markdown_service.proto"
)

# Google API files to fetch
GOOGLE_FILES=(
  "google/api/annotations.proto"
  "google/api/http.proto"
  "google/api/client.proto"
  "google/api/field_behavior.proto"
  "google/api/resource.proto"
  "google/api/launch_stage.proto"
)

# Core Protobuf files to fetch
CORE_FILES=(
  "google/protobuf/empty.proto"
  "google/protobuf/timestamp.proto"
  "google/protobuf/field_mask.proto"
)

# Fetch Memos files
for FILE in "${MEMOS_FILES[@]}"; do
  echo "Fetching $FILE from Memos..."
  curl -sSL "$BASE_URL_MEMOS/$FILE" -o "proto/$FILE"
done

# Fetch Google files
for FILE in "${GOOGLE_FILES[@]}"; do
  echo "Fetching $FILE from Google..."
  curl -sSL "$BASE_URL_GOOGLE/$FILE" -o "proto/$FILE"
done

# Fetch Core Protobuf files from the same source (googleapis has them too)
for FILE in "${CORE_FILES[@]}"; do
  echo "Fetching $FILE from Googleapis..."
  curl -sSL "$BASE_URL_GOOGLE/$FILE" -o "proto/$FILE"
done

# Clean up 404s
find proto -name "*.proto" -size -100c -exec grep -l "404: Not Found" {} + | xargs rm -v 2>/dev/null || true

echo "Protos update complete."
