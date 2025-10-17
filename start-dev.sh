#!/bin/bash

# Create4Me Development Server Startup Script
# This script starts both the backend API server and the frontend React app

set -e

echo "🚀 Starting Create4Me Development Servers..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${BLUE}📊 Checking MongoDB status...${NC}"
if ! pgrep -x mongod > /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB is not running. Attempting to start...${NC}"
    sudo systemctl start mongod || {
        echo -e "${RED}❌ Failed to start MongoDB. Please start it manually:${NC}"
        echo "   sudo systemctl start mongod"
        exit 1
    }
    sleep 2
fi
echo -e "${GREEN}✅ MongoDB is running${NC}"
echo ""

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found. Creating from .env.example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env - please configure it if needed${NC}"
fi

# Check if frontend .env exists
if [ ! -f "backend/react-frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env file not found. Creating...${NC}"
    echo "VITE_API_URL=http://localhost:3001/api" > backend/react-frontend/.env
    echo -e "${GREEN}✅ Created frontend/.env${NC}"
fi

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

if [ ! -d "backend/react-frontend/node_modules" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    cd backend/react-frontend && npm install && cd ../..
fi

# Kill any existing processes on ports 3001 and 5173
echo -e "${BLUE}🧹 Cleaning up existing processes...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 1

# Create logs directory
mkdir -p logs

# Start backend server
echo -e "${BLUE}🔧 Starting Backend API Server (port 3001)...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo -e "${BLUE}⏳ Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# Start frontend server
echo -e "${BLUE}🎨 Starting Frontend React App (port 5173)...${NC}"
cd backend/react-frontend
npm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..
echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
echo ""

# Wait a bit for frontend to start
sleep 3

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Create4Me Development Servers are running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📍 Backend API:${NC}  http://localhost:3001"
echo -e "${BLUE}📍 Frontend App:${NC} http://localhost:5173"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo -e "   Backend:  tail -f logs/backend.log"
echo -e "   Frontend: tail -f logs/frontend.log"
echo ""
echo -e "${YELLOW}💡 Test Data:${NC}"
echo -e "   Email: ethiocoffee@example.com"
echo -e "   Password: password123"
echo ""
echo -e "${YELLOW}⚙️  To stop servers:${NC}"
echo -e "   kill $BACKEND_PID $FRONTEND_PID"
echo -e "   Or run: ./stop-dev.sh"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Save PIDs to file for stop script
echo "$BACKEND_PID" > logs/backend.pid
echo "$FRONTEND_PID" > logs/frontend.pid

# Keep script running and show logs
echo -e "${BLUE}📊 Showing live logs (Ctrl+C to stop)...${NC}"
echo ""
tail -f logs/backend.log logs/frontend.log
