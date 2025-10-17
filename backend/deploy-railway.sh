#!/bin/bash

# Railway Deployment Script - Prisma-Free Mongoose Backend
# This script prepares and deploys the backend to Railway

set -e

echo "🚀 Create4Me Backend - Railway Deployment"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the backend directory."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git not initialized. Initializing..."
    git init
fi

echo "📋 Pre-deployment Checklist:"
echo ""

# 1. Verify no Prisma references
echo "1️⃣  Checking for Prisma references..."
if grep -r "prisma" railway.json nixpacks.toml package.json 2>/dev/null; then
    echo "❌ Found Prisma references! Please remove them before deploying."
    exit 1
else
    echo "✅ No Prisma references found"
fi

# 2. Verify Mongoose is installed
echo ""
echo "2️⃣  Verifying Mongoose installation..."
if grep -q '"mongoose"' package.json; then
    echo "✅ Mongoose found in dependencies"
else
    echo "❌ Mongoose not found in dependencies!"
    exit 1
fi

# 3. Check build locally
echo ""
echo "3️⃣  Testing build locally..."
echo "   Running: npm run build"
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

# 4. Verify required files
echo ""
echo "4️⃣  Verifying required files..."
REQUIRED_FILES=("railway.json" "nixpacks.toml" "package.json" "tsconfig.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file missing!"
        exit 1
    fi
done

echo ""
echo "=========================================="
echo "✅ All checks passed!"
echo "=========================================="
echo ""

# 5. Show environment variables reminder
echo "📝 IMPORTANT: Ensure these environment variables are set in Railway:"
echo ""
echo "   NODE_ENV=production"
echo "   PORT=3001"
echo "   MONGODB_URI=mongodb+srv://..."
echo "   JWT_SECRET=your-secure-secret"
echo "   FRONTEND_URL=https://your-frontend.vercel.app"
echo ""

# 6. Git status
echo "📦 Git Status:"
git status --short

echo ""
echo "=========================================="
echo "Ready to Deploy!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Commit changes:"
echo "   git add railway.json nixpacks.toml"
echo "   git commit -m 'fix: Remove Prisma from Railway configuration'"
echo ""
echo "2. Push to repository:"
echo "   git push origin main"
echo ""
echo "3. Railway will automatically deploy"
echo ""
echo "4. Monitor deployment:"
echo "   - Watch build logs in Railway dashboard"
echo "   - Verify no Prisma errors"
echo "   - Check MongoDB connection"
echo ""
echo "5. Test endpoints:"
echo "   curl https://your-app.railway.app/api/health"
echo ""
echo "=========================================="
echo "🎉 Deployment script complete!"
echo "=========================================="
