# Phase 12: 2-Week Implementation Roadmap

**Duration:** November 22 - December 6, 2025  
**Goal:** Implement security foundation, core features, and payment infrastructure

---

## 📅 WEEK 1: Security & Core Features

### **Day 1-2: Security Foundation** 🔒

#### Task 1.1: RBAC Middleware Implementation

**File:** `/backend/src/middleware/rbac.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'creator' | 'brand' | 'admin';
  };
}

/**
 * Middleware to require specific role(s)
 * Usage: app.get('/route', requireRole('creator'), handler)
 */
export const requireRole = (...allowedRoles: Array<'creator' | 'brand' | 'admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Check if user has allowed role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        code: 'ROLE_FORBIDDEN',
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware to allow multiple roles or owner access
 * Usage: app.get('/profile/:id', requireRoleOrOwner('admin'), handler)
 */
export const requireRoleOrOwner = (...allowedRoles: Array<'creator' | 'brand' | 'admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const isAllowedRole = allowedRoles.includes(req.user.role);
    const isOwner = req.params.id === req.user.id;

    if (!isAllowedRole && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    next();
  };
};
```

**Apply to Routes:**

```typescript
// /backend/src/routes/campaigns.ts
import { requireRole } from '../middleware/rbac';

// Only brands can create campaigns
router.post('/', authenticate, requireRole('brand'), createCampaign);

// Only creators see available campaigns
router.get('/available', authenticate, requireRole('creator'), getAvailableCampaigns);

// Only brands see their campaign applications
router.get('/:id/applications', authenticate, requireRole('brand'), getCampaignApplications);
```

**Testing:**
```bash
# Test with creator token (should fail)
curl -X POST http://localhost:3001/api/campaigns \
  -H "Authorization: Bearer CREATOR_TOKEN"

# Test with brand token (should succeed)
curl -X POST http://localhost:3001/api/campaigns \
  -H "Authorization: Bearer BRAND_TOKEN"
```

**✅ Success Criteria:**
- [ ] RBAC middleware created
- [ ] Applied to all sensitive routes
- [ ] Tests pass for role restrictions
- [ ] Error messages are clear

---

#### Task 1.2: User Model Security Fields

**File:** `/backend/src/models/User.ts`

**Add these fields:**

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  // Existing fields...
  email: string;
  password: string;
  name: string;
  role: 'creator' | 'brand' | 'admin';
  
  // NEW SECURITY FIELDS
  isVerified: boolean;
  isVettedProfile: boolean;
  verificationDate?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  
  // NEW PAYMENT PROVIDER FIELDS
  paymentProviders: {
    telebirr?: {
      phoneNumber: string;
      accountName: string;
      isVerified: boolean;
      verifiedAt?: Date;
    };
    chapa?: {
      accountId: string;
      subaccountCode?: string;
      isVerified: boolean;
      verifiedAt?: Date;
    };
  };
  
  // SECURITY TRACKING
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  loginHistory: Array<{
    ip: string;
    userAgent: string;
    timestamp: Date;
    location?: string;
  }>;
  
  // SOFT DELETE
  deletedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    select: false // Don't return password by default
  },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['creator', 'brand', 'admin'],
    required: true 
  },
  
  // Security fields
  isVerified: { type: Boolean, default: false },
  isVettedProfile: { type: Boolean, default: false },
  verificationDate: Date,
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  
  // Payment providers
  paymentProviders: {
    telebirr: {
      phoneNumber: String,
      accountName: String,
      isVerified: { type: Boolean, default: false },
      verifiedAt: Date
    },
    chapa: {
      accountId: String,
      subaccountCode: String,
      isVerified: { type: Boolean, default: false },
      verifiedAt: Date
    }
  },
  
  // Security tracking
  twoFactorEnabled: { type: Boolean, default: false },
  lastLogin: Date,
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: Date,
    location: String
  }],
  
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isVettedProfile: 1 });
UserSchema.index({ deletedAt: 1 });

