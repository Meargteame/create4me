#!/bin/bash

# Vercel Configuration Verification Script
# Verifies that all files and configuration are correct for deployment

set -e

echo "🔍 Vercel Configuration Verification"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: backend directory not found${NC}"
    echo "Please run this script from the create4me root directory"
    exit 1
fi

echo -e "${BLUE}📋 Step 1: Verifying Project Structure${NC}"
echo ""

# Check frontend directory
if [ -d "backend/react-frontend" ]; then
    echo -e "${GREEN}✅ backend/react-frontend/ exists${NC}"
else
    echo -e "${RED}❌ backend/react-frontend/ NOT FOUND!${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check essential frontend files
if [ -f "backend/react-frontend/package.json" ]; then
    echo -e "${GREEN}✅ backend/react-frontend/package.json exists${NC}"
else
    echo -e "${RED}❌ backend/react-frontend/package.json NOT FOUND!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "backend/react-frontend/vite.config.ts" ]; then
    echo -e "${GREEN}✅ backend/react-frontend/vite.config.ts exists${NC}"
else
    echo -e "${RED}❌ backend/react-frontend/vite.config.ts NOT FOUND!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "backend/react-frontend/index.html" ]; then
    echo -e "${GREEN}✅ backend/react-frontend/index.html exists${NC}"
else
    echo -e "${RED}❌ backend/react-frontend/index.html NOT FOUND!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -d "backend/react-frontend/src" ]; then
    echo -e "${GREEN}✅ backend/react-frontend/src/ exists${NC}"
else
    echo -e "${RED}❌ backend/react-frontend/src/ NOT FOUND!${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo -e "${BLUE}📦 Step 2: Verifying Dependencies${NC}"
echo ""

# Check if Vite is in dependencies
if grep -A 30 '"dependencies"' backend/react-frontend/package.json | grep -q '"vite"'; then
    VITE_VERSION=$(grep '"vite"' backend/react-frontend/package.json | grep -o '[0-9.^~]*' | head -1)
    echo -e "${GREEN}✅ Vite found in dependencies: $VITE_VERSION${NC}"
else
    echo -e "${RED}❌ Vite NOT in dependencies!${NC}"
    echo "   Vite must be in 'dependencies', not 'devDependencies'"
    ERRORS=$((ERRORS + 1))
fi

# Check if TypeScript is in dependencies
if grep -A 30 '"dependencies"' backend/react-frontend/package.json | grep -q '"typescript"'; then
    echo -e "${GREEN}✅ TypeScript found in dependencies${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript not in dependencies${NC}"
    echo "   Consider moving it from devDependencies for build reliability"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}🔧 Step 3: Verifying Root Configuration${NC}"
echo ""

# Check root package.json
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ Root package.json exists${NC}"

    if grep -q '"build"' package.json; then
        echo -e "${GREEN}✅ Root package.json has build script${NC}"
    else
        echo -e "${RED}❌ Root package.json missing build script!${NC}"
        ERRORS=$((ERRORS + 1))
    fi

    if grep -q '"install"' package.json; then
        echo -e "${GREEN}✅ Root package.json has install script${NC}"
    else
        echo -e "${YELLOW}⚠️  Root package.json missing install script${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}❌ Root package.json NOT FOUND!${NC}"
    echo "   Create root package.json with build scripts"
    ERRORS=$((ERRORS + 1))
fi

