#!/bin/bash

# Create4Me Production Deployment Script
# Deploys backend to Railway and frontend to Vercel with CORS fix

set -e

echo "🚀 Create4Me Production Deployment"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "backend/react-frontend" ]; then
    echo -e "${RED}❌ Error: Must run from create4me root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-Deployment Checklist${NC}"
echo ""

# 1. Check for uncommitted changes
echo -e "${YELLOW}1️⃣  Checking for uncommitted changes...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status -s
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi

# 2. Verify CORS configuration
echo ""
echo -e "${YELLOW}2️⃣  Verifying CORS configuration...${NC}"
if grep -q "create4mee.vercel.app" backend/src/server.ts; then
    echo -e "${GREEN}✅ Production URL found in CORS config${NC}"
else
    echo -e "${RED}❌ Production URL NOT found in CORS config!${NC}"
    echo "Please add 'https://create4mee.vercel.app' to allowed origins"
    exit 1
fi

# 3. Check backend environment file
echo ""
echo -e "${YELLOW}3️⃣  Checking backend environment...${NC}"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Backend .env exists${NC}"
    if grep -q "FRONTEND_URL" backend/.env; then
        echo -e "${GREEN}✅ FRONTEND_URL configured${NC}"
    else
        echo -e "${YELLOW}⚠️  FRONTEND_URL not found in .env${NC}"
    fi
else
    echo -e "${RED}❌ Backend .env missing!${NC}"
    exit 1
fi

# 4. Check frontend production environment
echo ""
echo -e "${YELLOW}4️⃣  Checking frontend production environment...${NC}"
if [ -f "backend/react-frontend/.env.production" ]; then
    echo -e "${GREEN}✅ Frontend .env.production exists${NC}"
    if grep -q "VITE_API_URL" backend/react-frontend/.env.production; then
        API_URL=$(grep VITE_API_URL backend/react-frontend/.env.production | cut -d '=' -f2)
        echo -e "${GREEN}✅ VITE_API_URL configured: $API_URL${NC}"
    else
        echo -e "${RED}❌ VITE_API_URL not found!${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Frontend .env.production missing!${NC}"
    exit 1
fi

# 5. Test backend build
echo ""
echo -e "${YELLOW}5️⃣  Testing backend build...${NC}"
cd backend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed!${NC}"
    exit 1
fi
cd ..

echo ""
echo "===================================="
echo -e "${GREEN}✅ All pre-deployment checks passed!${NC}"
echo "===================================="
echo ""

# Deployment options
echo -e "${BLUE}🚀 Ready to Deploy${NC}"
echo ""
echo "Choose deployment option:"
echo "  1) Deploy Backend only (Railway)"
echo "  2) Deploy Frontend only (Vercel)"
echo "  3) Deploy Both (Backend first, then Frontend)"
echo "  4) Exit"
echo ""
read -p "Enter choice [1-4]: " -n 1 -r choice
echo ""
echo ""

case $choice in
    1)
        echo -e "${BLUE}📦 Deploying Backend to Railway...${NC}"
        echo ""

        # Commit changes
        echo "Committing backend changes..."
        git add backend/src/server.ts backend/.env backend/railway.json backend/nixpacks.toml
        git commit -m "fix: Add production Vercel frontend to CORS allowed origins" || echo "Nothing to commit"

        # Push to trigger Railway deployment
        echo "Pushing to GitHub..."
        git push origin main

        echo ""
        echo -e "${GREEN}✅ Backend deployment triggered!${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. Monitor Railway Dashboard for build status"
        echo "  2. Set environment variables in Railway:"
        echo "     - NODE_ENV=production"
        echo "     - PORT=3001"
        echo "     - MONGODB_URI=mongodb+srv://..."
        echo "     - JWT_SECRET=your-secret"
        echo "     - FRONTEND_URL=https://create4mee.vercel.app"
        echo "  3. Test endpoint: curl https://create4me-production.up.railway.app/api/health"
        ;;

    2)
        echo -e "${BLUE}📦 Deploying Frontend to Vercel...${NC}"
        echo ""

        cd backend/react-frontend

        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
            npm install -g vercel
        fi

        echo "Deploying to Vercel..."
        vercel --prod

        cd ../..

        echo ""
        echo -e "${GREEN}✅ Frontend deployment complete!${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. Verify deployment at: https://create4mee.vercel.app"
        echo "  2. Check browser console for errors"
        echo "  3. Test authentication flow"
        ;;

    3)
        echo -e "${BLUE}📦 Deploying Backend and Frontend...${NC}"
        echo ""

        # Deploy Backend
        echo -e "${YELLOW}Step 1/2: Deploying Backend to Railway...${NC}"
        git add backend/src/server.ts backend/.env backend/railway.json backend/nixpacks.toml
        git commit -m "fix: Add production Vercel frontend to CORS allowed origins" || echo "Nothing to commit"
        git push origin main

        echo ""
        echo -e "${GREEN}✅ Backend deployment triggered!${NC}"
        echo ""
        echo -e "${YELLOW}⏳ Waiting 60 seconds for Railway deployment...${NC}"
        sleep 60

        # Deploy Frontend
        echo ""
        echo -e "${YELLOW}Step 2/2: Deploying Frontend to Vercel...${NC}"
        cd backend/react-frontend

        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
            npm install -g vercel
        fi

        vercel --prod
        cd ../..

        echo ""
        echo -e "${GREEN}🎉 Full deployment complete!${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. Test backend: curl https://create4me-production.up.railway.app/api/health"
        echo "  2. Test frontend: https://create4mee.vercel.app"
        echo "  3. Test full auth flow: Register → Login → Dashboard"
        ;;

    4)
        echo "Deployment cancelled."
        exit 0
        ;;

    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "===================================="
echo -e "${GREEN}🎊 Deployment Process Complete!${NC}"
echo "===================================="
echo ""
echo -e "${BLUE}📊 Verify Deployment:${NC}"
echo ""
echo "Backend Health Check:"
echo "  curl https://create4me-production.up.railway.app/api/health"
echo ""
echo "Frontend:"
echo "  Open: https://create4mee.vercel.app"
echo "  Check browser console for CORS errors (should be none!)"
echo ""
echo "Test Full Flow:"
echo "  1. Register a new user"
echo "  2. Login with credentials"
echo "  3. Access dashboard"
echo "  4. Create a campaign (Brand) or apply (Creator)"
echo ""
echo -e "${BLUE}📝 Important Reminders:${NC}"
echo "  • Set FRONTEND_URL in Railway environment variables"
echo "  • Set VITE_API_URL in Vercel environment variables"
echo "  • Monitor logs in both Railway and Vercel dashboards"
echo "  • Check MongoDB Atlas whitelist includes Railway IPs"
echo ""
echo "Documentation:"
echo "  • See PRODUCTION_DEPLOYMENT_FIX.md for detailed guide"
echo "  • See RAILWAY_PRISMA_FIX_SUMMARY.md for Prisma removal"
echo ""
echo -e "${GREEN}Happy Deploying! 🚀${NC}"
