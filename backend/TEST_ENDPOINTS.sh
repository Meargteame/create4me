#!/bin/bash

# Test script for backend endpoints

echo "🧪 Testing Backend Endpoints"
echo "=============================="
echo ""

BASE_URL="${1:-http://localhost:3001}"

echo "Testing: $BASE_URL"
echo ""

# Test root endpoint
echo "1. Testing root endpoint (/)..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo "   ✅ Root endpoint working"
    echo "   Response: $body"
else
    echo "   ❌ Root endpoint failed (HTTP $http_code)"
fi
echo ""

# Test /health endpoint
echo "2. Testing /health endpoint..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo "   ✅ /health endpoint working"
    echo "   Response: $body"
else
    echo "   ❌ /health endpoint failed (HTTP $http_code)"
fi
echo ""

# Test /api/health endpoint
echo "3. Testing /api/health endpoint..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo "   ✅ /api/health endpoint working"
    echo "   Response: $body"
else
    echo "   ❌ /api/health endpoint failed (HTTP $http_code)"
fi
echo ""

# Test favicon
echo "4. Testing /favicon.ico..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/favicon.ico")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "204" ]; then
    echo "   ✅ Favicon handler working (204 No Content)"
else
    echo "   ❌ Favicon handler failed (HTTP $http_code)"
fi
echo ""

# Test API routes
echo "5. Testing /api/campaigns endpoint..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/campaigns")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "200" ] || [ "$http_code" = "401" ]; then
    echo "   ✅ /api/campaigns endpoint accessible"
else
    echo "   ❌ /api/campaigns endpoint failed (HTTP $http_code)"
fi
echo ""

echo "=============================="
echo "✅ Endpoint testing complete!"
echo ""
echo "Usage: ./TEST_ENDPOINTS.sh [BASE_URL]"
echo "Example: ./TEST_ENDPOINTS.sh https://your-app.railway.app"
