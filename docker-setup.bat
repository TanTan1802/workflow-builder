@echo off
REM Docker Setup Script for Windows

echo 🐳 Setting up Docker for Workflow Builder...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker is not running. Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    echo ⏳ Waiting for Docker to start...
    :wait_loop
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        timeout /t 2 /nobreak >nul
        goto wait_loop
    )
)

echo ✅ Docker is running!

REM Build the application first
echo 🔨 Building Angular application...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Application built successfully!
    
    REM Build Docker image
    echo 🐳 Building Docker image...
    docker build -t workflow-builder:latest .
    
    if %errorlevel% equ 0 (
        echo ✅ Docker image built successfully!
        echo.
        echo 🚀 You can now run:
        echo    docker run -p 8080:80 workflow-builder:latest
        echo    Then visit: http://localhost:8080
    ) else (
        echo ❌ Failed to build Docker image
        pause
        exit /b 1
    )
) else (
    echo ❌ Failed to build Angular application
    pause
    exit /b 1
)

pause
