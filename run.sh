#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Create MongoDB data directory
mkdir -p /tmp/mongodb-data

# Start MongoDB in background
mongod --dbpath /tmp/mongodb-data --logpath /tmp/mongodb.log --bind_ip 127.0.0.1 --fork
echo "Waiting for MongoDB to start..."
sleep 3

# Start Express server in background
cd "$ROOT_DIR/server" && node index.js &
echo "Express server started"
cd "$ROOT_DIR"

# Wait for server to be ready
sleep 2

# Start Vite frontend (foreground)
cd "$ROOT_DIR/client" && npm run dev
