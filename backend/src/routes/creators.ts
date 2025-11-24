import express, { Response } from 'express';
import { CreatorProfile } from '../models/CreatorProfile';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();

/**
 * CREATOR DISCOVERY ENDPOINT (Brand Dashboard)
 * GET /api/creators/discover
 * Protected: Brand role only
 * 
 * Powers the Brand Dashboard search and vetting process
 * Supports filtering by:
 * - verification_status: 'verified' or 'all'
 * - content_niche: category field (e.g., 'fashion', 'tech')
 * - primary_platform: platform name (e.g., 'TikTok', 'Instagram')
 * - min_followers: minimum follower count
 * - max_rate: maximum creator rate
 */
router.get('/discover', authenticate, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      verification_status,   // 'verified' | 'all'
      content_niche,          // 'fashion', 'tech', 'lifestyle', etc.
      primary_platform,       // 'TikTok', 'Instagram', 'YouTube'
      min_followers,
      max_rate,
      sort = 'followers',      // 'followers' | 'engagement' | 'rating' | 'recent'
      page = 1,
      limit = 20
    } = req.query;

    // Build filter query
    const filter: any = {};

    // Verification status filter
    if (verification_status === 'verified') {
      filter['verificationDocs.status'] = 'approved';
    }

    // Content niche filter
    if (content_niche && content_niche !== 'all') {
      filter.category = content_niche;
    }

    // Primary platform filter
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

    // Calculate pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Execute query
    const [creators, total] = await Promise.all([
      CreatorProfile.find(filter)
        .populate('userId', 'name email avatar isVettedProfile')
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit as string))
        .lean(),

      CreatorProfile.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / parseInt(limit as string));

    res.json({
      success: true,
      data: {
        creators,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages,
          hasNextPage: parseInt(page as string) < totalPages,
          hasPrevPage: parseInt(page as string) > 1
        },
        filters: {
          verification_status: verification_status || 'all',
          content_niche: content_niche || 'all',
          primary_platform: primary_platform || 'all',
          min_followers: min_followers ? parseInt(min_followers as string) : null,
          max_rate: max_rate ? parseInt(max_rate as string) : null,
          sort
        }
      }
    });

  } catch (error: any) {
    console.error('Creator discovery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch creators',
      error: error.message
    });
  }
});

// Get all creators (public)
router.get('/', async (req, res): Promise<void> => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const creators = await CreatorProfile.find(query)
      .populate('userId', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await CreatorProfile.countDocuments(query);

    res.json({
      success: true,
      data: creators,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single creator (increment views)
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const creator = await CreatorProfile.findByIdAndUpdate(
      req.params.id,
      { $inc: { profileViews: 1 } },
      { new: true }
    ).populate('userId', 'name email');

    if (!creator) {
      res.status(404).json({ success: false, message: 'Creator not found' });
      return;
    }
    res.json({ success: true, creator });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update own creator profile
router.put('/profile', authenticate, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await CreatorProfile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, lastActive: new Date() },
      { new: true, upsert: true }
    );

    res.json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get own creator profile
router.get('/profile/me', authenticate, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await CreatorProfile.findOne({ userId: req.userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }
    res.json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add portfolio item
router.post('/profile/portfolio', authenticate, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, url, title, description, thumbnail } = req.body;

    const profile = await CreatorProfile.findOneAndUpdate(
      { userId: req.userId },
      {
        $push: {
          portfolioItems: { type, url, title, description, thumbnail }
        },
        lastActive: new Date()
      },
      { new: true }
    );

    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    res.json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete portfolio item
router.delete('/profile/portfolio/:itemId', authenticate, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await CreatorProfile.findOneAndUpdate(
      { userId: req.userId },
      {
        $pull: { portfolioItems: { _id: req.params.itemId } },
        lastActive: new Date()
      },
      { new: true }
    );

    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    res.json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
