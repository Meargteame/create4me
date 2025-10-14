#!/bin/bash

# Authentication Testing Script
# This script tests the authentication and authorization endpoints

BASE_URL="http://localhost:3000/api"
CREATOR_EMAIL="creator@test.com"
BRAND_EMAIL="brand@test.com"
PASSWORD="test123456"

echo "========================================="
echo "Authentication & Authorization Testing"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Register Creator
echo -e "${YELLOW}Test 1: Register Creator${NC}"
CREATOR_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$CREATOR_EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"Test Creator\",\"role\":\"creator\"}")

echo "$CREATOR_RESPONSE" | jq '.'
CREATOR_TOKEN=$(echo "$CREATOR_RESPONSE" | jq -r '.token')

if [ "$CREATOR_TOKEN" != "null" ] && [ -n "$CREATOR_TOKEN" ]; then
  echo -e "${GREEN}✓ Creator registration successful${NC}"
else
  echo -e "${RED}✗ Creator registration failed${NC}"
fi
echo ""

# Test 2: Register Brand
echo -e "${YELLOW}Test 2: Register Brand${NC}"
BRAND_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$BRAND_EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"Test Brand\",\"role\":\"brand\"}")

echo "$BRAND_RESPONSE" | jq '.'
BRAND_TOKEN=$(echo "$BRAND_RESPONSE" | jq -r '.token')

if [ "$BRAND_TOKEN" != "null" ] && [ -n "$BRAND_TOKEN" ]; then
  echo -e "${GREEN}✓ Brand registration successful${NC}"
else
  echo -e "${RED}✗ Brand registration failed${NC}"
fi
echo ""

# Test 3: Login Creator
echo -e "${YELLOW}Test 3: Login Creator${NC}"
LOGIN_CREATOR=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$CREATOR_EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_CREATOR" | jq '.'
CREATOR_LOGIN_TOKEN=$(echo "$LOGIN_CREATOR" | jq -r '.token')

if [ "$CREATOR_LOGIN_TOKEN" != "null" ] && [ -n "$CREATOR_LOGIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Creator login successful${NC}"
  CREATOR_TOKEN="$CREATOR_LOGIN_TOKEN"
else
  echo -e "${RED}✗ Creator login failed${NC}"
fi
echo ""

# Test 4: Get Current User (Creator)
echo -e "${YELLOW}Test 4: Get Current User (Creator)${NC}"
ME_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $CREATOR_TOKEN")

echo "$ME_RESPONSE" | jq '.'
USER_ROLE=$(echo "$ME_RESPONSE" | jq -r '.user.role')

if [ "$USER_ROLE" = "creator" ]; then
  echo -e "${GREEN}✓ Current user endpoint works${NC}"
else
  echo -e "${RED}✗ Current user endpoint failed${NC}"
fi
echo ""

# Test 5: Creator tries to create campaign (should fail)
echo -e "${YELLOW}Test 5: Creator tries to create campaign (should fail - 403)${NC}"
CREATE_CAMPAIGN=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/campaigns" \
  -H "Authorization: Bearer $CREATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Campaign","description":"This should fail"}')

HTTP_CODE=$(echo "$CREATE_CAMPAIGN" | tail -n 1)
RESPONSE=$(echo "$CREATE_CAMPAIGN" | sed '$d')

echo "$RESPONSE" | jq '.'

if [ "$HTTP_CODE" = "403" ]; then
  echo -e "${GREEN}✓ Creator correctly denied access to create campaign${NC}"
else
  echo -e "${RED}✗ Creator should not be able to create campaigns (got HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 6: Brand creates campaign (should succeed)
echo -e "${YELLOW}Test 6: Brand creates campaign (should succeed - 201)${NC}"
CREATE_CAMPAIGN_BRAND=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/campaigns" \
  -H "Authorization: Bearer $BRAND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Brand Campaign","description":"This should work"}')

HTTP_CODE=$(echo "$CREATE_CAMPAIGN_BRAND" | tail -n 1)
RESPONSE=$(echo "$CREATE_CAMPAIGN_BRAND" | sed '$d')

echo "$RESPONSE" | jq '.'
CAMPAIGN_ID=$(echo "$RESPONSE" | jq -r '.campaign.id')

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Brand successfully created campaign${NC}"
else
  echo -e "${RED}✗ Brand should be able to create campaigns (got HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 7: Creator views all campaigns (should succeed)
echo -e "${YELLOW}Test 7: Creator views all campaigns (should succeed)${NC}"
VIEW_CAMPAIGNS=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/campaigns/all" \
  -H "Authorization: Bearer $CREATOR_TOKEN")

HTTP_CODE=$(echo "$VIEW_CAMPAIGNS" | tail -n 1)
RESPONSE=$(echo "$VIEW_CAMPAIGNS" | sed '$d')

echo "$RESPONSE" | jq '.'

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Creator can view all campaigns${NC}"
else
  echo -e "${RED}✗ Creator should be able to view campaigns (got HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 8: Brand tries to view all campaigns (should fail)
echo -e "${YELLOW}Test 8: Brand tries to view all campaigns (should fail - 403)${NC}"
BRAND_VIEW_ALL=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/campaigns/all" \
  -H "Authorization: Bearer $BRAND_TOKEN")

HTTP_CODE=$(echo "$BRAND_VIEW_ALL" | tail -n 1)
RESPONSE=$(echo "$BRAND_VIEW_ALL" | sed '$d')

echo "$RESPONSE" | jq '.'

if [ "$HTTP_CODE" = "403" ]; then
  echo -e "${GREEN}✓ Brand correctly denied access to /campaigns/all${NC}"
else
  echo -e "${RED}✗ Brand should not access /campaigns/all (got HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 9: Logout Creator
echo -e "${YELLOW}Test 9: Logout Creator${NC}"
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $CREATOR_TOKEN")

echo "$LOGOUT_RESPONSE" | jq '.'

if echo "$LOGOUT_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✓ Creator logout successful${NC}"
else
  echo -e "${RED}✗ Creator logout failed${NC}"
fi
echo ""

# Test 10: Try to access protected route with invalid token
echo -e "${YELLOW}Test 10: Access protected route with invalid token (should fail - 401)${NC}"
INVALID_TOKEN=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer invalid_token_here")

HTTP_CODE=$(echo "$INVALID_TOKEN" | tail -n 1)
RESPONSE=$(echo "$INVALID_TOKEN" | sed '$d')

echo "$RESPONSE" | jq '.'

if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ Invalid token correctly rejected${NC}"
else
  echo -e "${RED}✗ Invalid token should be rejected (got HTTP $HTTP_CODE)${NC}"
fi
echo ""

echo "========================================="
echo "Testing Complete!"
echo "========================================="