export default mongoose.model<IUser>('User', UserSchema);
```

**Migration Script:**

```typescript
// /backend/src/scripts/migrateUserFields.ts
import User from '../models/User';
import { connectDatabase } from '../config/database';

async function migrateUsers() {
  await connectDatabase();
  
  console.log('Adding security fields to existing users...');
  
  await User.updateMany(
    { isVerified: { $exists: false } },
    { 
      $set: {
        isVerified: false,
        isVettedProfile: false,
        twoFactorEnabled: false,
        loginHistory: [],
        paymentProviders: {}
      }
    }
  );
  
  console.log('✅ Migration complete');
  process.exit(0);
}

migrateUsers();
```

**✅ Success Criteria:**
- [ ] User model updated with new fields
- [ ] Migration script runs successfully
- [ ] Existing users have default values
- [ ] Indexes created

---

#### Task 1.3: Content Filter Service

**File:** `/backend/src/services/contentFilter.ts`

```typescript
export interface FilterResult {
  isFiltered: boolean;
  cleanContent: string;
  originalContent: string;
  filteredWords: string[];
  warningMessage?: string;
}

export class ContentFilterService {
  // Patterns for Ethiopian context
  private static readonly PATTERNS = {
    // Ethiopian phone: +251XXXXXXXXX or 09XXXXXXXX or 07XXXXXXXX
    ethiopianPhone: /(\+251|0)(9|7)\d{8}/g,
    
    // International phone
    internationalPhone: /\+\d{10,15}/g,
    
    // Email addresses
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
    
    // Messaging apps
    whatsapp: /\b(whatsapp|wa\.me|chat\.whatsapp|watsapp)\b/gi,
    telegram: /\b(telegram|t\.me|tg:\/\/)\b/gi,
    signal: /\b(signal|signal\.org)\b/gi,
    viber: /\b(viber|vb\.me)\b/gi,
    
    // Social media direct links
    instagram: /\b(instagram\.com\/direct|ig:\/\/|dm me on ig)\b/gi,
    facebook: /\b(facebook\.com\/messages|fb\.me|m\.me)\b/gi,
    
    // Generic external contact prompts
    contactMe: /\b(call me|text me|dm me|contact me at|reach me at)\b/gi,
  };

  /**
   * Main filtering function
   */
  static filterMessage(content: string): FilterResult {
    if (!content || typeof content !== 'string') {
      return {
        isFiltered: false,
        cleanContent: '',
        originalContent: content,
        filteredWords: []
      };
    }

    let cleanContent = content;
    const filteredWords: string[] = [];
    let isFiltered = false;

    // Apply each pattern
    for (const [type, pattern] of Object.entries(this.PATTERNS)) {
      const matches = content.match(pattern);
      
      if (matches && matches.length > 0) {
        isFiltered = true;
        filteredWords.push(...matches);
        
        // Replace with context-appropriate placeholder
        const placeholder = this.getPlaceholder(type);
        cleanContent = cleanContent.replace(pattern, placeholder);
      }
    }

    // Remove multiple spaces created by replacements
    cleanContent = cleanContent.replace(/\s+/g, ' ').trim();

    return {
      isFiltered,
      cleanContent,
      originalContent: content,
      filteredWords,
      warningMessage: isFiltered 
        ? '⚠️ External contact info removed. Please keep all communication on-platform for your security and payment protection.' 
        : undefined
    };
  }

  /**
   * Get appropriate placeholder for filtered content
   */
  private static getPlaceholder(type: string): string {
    const placeholders: Record<string, string> = {
      ethiopianPhone: '[PHONE NUMBER REMOVED]',
      internationalPhone: '[PHONE NUMBER REMOVED]',
      email: '[EMAIL REMOVED]',
      whatsapp: '[EXTERNAL APP REMOVED]',
      telegram: '[EXTERNAL APP REMOVED]',
      signal: '[EXTERNAL APP REMOVED]',
      viber: '[EXTERNAL APP REMOVED]',
      instagram: '[EXTERNAL LINK REMOVED]',
      facebook: '[EXTERNAL LINK REMOVED]',
      contactMe: '[CONTACT REQUEST REMOVED]'
    };
    
    return placeholders[type] || '[FILTERED]';
  }

