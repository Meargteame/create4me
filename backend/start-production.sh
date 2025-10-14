#!/bin/bash

# Production Start Script for Create4Me Backend

echo "🚀 Starting Create4Me Backend in Production Mode"
echo "================================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please copy .env.example to .env and configure it"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ ! -d dist ]; then
    echo "❌ Build failed! dist directory not found"
    exit 1
fi

echo "✅ Build successful!"
echo "🌐 Starting server..."
echo ""

# Start the server
NODE_ENV=production npm start
