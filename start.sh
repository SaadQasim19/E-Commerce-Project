#!/bin/bash

# 🚀 Quick Start Script for E-Commerce Project
# This script helps you start both backend and frontend servers

echo "=========================================="
echo "🛒 E-Commerce Project - Quick Start"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f "Backend/.env" ]; then
    echo -e "${RED}❌ Error: Backend/.env file not found!${NC}"
    echo -e "${YELLOW}📝 Please follow these steps:${NC}"
    echo "   1. Copy Backend/.env.example to Backend/.env"
    echo "   2. Add your Google OAuth credentials (see GOOGLE_OAUTH_SETUP.md)"
    echo ""
    exit 1
fi

# Check if Google credentials are set
if grep -q "your_google_client_id_here" Backend/.env; then
    echo -e "${YELLOW}⚠️  Warning: Google OAuth credentials not set!${NC}"
    echo -e "${YELLOW}📝 Please update Backend/.env with your Google credentials${NC}"
    echo "   See GOOGLE_OAUTH_SETUP.md for detailed instructions"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
echo ""

# Install backend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Install frontend dependencies
if [ ! -d "Frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd Frontend && npm install && cd ..
fi

echo ""
echo -e "${GREEN}✅ Dependencies installed!${NC}"
echo ""

# Ask which server to start
echo "Which server would you like to start?"
echo "  1) Backend only (http://localhost:5000)"
echo "  2) Frontend only (http://localhost:5173)"
echo "  3) Both servers (recommended)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Starting Backend server...${NC}"
        node Backend/server.js
        ;;
    2)
        echo -e "${BLUE}🚀 Starting Frontend server...${NC}"
        cd Frontend && npm run dev
        ;;
    3)
        echo -e "${BLUE}🚀 Starting both servers...${NC}"
        echo ""
        echo -e "${YELLOW}Opening 2 terminal tabs...${NC}"
        echo -e "${YELLOW}Backend: http://localhost:5000${NC}"
        echo -e "${YELLOW}Frontend: http://localhost:5173${NC}"
        echo ""
        
        # Start backend in background
        node Backend/server.js &
        BACKEND_PID=$!
        
        # Wait a bit for backend to start
        sleep 2
        
        # Start frontend
        cd Frontend && npm run dev
        
        # Cleanup on exit
        trap "kill $BACKEND_PID" EXIT
        ;;
    *)
        echo -e "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac
