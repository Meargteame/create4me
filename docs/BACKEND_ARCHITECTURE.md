# Phase 11: Backend Architecture & Technical Specification

## 📊 Current Stack Analysis

**Your Existing Stack:**
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Frontend:** React + TypeScript + Vite
- **Deployment:** Railway (backend) + Vercel (frontend)

---

## 1. Technology Stack Comparison & Recommendations

### Option 1: **Current Stack (Recommended for Fast Deployment)** ⭐

```
Frontend: React + TypeScript + Vite
Backend:  Node.js + Express + TypeScript
Database: MongoDB Atlas
Hosting:  Railway (API) + Vercel (Web)
Payments: Chapa/Telebirr REST APIs
```

**Pros:**
✅ Already implemented (fastest to market)
✅ MongoDB flexible schema (rapid iteration)
✅ Railway $5/month + Vercel free tier (cost-effective)
✅ TypeScript end-to-end (type safety)
✅ Large Ethiopian dev community knows MERN stack
✅ Easy Chapa/Telebirr integration (Node.js SDKs available)

**Cons:**
❌ Manual scaling needed at high volume
❌ No built-in serverless functions

**Best For:** Your current stage (MVP → Market validation)

---

### Option 2: **Serverless Architecture (Future Scale)**

```
Frontend: Next.js 14 (App Router) + TypeScript
Backend:  AWS Lambda + API Gateway
Database: DynamoDB + ElastiCache
Hosting:  Vercel (auto-deploys Next.js)
Payments: Chapa/Telebirr via Lambda functions
```

**Pros:**
✅ Auto-scales to millions of users
✅ Pay only for actual usage
✅ Built-in caching (ElastiCache)
✅ Next.js API routes = instant serverless
✅ AWS presence in Africa (low latency)

**Cons:**
❌ Higher complexity (cold starts)
❌ Migration effort from current stack
❌ DynamoDB learning curve
❌ More expensive at low volume

**Best For:** After 10,000+ monthly active users

---

### Option 3: **Python/Django (Alternative)**

```
Frontend: React + TypeScript + Vite (keep)
Backend:  Python + Django + Django REST Framework
Database: PostgreSQL (Railway/Supabase)
Hosting:  Railway (Django) + Vercel (React)
Payments: Chapa/Telebirr Python SDKs
```

**Pros:**
✅ Django Admin (instant CMS)
✅ Built-in RBAC (permissions system)
✅ PostgreSQL relational integrity
✅ Strong security defaults
✅ Python ML ecosystem (future analytics)

**Cons:**
❌ Requires Python rewrite
❌ Slower iteration than Node.js
❌ Less Ethiopian dev talent vs JavaScript

**Best For:** If you prioritize admin tools over speed

---

## 📈 Recommended Path

**Phase 1 (Now - 6 months):** Stick with **Option 1** (current stack)
- Deploy to production ASAP
- Validate market fit
- Iterate based on user feedback

**Phase 2 (6-12 months):** Add **serverless functions** to Option 1
- Use Vercel Functions for high-traffic endpoints
- Keep main API on Railway
- Best of both worlds

**Phase 3 (12+ months):** Consider **Option 2** migration
- Only if you have 10,000+ MAU
- Gradual migration (not big bang)

---

## 2. Serverless Function Architecture

### High-Traffic Endpoint: "Available Campaigns" Lookup

**Problem:** This view loads frequently (every creator login)
**Solution:** Serverless function with caching

#### AWS Lambda Version:

```typescript
// lambda/campaigns/list.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Redis } from 'ioredis';

const dynamodb = new DynamoDB.DocumentClient();
const redis = new Redis(process.env.REDIS_URL);

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.requestContext.authorizer?.userId;
  
  // Check cache first (1-minute TTL)
  const cacheKey = `campaigns:available:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return {
      statusCode: 200,
      body: cached,
      headers: { 'X-Cache': 'HIT' }
    };
  }

  // Query DynamoDB
  const result = await dynamodb.query({
    TableName: 'Campaigns',
    IndexName: 'StatusIndex',
    KeyConditionExpression: '#status = :active',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':active': 'active' },
    Limit: 50
  }).promise();

  // Filter by creator's niche/platforms (in-memory)
  const campaigns = filterByCreatorPreferences(result.Items, userId);

  // Cache for 60 seconds
  const response = JSON.stringify({ campaigns });
  await redis.setex(cacheKey, 60, response);

  return {
    statusCode: 200,
    body: response,
    headers: { 'X-Cache': 'MISS' }
  };
};
```

#### Vercel Function Version (Easier Migration):

```typescript
// pages/api/campaigns/available.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Redis } from '@upstash/redis';
import { connectMongo } from '@/lib/mongo';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Edge caching
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  const userId = req.user.id; // from middleware

  // Check Redis cache
  const cached = await redis.get(`campaigns:${userId}`);
  if (cached) {
    return res.json(cached);
  }

  // Query MongoDB
  const db = await connectMongo();
  const campaigns = await db.collection('campaigns')
    .find({ status: 'active' })
    .limit(50)
    .toArray();

  // Cache for 60s
  await redis.setex(`campaigns:${userId}`, 60, campaigns);

  res.json({ campaigns });
}
```

**Performance:**
- **Without caching:** ~500ms
- **With Redis:** ~50ms (10x faster!)
- **Cost:** ~$0.20 per 1M requests (vs $5/month fixed server)

---

## 3. Database Schema Design

### **3.1 Users Table (Core Identity)**

```typescript
// models/User.ts
interface User {
  _id: ObjectId;
  email: string;                    // Unique, indexed
  password: string;                 // bcrypt hashed
  role: 'creator' | 'brand';        // RBAC role
  
