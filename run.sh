#!/bin/bash
set -e

# Start MongoDB in background
mkdir -p /tmp/mongodb-data
mongod --dbpath /tmp/mongodb-data --logpath /tmp/mongodb.log --bind_ip 127.0.0.1 &
MONGOD_PID=$!

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
for i in $(seq 1 20); do
  if mongod --dbpath /tmp/mongodb-data --logpath /tmp/mongodb.log 2>&1 | grep -q "already in use" 2>/dev/null || \
     nc -z 127.0.0.1 27017 2>/dev/null; then
    break
  fi
  sleep 0.5
done
sleep 2

# Start Node.js backend
echo "Starting backend..."
node server/index.js &
NODE_PID=$!

# Wait for Node.js to be ready
sleep 3

# Start Vite frontend on port 5000
echo "Starting frontend..."
cd client && npm run dev

# If frontend exits, kill backend and mongodb
kill $NODE_PID $MONGOD_PID 2>/dev/null
