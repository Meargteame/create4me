import express, { Response } from 'express';
import { CreatorProfile } from '../models/CreatorProfile';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();

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
