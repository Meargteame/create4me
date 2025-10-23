#!/bin/bash

# Create4Me Production Verification Script
# Comprehensive test of all production endpoints

echo "🚀 Create4Me Production Verification"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_URL="https://create4me-production.up.railway.app"
FRONTEND_URL="https://create4mee.vercel.app"

# Test counters
PASSED=0
FAILED=0
WARNINGS=0

# Test function
test_api() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected=$5
    
    echo -n "  Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s "$BACKEND_URL$endpoint")
    else
        response=$(curl -s -X "$method" "$BACKEND_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "    Expected: $expected"
        echo "    Got: $response"
        ((FAILED++))
        return 1
    fi
}

# Section header
section() {
    echo ""
    echo -e "${BLUE}$1${NC}"
    echo "$(printf '%.0s-' {1..50})"
}

# Main tests
section "📡 Backend Health"
test_api "Health endpoint" "GET" "/api/health" "" "status"
test_api "Server version" "GET" "/api/health" "" "1.0.0"

section "🔐 Authentication Endpoints"
test_api "Signup validation" "POST" "/api/auth/signup" '{}' "Email and password are required"
test_api "Login validation" "POST" "/api/auth/login" '{}' "Email and password are required"
test_api "Signup password length" "POST" "/api/auth/signup" '{"email":"test@test.com","password":"123"}' "Password must be at least 8 characters"

section "👥 Creator Endpoints"
test_api "Get creators (public)" "GET" "/api/creators" "" "success"
test_api "Creators returns data" "GET" "/api/creators" "" "data"

section "📋 Campaign Endpoints"
test_api "Get all campaigns (requires auth)" "GET" "/api/campaigns/all" "" "No token provided"

section "🌐 Frontend Deployment"
echo -n "  Testing homepage... "
status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $status)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $status)"
    ((FAILED++))
fi

echo -n "  Testing login page... "
status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/login")
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $status)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $status)"
    ((FAILED++))
fi

section "🔒 CORS Configuration"
echo -n "  Testing CORS headers... "
cors=$(curl -s -I -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: POST" \
    -X OPTIONS "$BACKEND_URL/api/auth/login" | grep -i "access-control-allow-origin")

if [ ! -z "$cors" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "    $cors"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

section "🗄️ Database Connection"
echo -n "  Testing database via API... "
# If creators endpoint works, database is connected
response=$(curl -s "$BACKEND_URL/api/creators")
if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "    Database is connected and responding"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "    Database may not be connected"
    ((FAILED++))
fi

section "📊 Summary"
echo ""
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}✅ Production is ready for launch!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Create test user accounts"
    echo "  2. Test full user flows"
    echo "  3. Announce soft launch"
    exit 0
else
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚠️  SOME TESTS FAILED${NC}"
    echo -e "${YELLOW}Please review failures before launch${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