  // Personal Info
  name: string;
  phone?: string;                   // Optional
  avatar?: string;                  // Cloudinary URL
  
  // Verification & Vetting
  isVerified: boolean;              // Email verified
  isVettedProfile: boolean;         // Manual admin approval
  verificationDate?: Date;          // When vetted
  verifiedBy?: ObjectId;            // Admin who vetted
  
  // Payment Integration (CRITICAL)
  paymentProviders: {
    telebirr?: {
      phoneNumber: string;          // 09XXXXXXXX
      accountName: string;
      isVerified: boolean;
    };
    chapa?: {
      accountId: string;            // Chapa merchant ID
      subaccountCode?: string;      // For split payments
      isVerified: boolean;
    };
  };
  
  // Security
  twoFactorEnabled: boolean;
  lastLogin: Date;
  loginHistory: Array<{
    ip: string;
    userAgent: string;
    timestamp: Date;
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;                 // Soft delete
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isVettedProfile: 1 });
```

### **3.2 Creator Profiles (Extended Data)**

```typescript
// models/CreatorProfile.ts
interface CreatorProfile {
  _id: ObjectId;
  userId: ObjectId;                 // Reference to User
  
  // Discovery Fields (for brand search)
  username: string;                 // @handle
  displayName: string;
  bio: string;
  category: string;                 // 'fashion', 'tech', etc.
  tags: string[];                   // ['lifestyle', 'travel']
  
  // Platform Stats
  platforms: Array<{
    name: 'TikTok' | 'Instagram' | 'YouTube';
    handle: string;
    followers: number;
    engagementRate: number;         // 0-100
    isVerified: boolean;
    lastUpdated: Date;
  }>;
  
  // Verification Documents
  verificationDocs: {
    idCard?: string;                // Cloudinary URL
    proofOfWork?: string[];         // Portfolio links
    status: 'pending' | 'approved' | 'rejected';
  };
  
  // Performance Metrics
  stats: {
    totalEarnings: number;          // ETB
    completedCampaigns: number;
    avgRating: number;              // 0-5
    responseRate: number;           // 0-100
    onTimeDelivery: number;         // 0-100
  };
  
  // Availability
  isAvailable: boolean;
  minimumRate: number;              // ETB
  
  createdAt: Date;
  updatedAt: Date;
}

// Indexes for Search
db.creatorprofiles.createIndex({ category: 1, 'platforms.name': 1 });
db.creatorprofiles.createIndex({ 'platforms.followers': -1 });
db.creatorprofiles.createIndex({ 'platforms.engagementRate': -1 });
db.creatorprofiles.createIndex({ userId: 1 }, { unique: true });
```

### **3.3 Campaigns Table**

```typescript
// models/Campaign.ts
interface Campaign {
  _id: ObjectId;
  brandId: ObjectId;                // Reference to User (brand)
  
  // Campaign Details
  title: string;
  description: string;
  category: string;
  platforms: ('TikTok' | 'Instagram' | 'YouTube')[];
  
  // Requirements
  requirements: {
    minFollowers: number;
    targetCategories: string[];
    contentType: string;            // 'video', 'photo', 'story'
    deliverables: number;           // How many posts
  };
  
  // Compensation
  budget: number;                   // ETB total
  paymentPerPost: number;           // ETB each
  paymentStatus: 'pending' | 'escrowed' | 'released' | 'refunded';
  
  // Timeline
  deadline: Date;
  applicationDeadline: Date;
  
  // Status
  status: 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';
  
  // Applications
  applicationsCount: number;
  selectedCreators: ObjectId[];     // Max based on budget
  
  // Security
  isVerified: boolean;              // Brand is vetted
  escrowReleaseDate?: Date;         // Auto-release after N days
  
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
db.campaigns.createIndex({ status: 1, deadline: 1 });
db.campaigns.createIndex({ brandId: 1 });
db.campaigns.createIndex({ 'requirements.targetCategories': 1 });
```

### **3.4 SecureChatMessages (Content Filtering)**

```typescript
// models/Message.ts
interface SecureChatMessage {
  _id: ObjectId;
  conversationId: ObjectId;         // Group messages
  
