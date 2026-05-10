#!/bin/bash
mkdir -p /tmp/mongodb-data

# Start mongod only if not already running
if ! pgrep -x mongod > /dev/null; then
  mongod --dbpath /tmp/mongodb-data --logpath /tmp/mongodb.log --fork
  sleep 2
fi

exec node server/index.js
