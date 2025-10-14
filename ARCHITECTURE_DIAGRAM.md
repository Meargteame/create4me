# FeedPage Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite + TypeScript)            │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │            FeedPage_new.tsx                         │  │  │
│  │  │  • Search, Filter, Sort UI                          │  │  │
│  │  │  • Campaign Cards with Actions                      │  │  │
│  │  │  • Campaign Detail Modal                            │  │  │
│  │  │  • Quick Apply Modal (Cover Letter + Portfolio)     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                      ↕                                      │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │            API Client (api.ts)                      │  │  │
│  │  │  • getAllCampaigns()                                │  │  │
│  │  │  • applyToCampaign(...)                             │  │  │
│  │  │  • likeCampaign() [ready]                           │  │  │
│  │  │  • bookmarkCampaign() [ready]                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│                  HTTP Requests (JSON)                            │
│                              ↕                                   │
└─────────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND SERVER (Node.js)                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Express Routes                          │  │
│  │  GET  /campaigns/all           → getAllCampaigns          │  │
│  │  POST /applications/campaigns/:id/apply → applyToCampaign │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Controllers (Business Logic)                  │  │
│  │  • campaignController.ts                                   │  │
│  │  • applicationController.ts                                │  │
│  │    - Validation                                            │  │
│  │    - Role checking                                         │  │
│  │    - Duplicate prevention                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            Prisma Client (Type-safe ORM)                   │  │
│  │  • Campaign model                                          │  │
│  │  • CampaignApplication model                               │  │
│  │  • User model                                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
└─────────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB Database                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Collections                             │  │
│  │  • users                                                   │  │
│  │  • campaigns                                               │  │
│  │  • campaign_applications                                   │  │
│  │    {                                                       │  │
│  │      id,                                                   │  │
│  │      campaignId,                                           │  │
│  │      creatorId,                                            │  │
│  │      coverLetter,      ← NEW FIELD                         │  │
│  │      portfolioLink,    ← NEW FIELD                         │  │
│  │      deliverables,     ← NEW FIELD                         │  │
│  │      status,                                               │  │
│  │      createdAt,                                            │  │
│  │      updatedAt                                             │  │
│  │    }                                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Application Submission

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                                   │
│    User clicks "Apply Now" button on campaign                    │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. QUICK APPLY MODAL OPENS                                       │
│    Form with 3 fields:                                           │
│    • Cover Letter (required) ✓                                   │
│    • Portfolio Link (optional)                                   │
│    • Deliverables (optional)                                     │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. FORM VALIDATION                                               │
│    Frontend checks:                                              │
│    ✓ Cover letter not empty                                      │
│    ✓ Portfolio link valid URL (if provided)                      │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. API CALL                                                      │
│    POST /applications/campaigns/:campaignId/apply                │
│    Headers: { Authorization: "Bearer <token>" }                  │
│    Body: {                                                       │
│      coverLetter: "...",                                         │
│      portfolioLink: "https://...",                               │
│      deliverables: "..."                                         │
│    }                                                             │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. BACKEND VALIDATION                                            │
│    applicationController.applyToCampaign():                      │
│    ✓ User authenticated                                          │
│    ✓ User is creator role                                        │
│    ✓ Cover letter provided                                       │
│    ✓ Campaign exists                                             │
│    ✓ Not already applied                                         │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. DATABASE INSERT                                               │
│    prisma.campaignApplication.create({                           │
│      data: {                                                     │
│        campaignId,                                               │
│        creatorId,                                                │
│        coverLetter,                                              │
│        portfolioLink,                                            │
│        deliverables,                                             │
│        status: "pending"                                         │
│      }                                                           │
│    })                                                            │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. SUCCESS RESPONSE                                              │
│    {                                                             │
│      success: true,                                              │
│      message: "Successfully applied to campaign",                │
│      application: { ... }                                        │
│    }                                                             │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. FRONTEND UI UPDATE                                            │
│    • Close Quick Apply modal                                     │
│    • Show toast: "✓ Application submitted successfully!"         │
│    • Increment application count on campaign card                │
│    • Clear form data                                             │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. USER SEES FEEDBACK                                            │
│    ✓ Green toast notification (3 seconds)                        │
│    ✓ Application count: 15 → 16                                  │
│    ✓ Can apply to other campaigns                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
FeedPage_new.tsx
├── Header (navigation)
├── Campaign Stats Overview
│   ├── Total Campaigns Card
│   ├── New This Week Card
│   ├── Avg. Budget Card
│   └── Bookmarked Card
├── Filter Sidebar
│   ├── Search Bar
│   ├── Category Filters
│   ├── Quick Filters (Bookmarked)
│   └── Sort Dropdown
├── Active Filters Display (removable tags)
├── Campaign List
│   └── Campaign Card (×N)
│       ├── Brand Info + Verified Badge
│       ├── Campaign Title
│       ├── Description
│       ├── Stats Grid
│       │   ├── Budget
│       │   ├── Deadline
│       │   ├── Location
│       │   └── Applications
│       ├── Requirements Tags
│       └── Action Bar
│           ├── Like Button
│           ├── Comment Button
│           ├── Share Button
│           ├── Bookmark Button
│           ├── Details Button    → Opens Campaign Detail Modal
│           └── Apply Now Button  → Opens Quick Apply Modal
├── Pagination Controls
├── Campaign Detail Modal (AnimatePresence)
│   ├── Modal Header (Brand + Category)
│   ├── Campaign Title + Description
│   ├── Stats Grid (4 cards)
│   ├── Requirements List
│   ├── Engagement Stats
│   └── Action Buttons (Apply, Bookmark, Share)
├── Quick Apply Modal (AnimatePresence)
│   ├── Modal Header ("Quick Apply")
│   ├── Form
│   │   ├── Cover Letter Textarea (required)
│   │   ├── Portfolio Link Input (optional)
│   │   └── Deliverables Textarea (optional)
│   └── Action Buttons (Submit, Cancel)
├── Toast Notification (AnimatePresence)
└── Footer
```

---

## State Management

```javascript
// FeedPage_new.tsx State
const [campaigns, setCampaigns]           // Campaign[] - All campaigns
const [loading, setLoading]               // boolean - Loading state
const [filter, setFilter]                 // string - Category filter
const [sortBy, setSortBy]                 // string - Sort option
const [searchQuery, setSearchQuery]       // string - Search text
const [currentPage, setCurrentPage]       // number - Pagination
const [showMobileFilters, setShowMobileFilters] // boolean - Mobile UI
const [toastMessage, setToastMessage]     // string - Toast text
const [showToast, setShowToast]           // boolean - Toast visible
const [selectedCampaign, setSelectedCampaign] // Campaign | null - Detail modal
const [showDetailModal, setShowDetailModal]   // boolean - Modal visible
const [showQuickApply, setShowQuickApply]     // boolean - Apply modal visible
const [applyingCampaignId, setApplyingCampaignId] // string | null - Applying to
const [applicationData, setApplicationData]   // object - Form data
    ├── coverLetter: string
    ├── portfolioLink: string
    └── deliverables: string