  // Participants
  senderId: ObjectId;
  receiverId: ObjectId;
  senderRole: 'creator' | 'brand';
  
  // Content
  content: string;                  // Sanitized text
  originalContent?: string;         // Pre-filter (for appeals)
  contentType: 'text' | 'template' | 'file';
  
  // Security Flags
  hasFilteredContent: boolean;      // Contains phone/email
  filteredWords: string[];          // What was blocked
  warningIssued: boolean;           // User warned
  
  // File Attachments (if any)
  attachments?: Array<{
    type: 'image' | 'document';
    url: string;
    filename: string;
  }>;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  deletedBy?: ObjectId[];           // Soft delete per user
  
  // Metadata
  campaignId?: ObjectId;            // Related campaign
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
db.messages.createIndex({ conversationId: 1, createdAt: -1 });
db.messages.createIndex({ senderId: 1, receiverId: 1 });
db.messages.createIndex({ hasFilteredContent: 1 }); // For moderation
```

---

## 4. Security & Authentication

### **4.1 Role-Based Access Control (RBAC)**

#### Implementation Strategy:

```typescript
// middleware/rbac.ts
import { Request, Response, NextFunction } from 'express';

export const requireRole = (...allowedRoles: Array<'creator' | 'brand' | 'admin'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Set by auth middleware

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied for your role' 
      });
    }

    next();
  };
};

// Usage examples:
app.get('/api/campaigns/create', 
  authenticate, 
  requireRole('brand'),  // Only brands can create
  createCampaign
);

app.get('/api/campaigns/available', 
  authenticate, 
  requireRole('creator'),  // Only creators can view
  getAvailableCampaigns
);
```

#### Database-Level Permissions:

```javascript
// MongoDB Query Helpers
class SecureQuery {
  // Ensure users only see their own data
  static forUser(userId: string, role: string) {
    if (role === 'creator') {
      return { userId }; // Creators see only their data
    } else if (role === 'brand') {
      return { brandId: userId }; // Brands see only their campaigns
    }
    return {}; // Admins see all
  }

  // Filter campaigns based on role
  static campaignFilters(userId: string, role: string) {
    if (role === 'creator') {
      return { 
        status: 'active',
        deadline: { $gte: new Date() }
      };
    } else if (role === 'brand') {
      return { brandId: userId };
    }
    return {};
  }
}
```

### **4.2 Content Filtering for SecureChat**

```typescript
// services/contentFilter.ts

interface FilterResult {
  isFiltered: boolean;
  cleanContent: string;
  filteredWords: string[];
  warningMessage?: string;
}

class ContentFilterService {
  // Regex patterns for external contact info
  private static readonly PATTERNS = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
    phone: /(\+251|0)(9|7)\d{8}/g,  // Ethiopian phone numbers
    whatsapp: /\b(whatsapp|wa\.me|chat\.whatsapp)\b/gi,
    telegram: /\b(telegram|t\.me|@\w+)\b/gi,
    instagram: /\b(instagram\.com|insta|ig:)\b/gi,
    // More patterns...
  };

  static filterMessage(content: string): FilterResult {
    let cleanContent = content;
    const filteredWords: string[] = [];
    let isFiltered = false;

    // Check each pattern
    for (const [type, pattern] of Object.entries(this.PATTERNS)) {
      const matches = content.match(pattern);
      
      if (matches) {
        isFiltered = true;
        filteredWords.push(...matches);
        
        // Replace with placeholder
        cleanContent = cleanContent.replace(pattern, '[FILTERED]');
      }
    }

    return {
      isFiltered,
      cleanContent,
      filteredWords,
      warningMessage: isFiltered 
        ? 'Please keep all communication on-platform for payment security.' 
        : undefined
    };
  }

  // Before saving message
  static async processMessage(messageData: any) {
    const filtered = this.filterMessage(messageData.content);

    return {
      content: filtered.cleanContent,
      originalContent: filtered.isFiltered ? messageData.content : undefined,
      hasFilteredContent: filtered.isFiltered,
      filteredWords: filtered.filteredWords,
      warningMessage: filtered.warningMessage
    };
  }
}

// Usage in message route
router.post('/send', authenticate, async (req, res) => {
  const { receiverId, content } = req.body;

  // Filter content
  const filtered = await ContentFilterService.processMessage({ content });

  // Save to database
  const message = await Message.create({
    senderId: req.user.id,
    receiverId,
    ...filtered,
    createdAt: new Date()
  });

  // Warn user if filtered
  res.json({
    success: true,
    message,
    warning: filtered.warningMessage
  });
});
```

---

## 5. Core API Endpoints

### **5.1 Creator Discovery (Brand Dashboard)**

```typescript
/**
 * GET /api/creators/discover
 * Purpose: Brand searches for creators
 * Auth: Brand role required
 */
