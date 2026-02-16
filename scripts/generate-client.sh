#!/bin/bash
set -e

# Directory containing proto files
PROTO_DIR="proto"
# Output directory for generated code
OUT_DIR="src/gen"

# Ensure output directory exists and is clean
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

# Find all proto files
PROTO_FILES=$(find "$PROTO_DIR" -name "*.proto")

# Generate TypeScript code
# Using default outputServices to see if it generates Client classes
protoc \
  --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out="$OUT_DIR" \
  --ts_proto_opt=esModuleInterop=true \
  --ts_proto_opt=useExactTypes=false \
  --ts_proto_opt=unrecognizedEnum=false \
  --ts_proto_opt=env=node \
  --ts_proto_opt=oneof=unions \
  --ts_proto_opt=useOptionals=all \
  --ts_proto_opt=forceLong=string \
  --ts_proto_opt=importSuffix=.js \
  --proto_path="$PROTO_DIR" \
  $PROTO_FILES

echo "Client generated successfully in $OUT_DIR"
