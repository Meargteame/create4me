import express, { Response } from 'express';
import { Campaign } from '../models/Campaign';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all campaigns (public for browsing)
router.get('/all', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ status: 'active' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, campaigns });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get brand's own campaigns
router.get('/', authenticate, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, campaigns });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create campaign
router.post('/', authenticate, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = new Campaign({
      ...req.body,
      userId: req.userId
    });
    await campaign.save();
    res.status(201).json({ success: true, campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single campaign
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('userId', 'name email');
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }
    res.json({ success: true, campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update campaign
router.put('/:id', authenticate, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }
    res.json({ success: true, campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete campaign
router.delete('/:id', authenticate, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