  /**
   * Check if content has risky patterns (for warnings without filtering)
   */
  static analyzeRisk(content: string): {
    riskLevel: 'low' | 'medium' | 'high';
    reasons: string[];
  } {
    const risks: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Check for payment-related keywords outside platform
    if (/\b(send money|transfer|bank account|payment outside)\b/gi.test(content)) {
      risks.push('Payment discussion outside platform');
      riskLevel = 'high';
    }

    // Check for urgency + external contact (scam pattern)
    if (/\b(urgent|asap|immediately)\b/gi.test(content) && 
        /\b(call|text|dm)\b/gi.test(content)) {
      risks.push('Urgency with external contact request');
      riskLevel = 'high';
    }

    return { riskLevel, reasons: risks };
  }
}
```

**Apply to Message Route:**

```typescript
// /backend/src/routes/messages.ts
import { ContentFilterService } from '../services/contentFilter';

router.post('/send', authenticate, async (req, res) => {
  try {
    const { receiverId, content, conversationId } = req.body;

    // Filter content
    const filtered = ContentFilterService.filterMessage(content);
    const risk = ContentFilterService.analyzeRisk(content);

    // Save message
    const message = await Message.create({
      conversationId,
      senderId: req.user.id,
      receiverId,
      senderRole: req.user.role,
      content: filtered.cleanContent,
      originalContent: filtered.isFiltered ? filtered.originalContent : undefined,
      hasFilteredContent: filtered.isFiltered,
      filteredWords: filtered.filteredWords,
      riskLevel: risk.riskLevel,
      warningIssued: filtered.isFiltered,
      createdAt: new Date()
    });

    // Return with warning if filtered
    res.json({
      success: true,
      message,
      warning: filtered.warningMessage,
      riskAlert: risk.riskLevel === 'high' ? risk.reasons : undefined
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});
```

**Testing:**

```typescript
// /backend/src/__tests__/contentFilter.test.ts
import { ContentFilterService } from '../services/contentFilter';

describe('ContentFilterService', () => {
  test('filters Ethiopian phone numbers', () => {
    const result = ContentFilterService.filterMessage('Call me at 0912345678');
    expect(result.isFiltered).toBe(true);
    expect(result.cleanContent).toContain('[PHONE NUMBER REMOVED]');
  });

  test('filters email addresses', () => {
    const result = ContentFilterService.filterMessage('Email me at test@example.com');
    expect(result.isFiltered).toBe(true);
    expect(result.filteredWords).toContain('test@example.com');
  });

  test('filters WhatsApp mentions', () => {
    const result = ContentFilterService.filterMessage('Add me on whatsapp');
    expect(result.isFiltered).toBe(true);
  });

  test('does not filter normal conversation', () => {
    const result = ContentFilterService.filterMessage('The campaign looks great!');
    expect(result.isFiltered).toBe(false);
  });
});
```

**✅ Success Criteria:**
- [ ] Content filter service created
- [ ] Applied to message routes
- [ ] Tests pass for all patterns
- [ ] Warning messages clear

---

### **Day 3-4: Creator Discovery** 🔍

#### Task 2.1: Creator Discovery Endpoint

**File:** `/backend/src/routes/creators.ts`

```typescript
import express from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import CreatorProfile from '../models/CreatorProfile';

const router = express.Router();

/**
 * GET /api/creators/discover
 * Brand searches for verified creators
 */
router.get('/discover', authenticate, requireRole('brand'), async (req, res) => {
  try {
    const {
      verification_status,   // 'verified' | 'all'
      content_niche,          // 'fashion', 'tech', etc.
      primary_platform,       // 'TikTok', 'Instagram', 'YouTube'
      min_followers,
      max_rate,
      sort = 'followers',      // 'followers' | 'engagement' | 'rating'
      page = 1,
      limit = 20
    } = req.query;

    // Build filter query
    const filter: any = {};

    // Verification filter
    if (verification_status === 'verified') {
      filter['verificationDocs.status'] = 'approved';
    }

    // Content niche filter
    if (content_niche && content_niche !== 'all') {
      filter.category = content_niche;
    }

    // Platform filter
    if (primary_platform && primary_platform !== 'all') {
      filter['platforms.name'] = primary_platform;
    }

    // Minimum followers filter
    if (min_followers) {
      filter['platforms.followers'] = { $gte: parseInt(min_followers as string) };
    }

    // Maximum rate filter
    if (max_rate) {
      filter.minimumRate = { $lte: parseInt(max_rate as string) };
    }

    // Only show available creators
    filter.isAvailable = true;

    // Build sort query
    const sortMap: Record<string, any> = {
      followers: { 'platforms.followers': -1 },
      engagement: { 'platforms.engagementRate': -1 },
      rating: { 'stats.avgRating': -1 },
      recent: { createdAt: -1 }
    };
    const sortQuery = sortMap[sort as string] || sortMap.followers;

    // Execute query with pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const [creators, total] = await Promise.all([
      CreatorProfile.find(filter)
        .populate('userId', 'name avatar email isVettedProfile')
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit as string))
        .lean(),
      
      CreatorProfile.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        creators,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        },
        filters: {
          verification_status,
          content_niche,
          primary_platform,
          min_followers,
          max_rate
        }
      }
    });

  } catch (error) {
    console.error('Creator discovery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch creators'
    });
  }
});

