#!/bin/bash
set -e

echo "Running post-merge setup..."

echo "Installing server dependencies..."
cd server && npm install --yes
cd ..

echo "Installing client dependencies..."
cd client && npm install --yes
cd ..

echo "Post-merge setup complete."
