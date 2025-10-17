#!/bin/bash

# CRITICAL: Vercel Deployment Fix
# Deploy frontend from correct directory with Vite installed

set -e

echo "🚨 CRITICAL: Vercel Deployment Fix"
echo "====================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right place
if [ ! -d "backend/react-frontend" ]; then
    echo -e "${RED}❌ Error: backend/react-frontend directory not found${NC}"
    echo "Please run this script from the create4me root directory"
    exit 1
fi

echo -e "${BLUE}📋 Step 1: Verifying Frontend Configuration${NC}"
echo ""

cd backend/react-frontend

# Check package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found!${NC}"
    exit 1
fi

# Check if vite is in dependencies
if grep -A 30 '"dependencies"' package.json | grep -q '"vite"'; then
    VITE_VERSION=$(grep '"vite"' package.json | cut -d '"' -f4)
    echo -e "${GREEN}✅ Vite found in dependencies: $VITE_VERSION${NC}"
else
    echo -e "${RED}❌ Vite NOT in dependencies!${NC}"
    echo "Run the build fix script first"
    exit 1
fi

# Check vite.config.ts exists
if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}✅ vite.config.ts exists${NC}"
else
    echo -e "${RED}❌ vite.config.ts missing!${NC}"
    exit 1
fi

# Check index.html exists
if [ -f "index.html" ]; then
    echo -e "${GREEN}✅ index.html exists${NC}"
else
    echo -e "${RED}❌ index.html missing!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🧹 Step 2: Cleaning Previous Build${NC}"
echo ""

if [ -d "node_modules" ]; then
    echo "Removing node_modules..."
    rm -rf node_modules
fi

if [ -d "dist" ]; then
    echo "Removing dist..."
    rm -rf dist
fi

if [ -f "package-lock.json" ]; then
    echo "Removing package-lock.json..."
    rm -f package-lock.json
fi

echo -e "${GREEN}✅ Cleaned${NC}"

echo ""
echo -e "${BLUE}📦 Step 3: Installing Dependencies${NC}"
echo ""

if npm install; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm install failed!${NC}"
    exit 1
fi

# Verify vite binary exists
if [ -f "node_modules/.bin/vite" ]; then
    echo -e "${GREEN}✅ Vite binary installed${NC}"
else
    echo -e "${RED}❌ Vite binary not found!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🏗️  Step 4: Testing Build${NC}"
echo ""

if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Verify dist folder
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    echo -e "${GREEN}✅ Build output verified: $DIST_SIZE${NC}"
else
    echo -e "${RED}❌ Build output missing!${NC}"
    exit 1
fi

echo ""
echo "====================================="
echo -e "${GREEN}✅ All Checks Passed!${NC}"
echo "====================================="
echo ""
echo -e "${BLUE}📊 Build Statistics:${NC}"
echo "   Location: backend/react-frontend/dist/"
echo "   Size: $DIST_SIZE"
echo "   Files: $(find dist -type f | wc -l)"
echo ""

echo -e "${YELLOW}🚀 Ready to Deploy!${NC}"
echo ""
echo "Choose deployment method:"
echo ""
echo "1. Vercel Dashboard (Recommended for GitHub Auto-Deploy)"
echo "   - Go to: https://vercel.com/dashboard"
echo "   - Select your project"
echo "   - Settings → Build & Development Settings"
echo "   - Set Root Directory: backend/react-frontend"
echo "   - Framework Preset: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "   - Save and Redeploy"
echo ""
echo "2. Vercel CLI (Deploy Now)"
read -p "   Deploy with Vercel CLI now? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Check if vercel is installed
    if ! command -v vercel &> /dev/null; then
        echo ""
        echo -e "${YELLOW}Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi

    echo ""
    echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
    echo ""

    # Deploy
    vercel --prod

    echo ""
    echo -e "${GREEN}✅ Deployment initiated!${NC}"
else
    echo ""
    echo "Deployment skipped. Run manually when ready:"
    echo ""
    echo "   cd backend/react-frontend"
    echo "   vercel --prod"
fi

echo ""
echo "====================================="
echo -e "${GREEN}🎉 Deployment Script Complete!${NC}"
echo "====================================="
echo ""
echo -e "${BLUE}📝 Important:${NC}"
echo ""
echo "Environment Variables (Set in Vercel Dashboard):"
echo "   VITE_API_URL=https://create4me-production.up.railway.app/api"
echo "   VITE_APP_NAME=Create4Me"
echo "   VITE_APP_ENV=production"
echo ""
echo "After Deployment:"
echo "   1. Open https://create4mee.vercel.app"
echo "   2. Check browser console (F12) for errors"
echo "   3. Test login/registration"
echo "   4. Verify API calls work"
echo ""
echo -e "${GREEN}Good luck! 🚀${NC}"
echo ""