export default router;
```

**✅ Success Criteria:**
- [ ] Endpoint returns filtered creators
- [ ] Pagination works correctly
- [ ] Sorting by followers/engagement works
- [ ] Only brands can access

---

### **Day 5-7: Campaign CRUD** 📋

#### Task 2.2: Campaign Management Endpoints

**File:** `/backend/src/routes/campaigns.ts`

```typescript
// CREATE Campaign (Brand only)
router.post('/', authenticate, requireRole('brand'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      platforms,
      requirements,
      budget,
      deadline
    } = req.body;

    // Validation
    if (!title || !description || !budget || !platforms?.length) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create campaign
    const campaign = await Campaign.create({
      brandId: req.user.id,
      title,
      description,
      category,
      platforms,
      requirements: {
        minFollowers: requirements?.minFollowers || 0,
        targetCategories: requirements?.targetCategories || [],
        contentType: requirements?.contentType,
        deliverables: requirements?.deliverables || 1
      },
      budget,
      paymentPerPost: budget / (requirements?.deliverables || 1),
      deadline: deadline ? new Date(deadline) : undefined,
      status: 'active',
      isVerified: req.user.isVettedProfile, // Auto-verify if brand is vetted
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      campaign
    });

  } catch (error) {
    console.error('Campaign creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create campaign'
    });
  }
});

// UPDATE Campaign (Brand owner only)
router.put('/:id', authenticate, requireRole('brand'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check ownership
    if (campaign.brandId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this campaign'
      });
    }

    // Can't update if already in progress
    if (campaign.status === 'in_progress' || campaign.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update campaign in progress or completed'
      });
    }

    const updated = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({
      success: true,
      campaign: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update campaign'
    });
  }
});

// More CRUD operations...
```

**✅ Success Criteria:**
- [ ] Brands can create campaigns
- [ ] Brands can only edit their own campaigns
- [ ] Validation prevents invalid data
- [ ] Cannot edit in-progress campaigns

---

## 📅 WEEK 2: Payment Integration

### **Day 8-10: Payment Provider Setup** 💳

#### Task 3.1: Chapa Integration

**Install SDK:**
```bash
cd backend
npm install chapa
```

**File:** `/backend/src/services/chapa.ts`

```typescript
import Chapa from 'chapa';

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY!
});

