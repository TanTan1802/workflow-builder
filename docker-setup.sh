#!/bin/bash

# Docker Setup Script for Workflow Builder

echo "🐳 Setting up Docker for Workflow Builder..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "Visit: https://docs.docker.com/desktop/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "⚠️  Docker is not running. Starting Docker Desktop..."
    # For Windows
    if [[ "$OSTYPE" == "msys" ]]; then
        start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    # For macOS
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open -a Docker
    # For Linux
    else
        sudo systemctl start docker
    fi
    
    echo "⏳ Waiting for Docker to start..."
    while ! docker info &> /dev/null; do
        sleep 2
    done
fi

echo "✅ Docker is running!"

# Build the application first
echo "🔨 Building Angular application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Application built successfully!"
    
    # Build Docker image
    echo "🐳 Building Docker image..."
    docker build -t workflow-builder:latest .
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker image built successfully!"
        echo ""
        echo "🚀 You can now run:"
        echo "   docker run -p 8080:80 workflow-builder:latest"
        echo "   Then visit: http://localhost:8080"
    else
        echo "❌ Failed to build Docker image"
        exit 1
    fi
else
    echo "❌ Failed to build Angular application"
    exit 1
fi
