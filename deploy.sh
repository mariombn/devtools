#!/bin/bash

echo "🚀 Starting DevTools deployment..."

# Build the Docker image
echo "📦 Building Docker image..."
docker-compose build

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start the containers
echo "▶️  Starting containers..."
docker-compose up -d

# Show logs
echo "📋 Container logs:"
docker-compose logs -f
