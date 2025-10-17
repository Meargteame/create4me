#!/bin/bash

# Test Build Script for Vercel Deployment
# Verifies that Vite build works locally before deploying

set -e

echo "🧪 Create4Me Frontend - Build Verification"
echo "==========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the react-frontend directory"
    exit 1
fi

# Check if vite.config.ts exists
if [ ! -f "vite.config.ts" ]; then
    echo -e "${RED}❌ Error: vite.config.ts not found${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Step 1: Checking Dependencies${NC}"
echo ""

# Check if vite is in dependencies
if grep -q '"vite"' package.json; then
    if grep -A 20 '"dependencies"' package.json | grep -q '"vite"'; then
        echo -e "${GREEN}✅ Vite found in dependencies${NC}"
    else
        echo -e "${RED}❌ Vite is in devDependencies, should be in dependencies!${NC}"
        echo -e "${YELLOW}Fix: Move vite from devDependencies to dependencies${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Vite not found in package.json!${NC}"
    exit 1
fi

# Check if typescript is in dependencies
if grep -A 20 '"dependencies"' package.json | grep -q '"typescript"'; then
    echo -e "${GREEN}✅ TypeScript found in dependencies${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript not in dependencies${NC}"
fi

echo ""
echo -e "${BLUE}📦 Step 2: Installing Dependencies${NC}"
echo ""

# Clean install
if [ -d "node_modules" ]; then
    echo "Removing existing node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "Removing package-lock.json..."
    rm -f package-lock.json
fi

echo "Running npm install..."
if npm install > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ npm install failed!${NC}"
    exit 1
fi

# Verify vite is executable
echo ""
echo -e "${BLUE}🔍 Step 3: Verifying Vite Installation${NC}"
echo ""

if [ -f "node_modules/.bin/vite" ]; then
    echo -e "${GREEN}✅ Vite binary found${NC}"
    VITE_VERSION=$(npx vite --version 2>&1 | head -1)
    echo "   Version: $VITE_VERSION"
else
    echo -e "${RED}❌ Vite binary not found in node_modules/.bin/${NC}"
    exit 1
fi

# Clean previous build
echo ""
echo -e "${BLUE}🧹 Step 4: Cleaning Previous Build${NC}"
echo ""

if [ -d "dist" ]; then
    echo "Removing existing dist/ folder..."
    rm -rf dist
    echo -e "${GREEN}✅ Cleaned${NC}"
else
    echo -e "${GREEN}✅ No previous build found${NC}"
fi

# Run build
echo ""
echo -e "${BLUE}🏗️  Step 5: Running Build${NC}"
echo ""
echo "Executing: npm run build"
echo "-------------------------------------------"

if npm run build; then
    echo "-------------------------------------------"
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
else
    echo "-------------------------------------------"
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Verify build output
echo ""
echo -e "${BLUE}🔍 Step 6: Verifying Build Output${NC}"
echo ""

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ dist/ folder not created!${NC}"
    exit 1
fi

# Check for index.html
if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✅ dist/index.html exists${NC}"
else
    echo -e "${RED}❌ dist/index.html not found!${NC}"
    exit 1
fi

# Check for assets folder
if [ -d "dist/assets" ]; then
    echo -e "${GREEN}✅ dist/assets/ folder exists${NC}"

    # Count JS files
    JS_COUNT=$(find dist/assets -name "*.js" | wc -l)
    echo "   JavaScript files: $JS_COUNT"

    # Count CSS files
    CSS_COUNT=$(find dist/assets -name "*.css" | wc -l)
    echo "   CSS files: $CSS_COUNT"

    if [ $JS_COUNT -eq 0 ]; then
        echo -e "${RED}❌ No JavaScript files found in dist/assets!${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ dist/assets/ folder not found!${NC}"
    exit 1
fi

# Check build size
echo ""
echo -e "${BLUE}📊 Step 7: Build Statistics${NC}"
echo ""

DIST_SIZE=$(du -sh dist | cut -f1)
echo "Total build size: $DIST_SIZE"

# List largest files
echo ""
echo "Largest files:"
find dist -type f -exec du -h {} \; | sort -rh | head -5

# Check for environment variables
echo ""
echo -e "${BLUE}🔧 Step 8: Environment Check${NC}"
echo ""

if [ -f ".env.production" ]; then
    echo -e "${GREEN}✅ .env.production exists${NC}"
    if grep -q "VITE_API_URL" .env.production; then
        API_URL=$(grep VITE_API_URL .env.production | cut -d '=' -f2)
        echo "   API URL: $API_URL"
    else
        echo -e "${YELLOW}⚠️  VITE_API_URL not found in .env.production${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.production not found${NC}"
fi

# Final summary
echo ""
echo "==========================================="
echo -e "${GREEN}🎉 Build Verification Complete!${NC}"
echo "==========================================="
echo ""
echo "Summary:"
echo "  ✅ Dependencies installed"
echo "  ✅ Vite available"
echo "  ✅ Build successful"
echo "  ✅ Build artifacts created"
echo "  ✅ Build size: $DIST_SIZE"
echo ""
echo "Next steps:"
echo "  1. Test locally: npm run preview"
echo "  2. Commit changes: git add package.json vercel.json"
echo "  3. Deploy to Vercel: vercel --prod"
echo ""
echo -e "${BLUE}Ready to deploy to Vercel! 🚀${NC}"
echo ""