router.get('/discover', authenticate, requireRole('brand'), async (req, res) => {
  const {
    verification_status,  // 'verified' | 'all'
    content_niche,        // 'fashion' | 'tech' | etc.
    primary_platform,     // 'TikTok' | 'Instagram'
    min_followers,
    max_budget,
    page = 1,
    limit = 20
  } = req.query;

  // Build filter query
  const filter: any = {
    'verificationDocs.status': verification_status === 'verified' 
      ? 'approved' 
      : { $in: ['approved', 'pending'] }
  };

  if (content_niche) {
    filter.category = content_niche;
  }

  if (primary_platform) {
    filter['platforms.name'] = primary_platform;
  }

  if (min_followers) {
    filter['platforms.followers'] = { $gte: parseInt(min_followers as string) };
  }

  // Query with pagination
  const creators = await CreatorProfile.find(filter)
    .populate('userId', 'name avatar')
    .sort({ 'platforms.followers': -1 })  // Most followers first
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await CreatorProfile.countDocuments(filter);

  res.json({
    success: true,
    creators,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
```

### **5.2 Payment Processing (Chapa/Telebirr Integration)**

```typescript
/**
 * POST /api/payments/process-payout
 * Purpose: Release payment to creator after campaign completion
 * Auth: System (cron) or Brand
 */
import { ChapaService } from '../services/chapa';
import { TelebirrService } from '../services/telebirr';

router.post('/process-payout', authenticate, async (req, res) => {
  const { campaignId, creatorId } = req.body;

  try {
    // 1. Verify campaign is completed
    const campaign = await Campaign.findById(campaignId);
    if (campaign.status !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Campaign not completed yet' 
      });
    }

    // 2. Get creator payment info
    const creator = await User.findById(creatorId);
    const paymentProvider = creator.paymentProviders.telebirr 
      ? 'telebirr' 
      : 'chapa';

    // 3. Calculate amount
    const amount = campaign.paymentPerPost;
    const platformFee = amount * 0.05; //  5% fee
    const creatorPayout = amount - platformFee;

    // 4. Process payment
    let transaction;
    
    if (paymentProvider === 'telebirr') {
      transaction = await TelebirrService.transfer({
        recipient: creator.paymentProviders.telebirr.phoneNumber,
        amount: creatorPayout,
        reference: `${campaignId}-${creatorId}`,
        description: `Payment for campaign: ${campaign.title}`
      });
    } else {
      transaction = await ChapaService.transfer({
        account: creator.paymentProviders.chapa.accountId,
        amount: creatorPayout,
        reference: `${campaignId}-${creatorId}`,
        currency: 'ETB'
      });
    }

    // 5. Update campaign payment status
    await Campaign.findByIdAndUpdate(campaignId, {
      paymentStatus: 'released',
      payoutTransactionId: transaction.id,
      payoutDate: new Date()
    });

    // 6. Update creator earnings
    await CreatorProfile.findOneAndUpdate(
      { userId: creatorId },
      { $inc: { 'stats.totalEarnings': creatorPayout } }
    );

    res.json({
      success: true,
      transaction: {
        id: transaction.id,
        amount: creatorPayout,
        provider: paymentProvider,
        status: transaction.status
      }
    });

  } catch (error) {
    console.error('Payout failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed' 
    });
  }
});
```

---

## 🚀 Implementation Priority

### Phase 1 (Week 1-2): Security Hardening
1. ✅ Implement RBAC middleware
2. ✅ Add content filtering to messages
3. ✅ Set up payment provider accounts (Chapa/Telebirr)
4. ✅ Add verification fields to User model

### Phase 2 (Week 3-4): Payment Integration
1. Integrate Chapa SDK
2. Integrate Telebirr SDK
3. Build escrow system
4. Test payout flow

### Phase 3 (Week 5-6): Performance Optimization
1. Add Redis caching (Upstash free tier)
2. Create database indexes
3. Optimize heavy queries
4. Set up monitoring (Sentry)

### Phase 4 (Month 2): Scale Preparation
1. Add Vercel Functions for hot paths
2. Implement rate limiting
3. Add queue system (Bull/Redis)
4. Load testing

---

**Next Steps:**
1. Review this architecture doc
2. Prioritize which features to implement first
3. Set up Chapa/Telebirr dev accounts
4. Start with RBAC + content filtering (highest security priority)

---

**Documentation Created:** November 22, 2025  
**Phase:** 11 - Backend Architecture  
**Status:** ✅ Complete - Ready for Implementation