export class ChapaService {
  /**
   * Transfer money to creator's Chapa account
   */
  static async transfer(params: {
    account: string;
    amount: number;
    reference: string;
    currency?: string;
  }) {
    try {
      const response = await chapa.transfer({
        account_number: params.account,
        amount: params.amount,
        currency: params.currency || 'ETB',
        reference: params.reference,
        beneficiary_name: 'Creator Payout'
      });

      return {
        success: true,
        id: response.data.id,
        status: response.data.status
      };

    } catch (error) {
      console.error('Chapa transfer failed:', error);
      throw new Error('Payment transfer failed');
    }
  }

  /**
   * Verify Chapa account
   */
  static async verifyAccount(accountId: string) {
    // Implementation depends on Chapa API
    return { verified: true };
  }
}
```

#### Task 3.2: Telebirr Integration (H5 API)

**File:** `/backend/src/services/telebirr.ts`

```typescript
import axios from 'axios';
import crypto from 'crypto';

export class TelebirrService {
  private static readonly API_URL = process.env.TELEBIRR_API_URL!;
  private static readonly APP_ID = process.env.TELEBIRR_APP_ID!;
  private static readonly APP_KEY = process.env.TELEBIRR_APP_KEY!;

  /**
   * Transfer to Telebirr phone number
   */
  static async transfer(params: {
    recipient: string;
    amount: number;
    reference: string;
    description: string;
  }) {
    try {
      // Generate signature
      const timestamp = Date.now();
      const signature = this.generateSignature(params, timestamp);

      const response = await axios.post(
        `${this.API_URL}/transfer`,
        {
          appId: this.APP_ID,
          recipient: params.recipient,
          amount: params.amount,
          outTradeNo: params.reference,
          subject: params.description,
          timestamp,
          nonce: crypto.randomBytes(16).toString('hex')
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-APP-Key': this.APP_KEY,
            'X-Signature': signature
          }
        }
      );

      return {
        success: true,
        id: response.data.transId,
        status: response.data.code === '0' ? 'success' : 'pending'
      };

    } catch (error) {
      console.error('Telebirr transfer failed:', error);
      throw new Error('Payment transfer failed');
    }
  }

  private static generateSignature(params: any, timestamp: number): string {
    // Telebirr signature algorithm
    const signString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&') + `&timestamp=${timestamp}&key=${this.APP_KEY}`;
    
    return crypto.createHash('sha256').update(signString).digest('hex');
  }
}
```

**Environment Variables:**

```bash
# .env
CHAPA_SECRET_KEY=your_chapa_secret_key
CHAPA_PUBLIC_KEY=your_chapa_public_key

TELEBIRR_API_URL=https://openapi.et.telebirr.com
TELEBIRR_APP_ID=your_app_id
TELEBIRR_APP_KEY=your_app_key
```

**✅ Success Criteria:**
- [ ] Chapa SDK installed
- [ ] Telebirr H5 API integrated
- [ ] Environment variables set
- [ ] Test transfers work in sandbox

---

### **Day 11-14: Payout Endpoint** 💰

#### Task 3.3: Process Payout Logic

**File:** `/backend/src/routes/payments.ts`

```typescript
import express from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { ChapaService } from '../services/chapa';
import { TelebirrService } from '../services/telebirr';
import Campaign from '../models/Campaign';
import User from '../models/User';
import CreatorProfile from '../models/CreatorProfile';

const router = express.Router();

/**
 * POST /api/payments/process-payout
 * Release payment to creator after campaign completion
 */
