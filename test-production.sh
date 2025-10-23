#!/bin/bash

# Create4Me Production Test Script
# Tests both frontend and backend deployments

echo "🚀 Create4Me Production Test"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="https://create4me-production.up.railway.app"
FRONTEND_URL="https://create4mee.vercel.app"

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>&1)
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response)"
        ((FAILED++))
    fi
}

# Function to test JSON endpoint
test_json_endpoint() {
    local name=$1
    local url=$2
    local expected_field=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url" 2>&1)
    
    if echo "$response" | grep -q "$expected_field"; then
        echo -e "${GREEN}✓ PASS${NC}"
        echo "  Response: $response"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "  Response: $response"
        ((FAILED++))
    fi
}

echo "📡 Backend Tests (Railway)"
echo "-------------------------"
test_json_endpoint "Health Check" "$BACKEND_URL/api/health" "status"
test_json_endpoint "Auth Signup (no data)" "$BACKEND_URL/api/auth/signup" "Email and password are required"
test_json_endpoint "Auth Login (no data)" "$BACKEND_URL/api/auth/login" "Email and password are required"
test_json_endpoint "Public Campaigns" "$BACKEND_URL/api/campaigns/all" "No token provided"
test_endpoint "Creators Endpoint" "$BACKEND_URL/api/creators" "200"

echo ""
echo "🌐 Frontend Tests (Vercel)"
echo "-------------------------"
test_endpoint "Homepage" "$FRONTEND_URL" "200"
test_endpoint "Login Page" "$FRONTEND_URL/login" "200"
test_endpoint "Signup Page" "$FRONTEND_URL/signup" "200"

echo ""
echo "🔍 CORS Test"
echo "-------------------------"
echo -n "Testing CORS headers... "
cors_response=$(curl -s -I -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: POST" -X OPTIONS "$BACKEND_URL/api/auth/login" 2>&1)

if echo "$cors_response" | grep -q "access-control-allow-origin"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "  CORS is properly configured for $FRONTEND_URL"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "  CORS headers not found"
    echo "  Response: $cors_response"
    ((FAILED++))
fi

echo ""
echo "📊 Test Summary"
echo "-------------------------"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Ready for launch!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please review before launch.${NC}"
    exit 1
fi
