# Makefile for Workflow Builder Docker operations

.PHONY: help build build-dev run run-dev up up-dev down clean test push

# Default target
help:
	@echo "Available commands:"
	@echo "  build      - Build production Docker image"
	@echo "  build-dev  - Build development Docker image"
	@echo "  run        - Run production container on port 8080"
	@echo "  run-dev    - Run development container on port 4200"
	@echo "  up         - Start with docker-compose (production)"
	@echo "  up-dev     - Start with docker-compose (development)"
	@echo "  down       - Stop docker-compose services"
	@echo "  clean      - Clean up Docker system"
	@echo "  test       - Run tests in Docker container"
	@echo "  push       - Push image to registry"

# Build production image
build:
	docker build -t workflow-builder:latest .

# Build development image
build-dev:
	docker build -f Dockerfile.dev -t workflow-builder:dev .

# Run production container
run:
	docker run -d -p 8080:80 --name workflow-builder-prod workflow-builder:latest

# Run development container
run-dev:
	docker run -d -p 4200:4200 -v "$$(pwd):/app" -v "/app/node_modules" --name workflow-builder-dev workflow-builder:dev

# Start with docker-compose (production)
up:
	docker-compose up -d

# Start with docker-compose (development)
up-dev:
	docker-compose --profile dev up -d

# Stop docker-compose services
down:
	docker-compose down

# Clean up Docker system
clean:
	docker system prune -f
	docker container prune -f
	docker image prune -f

# Run tests in Docker container
test:
	docker run --rm -v "$$(pwd):/app" -w /app node:20-alpine sh -c "npm ci && npm test -- --browsers=ChromeHeadless --no-watch"

# Push to GitHub Container Registry
push:
	docker tag workflow-builder:latest ghcr.io/tantan1802/workflow-builder:latest
	docker push ghcr.io/tantan1802/workflow-builder:latest

# Development workflow
dev-setup: build-dev up-dev
	@echo "Development environment is ready at http://localhost:4200"

# Production workflow
prod-setup: build up
	@echo "Production environment is ready at http://localhost:8080"
