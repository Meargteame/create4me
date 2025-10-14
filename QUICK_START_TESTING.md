# Quick Start Guide - FeedPage Integration Testing

## Prerequisites
- MongoDB running (local or cloud)
- Node.js installed
- Backend and frontend dependencies installed

## Step 1: Start Backend

```bash
cd /home/meareg/Desktop/create4me/backend

# Ensure environment variables are set in .env
# DATABASE_URL=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=3001

# Start the backend server
npm run dev
```

Expected output:
```
Server running on port 3001
MongoDB connected successfully
```

## Step 2: Start Frontend

```bash
cd /home/meareg/Desktop/create4me/react-frontend

# Ensure .env has correct API URL
# VITE_API_URL=http://localhost:3001

# Start the frontend
npm run dev
```

Expected output:
```
VITE ready in XXXms
Local: http://localhost:5173
```

## Step 3: Test the Integration

### A. Create Test User (Creator Role)
```bash
# Use API client or create directly via registration
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@test.com",
    "password": "password123",
    "role": "creator"
  }'
```

### B. Create Test Campaign (Brand User)
```bash
# First create a brand user
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "brand@test.com",
    "password": "password123",
    "role": "brand"
  }'

# Login to get token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "brand@test.com",
    "password": "password123"
  }'

# Use the token to create a campaign
curl -X POST http://localhost:3001/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Ethiopian Coffee Campaign",
    "description": "Looking for creators to showcase authentic Ethiopian coffee culture"
  }'
```

### C. Test Frontend Flow

1. **Navigate to homepage**: http://localhost:5173
2. **Register/Login** as creator user (creator@test.com)
3. **Navigate to /feed** (should auto-navigate after login)
4. **Verify campaigns load** from backend
5. **Test Search**: Type keywords to filter campaigns
6. **Test Filters**: Select category filters
7. **Test Sort**: Change sort options
8. **Test Pagination**: If >6 campaigns, test pagination
9. **Click "Details"**: View campaign detail modal
10. **Click "Apply Now"**: 
    - Fill cover letter (required)
    - Add portfolio link (optional)
    - Add deliverables (optional)
    - Submit application
11. **Verify toast notification** appears
12. **Verify application count** increments
13. **Test Bookmark**: Click bookmark icon
14. **Test Like**: Click heart icon

## Step 4: Verify Backend Data

### Check Applications in Database
```javascript
// In MongoDB shell or Compass
use your_database_name
db.campaign_applications.find().pretty()
```

Should show:
```json
{
  "_id": ObjectId("..."),
  "campaign_id": "...",
  "creator_id": "...",
  "cover_letter": "Your cover letter text",
  "portfolio_link": "https://...",
  "deliverables": "Your deliverables text",
  "status": "pending",
  "created_at": ISODate("..."),
  "updated_at": ISODate("...")
}
```

## Expected Behavior

### ✅ Success Indicators
- [ ] Campaigns load from backend (check Network tab: GET /campaigns/all)
- [ ] Campaign count shows correct number
- [ ] Search filters campaigns in real-time
- [ ] Category filters work correctly
- [ ] Sort options reorder campaigns
- [ ] Pagination controls appear when >6 campaigns
- [ ] Campaign detail modal shows full info
- [ ] Apply modal opens with empty form
- [ ] Cover letter validation works (required)
- [ ] Application submits successfully (check Network tab: POST /applications/campaigns/:id/apply)
- [ ] Toast notification shows "✓ Application submitted successfully!"
- [ ] Application count increments on UI
- [ ] No console errors in browser
- [ ] No backend errors in terminal

### ⚠️ Known Behaviors
- **Likes/Bookmarks**: Frontend updates immediately but backend endpoints not yet implemented (optimistic UI)
- **Mock Data Fallback**: If backend fails, shows mock campaigns
- **Default Values**: Some fields use defaults (budget, location, category) until backend provides them

## Troubleshooting

### Problem: Campaigns Don't Load
**Solution**:
1. Check backend is running: http://localhost:3001
2. Check MongoDB connection
3. Verify VITE_API_URL in frontend .env
4. Check browser console for errors
5. Check Network tab for failed requests

### Problem: Application Submission Fails
**Possible Causes**:
1. Not logged in as creator role
2. Empty cover letter (validation error)
3. Already applied to campaign
4. Campaign doesn't exist
5. Backend authentication issue

**Check**:
- Browser console errors
- Network tab response
- Backend terminal logs

### Problem: "Only creators can apply to campaigns"
**Solution**: 
1. Log out
2. Register/login with role: "creator"
3. Try again

### Problem: No campaigns appear
**Solution**:
1. Create test campaigns using curl commands above
2. Or backend falls back to mock data (check if "Brand" names appear generic)

## API Endpoints Reference

### Auth
- POST /auth/signup - Register user
- POST /auth/login - Login user
- GET /auth/me - Get current user

### Campaigns
- GET /campaigns/all - Get all campaigns (for feed)
- GET /campaigns - Get user's campaigns
- GET /campaigns/:id - Get single campaign
- POST /campaigns - Create campaign
- PUT /campaigns/:id - Update campaign
- DELETE /campaigns/:id - Delete campaign

### Applications
- POST /applications/campaigns/:campaignId/apply - Apply to campaign
- GET /applications/my-applications - Get user's applications
- GET /applications/campaigns/:campaignId/applicants - Get campaign applicants (brand only)
- PATCH /applications/applications/:applicationId - Update application status

## Development Tips

### Watch Backend Logs
```bash
cd backend
npm run dev
# Watch for:
# - "Apply to campaign error:" - application issues
# - "Get all campaigns error:" - campaign fetch issues
```

### Watch Frontend Console
```javascript
// In browser console
localStorage.getItem('auth_token') // Check if logged in
```

### Test API Directly
```bash
# Get all campaigns
curl http://localhost:3001/campaigns/all \
  -H "Authorization: Bearer YOUR_TOKEN"

# Apply to campaign
curl -X POST http://localhost:3001/applications/campaigns/CAMPAIGN_ID/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "coverLetter": "I am a great fit because...",
    "portfolioLink": "https://myportfolio.com",
    "deliverables": "I will deliver 5 Instagram posts and 10 stories"
  }'
```

## Success! 🎉

If all tests pass, your FeedPage is fully integrated with the backend!

Next steps:
- Implement like/bookmark backend endpoints
- Add more campaign fields (budget, location, category, requirements)
- Enhance campaign detail modal with more information
- Add real-time updates using WebSockets
- Implement campaign comments system

---

**Need Help?**
- Check FEED_INTEGRATION_GUIDE.md for detailed integration docs
- Review backend/src/controllers/ for API logic
- Review react-frontend/src/lib/api.ts for API client methods