router.post('/process-payout', authenticate, requireRole('brand', 'admin'), async (req, res) => {
  try {
    const { campaignId, creatorId } = req.body;

    // 1. Verify campaign exists and is completed
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    if (campaign.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Campaign must be completed before payout'
      });
    }

    // 2. Verify requester owns campaign or is admin
    if (req.user.role !== 'admin' && campaign.brandId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // 3. Check if already paid
    if (campaign.paymentStatus === 'released') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // 4. Get creator payment info
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }

    // 5. Determine payment provider
    const hasTelebirr = creator.paymentProviders?.telebirr?.isVerified;
    const hasChapa = creator.paymentProviders?.chapa?.isVerified;

    if (!hasTelebirr && !hasChapa) {
      return res.status(400).json({
        success: false,
        message: 'Creator has no verified payment method'
      });
    }

    // 6. Calculate amounts
    const grossAmount = campaign.paymentPerPost;
    const platformFee = grossAmount * 0.05; // 5% fee
    const netPayout = grossAmount - platformFee;

    // 7. Process transfer
    let transaction;
    const provider = hasTelebirr ? 'telebirr' : 'chapa';

    try {
      if (provider === 'telebirr') {
        transaction = await TelebirrService.transfer({
          recipient: creator.paymentProviders.telebirr!.phoneNumber,
          amount: netPayout,
          reference: `${campaignId}-${creatorId}-${Date.now()}`,
          description: `Create4Me: ${campaign.title}`
        });
      } else {
        transaction = await ChapaService.transfer({
          account: creator.paymentProviders.chapa!.accountId,
          amount: netPayout,
          reference: `${campaignId}-${creatorId}-${Date.now()}`,
          currency: 'ETB'
        });
      }

      // 8. Update campaign payment status
      await Campaign.findByIdAndUpdate(campaignId, {
        paymentStatus: 'released',
        payoutTransactionId: transaction.id,
        payoutDate: new Date(),
        payoutProvider: provider
      });

      // 9. Update creator earnings
      await CreatorProfile.findOneAndUpdate(
        { userId: creatorId },
        {
          $inc: { 
            'stats.totalEarnings': netPayout,
            'stats.completedCampaigns': 1
          }
        }
      );

      // 10. Send success response
      res.json({
        success: true,
        payout: {
          campaignId,
          creatorId,
          grossAmount,
          platformFee,
          netPayout,
          provider,
          transactionId: transaction.id,
          status: transaction.status,
          processedAt: new Date()
        }
      });

    } catch (paymentError) {
      // Payment failed - log and return error
      console.error('Payment transfer failed:', paymentError);
      
      await Campaign.findByIdAndUpdate(campaignId, {
        paymentStatus: 'failed',
        paymentError: (paymentError as Error).message
      });

      return res.status(500).json({
        success: false,
        message: 'Payment transfer failed. Please try again or contact support.'
      });
    }

  } catch (error) {
    console.error('Payout processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payout'
    });
  }
});

export default router;
```

**Testing:**

```bash
# Test payout endpoint
curl -X POST http://localhost:3001/api/payments/process-payout \
  -H "Authorization: Bearer BRAND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "campaign_id_here",
    "creatorId": "creator_id_here"
  }'
```

**✅ Success Criteria:**
- [ ] Payout endpoint created
- [ ] Platform fee (5%) calculated correctly
- [ ] Both Telebirr & Chapa supported
- [ ] Creator earnings updated
- [ ] Error handling for failed transfers

---

## 📊 Daily Checklist

**Every Day:**
- [ ] Git commit with clear message
- [ ] Update progress in project tracker
- [ ] Run `npm test` before committing
- [ ] Update documentation if API changes

**End of Week 1:**
- [ ] RBAC working on all routes
- [ ] Content filtering blocks external contact
- [ ] Creator discovery returns filtered results

**End of Week 2:**
- [ ] Payment providers configured
- [ ] Test payout successful in sandbox
- [ ] All tests passing

---

## 🚀 Deployment Checklist

**Before Production:**
- [ ] All environment variables set on Railway
- [ ] Chapa production keys configured
- [ ] Telebirr production credentials
- [ ] Database indexes created
- [ ] Error monitoring (Sentry) active
- [ ] Rate limiting enabled
- [ ] CORS configured correctly

---

**Next:** Would you like me to start implementing any of these tasks immediately?

1. **RBAC Middleware** (2 hours)
2. **User Model Migration** (1 hour)
3. **Content Filter Service** (3 hours)
4. **Creator Discovery Endpoint** (2 hours)
5. **Campaign CRUD** (4 hours)

Let me know and I'll create the code! 💪