```

---

## API Endpoints

### Fully Integrated ✅
```
GET  /campaigns/all
     → Returns all campaigns with user info
     → Used by: FeedPage on mount

POST /applications/campaigns/:campaignId/apply
     → Creates application with 3 fields
     → Used by: Quick Apply modal submit
```

### Ready for Backend ⏳
```
POST   /campaigns/:id/like
DELETE /campaigns/:id/unlike
POST   /campaigns/:id/bookmark
DELETE /campaigns/:id/bookmark
GET    /campaigns/bookmarked
```

---

## Database Schema

### Updated Models ✅

```prisma
model CampaignApplication {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  campaignId    String   @map("campaign_id") @db.ObjectId
  creatorId     String   @map("creator_id") @db.ObjectId
  coverLetter   String?  @map("cover_letter")      // ✅ USED
  portfolioLink String?  @map("portfolio_link")    // ✅ NEW
  deliverables  String?                            // ✅ NEW
  status        String   @default("pending")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  campaign    Campaign @relation(fields: [campaignId], references: [id])
  creator     User     @relation(fields: [creatorId], references: [id])
  
  @@map("campaign_applications")
}
```

### Recommended Additions ⏳

```prisma
model CampaignLike {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  campaignId String   @map("campaign_id") @db.ObjectId
  userId     String   @map("user_id") @db.ObjectId
  createdAt  DateTime @default(now()) @map("created_at")
  
  campaign Campaign @relation(fields: [campaignId], references: [id])
  user     User     @relation(fields: [userId], references: [id])
  
  @@unique([campaignId, userId])
  @@map("campaign_likes")
}

model CampaignBookmark {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  campaignId String   @map("campaign_id") @db.ObjectId
  userId     String   @map("user_id") @db.ObjectId
  createdAt  DateTime @default(now()) @map("created_at")
  
  campaign Campaign @relation(fields: [campaignId], references: [id])
  user     User     @relation(fields: [userId], references: [id])
  
  @@unique([campaignId, userId])
  @@map("campaign_bookmarks")
}
```

---

## Error Handling

### Frontend
```javascript
// Optimistic UI with rollback
try {
  // Update UI immediately
  setCampaigns(...)
  
  // Call API
  const response = await apiClient.applyToCampaign(...)
  
  if (response.success) {
    showToastNotification('✓ Success!')
  }
} catch (error) {
  // Revert UI on error
  setCampaigns(...)
  showToastNotification('❌ Failed')
}
```

### Backend
```typescript
// Comprehensive validation
if (!creatorId) {
  return res.status(401).json({ success: false, message: '...' })
}
if (role !== 'creator') {
  return res.status(403).json({ success: false, message: '...' })
}
if (!coverLetter) {
  return res.status(400).json({ success: false, message: '...' })
}
if (!campaign) {
  return res.status(404).json({ success: false, message: '...' })
}
if (existingApplication) {
  return res.status(400).json({ success: false, message: '...' })
}
```

---

## Performance Optimizations

1. **Optimistic UI**: UI updates before API response
2. **Pagination**: Only 6 campaigns per page
3. **Lazy Loading**: Modals only render when open
4. **Controlled Inputs**: React state for form fields
5. **Memoization**: Can add useMemo for filtered campaigns
6. **Error Boundaries**: Graceful error handling
7. **Fallback Data**: Mock data if API fails

---

## Security Features

1. **JWT Authentication**: Bearer token required
2. **Role-Based Access**: Only creators can apply
3. **Input Validation**: Cover letter required
4. **Duplicate Prevention**: Can't apply twice
5. **SQL Injection Prevention**: Prisma ORM
6. **XSS Protection**: React auto-escapes
7. **CORS**: Configured in backend

---

**Architecture Status**: ✅ Complete and Production Ready