# Check root vercel.json
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ Root vercel.json exists${NC}"

    if grep -q '"buildCommand"' vercel.json; then
        BUILD_CMD=$(grep '"buildCommand"' vercel.json | cut -d '"' -f4)
        echo -e "${GREEN}✅ Build command: $BUILD_CMD${NC}"
    else
        echo -e "${YELLOW}⚠️  No buildCommand in vercel.json${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi

    if grep -q '"outputDirectory"' vercel.json; then
        OUTPUT_DIR=$(grep '"outputDirectory"' vercel.json | cut -d '"' -f4)
        echo -e "${GREEN}✅ Output directory: $OUTPUT_DIR${NC}"

        # Verify output directory path makes sense
        if [[ "$OUTPUT_DIR" == *"backend/react-frontend/dist"* ]]; then
            echo -e "${GREEN}✅ Output directory points to correct location${NC}"
        else
            echo -e "${YELLOW}⚠️  Output directory might be incorrect${NC}"
            echo "   Expected: backend/react-frontend/dist"
            echo "   Found: $OUTPUT_DIR"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${YELLOW}⚠️  No outputDirectory in vercel.json${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi

    if grep -q '"framework".*vite' vercel.json; then
        echo -e "${GREEN}✅ Framework set to vite${NC}"
    else
        echo -e "${YELLOW}⚠️  Framework not set to vite${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Root vercel.json not found${NC}"
    echo "   You can create it or set Root Directory in Vercel Dashboard"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}🌍 Step 4: Verifying Environment Configuration${NC}"
echo ""

# Check .env.production
if [ -f "backend/react-frontend/.env.production" ]; then
    echo -e "${GREEN}✅ .env.production exists${NC}"

    if grep -q 'VITE_API_URL' backend/react-frontend/.env.production; then
        API_URL=$(grep 'VITE_API_URL' backend/react-frontend/.env.production | cut -d '=' -f2)
        echo -e "${GREEN}✅ VITE_API_URL configured: $API_URL${NC}"
    else
        echo -e "${YELLOW}⚠️  VITE_API_URL not found in .env.production${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  .env.production not found${NC}"
    echo "   Remember to set environment variables in Vercel Dashboard"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}🧪 Step 5: Testing Build Scripts${NC}"
echo ""

# Test if npm scripts work
if [ -f "package.json" ]; then
    if grep -q '"build"' package.json; then
        echo "Testing root build script..."
        if npm run build --dry-run 2>/dev/null; then
            echo -e "${GREEN}✅ Root build script syntax valid${NC}"
        else
            echo -e "${YELLOW}⚠️  Cannot verify build script${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
fi

echo ""
echo "======================================"
echo -e "${BLUE}📊 Verification Summary${NC}"
echo "======================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! All checks passed!${NC}"
    echo ""
    echo "Your Vercel configuration is ready for deployment."
    echo ""
    echo "Next steps:"
    echo "  1. Commit changes: git add . && git commit -m 'fix: Vercel configuration'"
    echo "  2. Push to GitHub: git push origin main"
    echo "  3. Deploy: vercel --prod"
    echo ""
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Configuration looks good with $WARNINGS warnings${NC}"
    echo ""
    echo "You can proceed with deployment, but review the warnings above."
    echo ""
    echo "Next steps:"
    echo "  1. (Optional) Fix warnings"
    echo "  2. Commit changes: git add . && git commit -m 'fix: Vercel configuration'"
    echo "  3. Push to GitHub: git push origin main"
    echo "  4. Deploy: vercel --prod"
    echo ""
else
    echo -e "${RED}❌ Configuration has $ERRORS errors and $WARNINGS warnings${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
    echo ""
    echo "Critical issues to fix:"
    [ $ERRORS -gt 0 ] && echo "  • $ERRORS configuration errors found"
    echo ""
    exit 1
fi

echo "======================================"
echo -e "${BLUE}📝 Deployment Options:${NC}"
echo ""
echo "Option 1: Vercel Dashboard (Recommended)"
echo "  • Go to: https://vercel.com/dashboard"
echo "  • Settings → Build & Development Settings"
echo "  • Root Directory: backend/react-frontend"
echo "  • Framework: Vite"
echo ""
echo "Option 2: Use Root Configuration"
echo "  • Commit package.json and vercel.json"
echo "  • Push to GitHub"
echo "  • Vercel auto-deploys"
echo ""
echo "Option 3: Deploy from Subdirectory"
echo "  • cd backend/react-frontend"
echo "  • vercel --prod"
echo ""
echo "======================================"

exit 0
