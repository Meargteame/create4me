import express, { Response } from 'express';
import { Application } from '../models/Application';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();

// Apply to campaign
router.post('/', authenticate, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { campaignId, coverLetter, proposedPrice } = req.body;
    
    const existing = await Application.findOne({ campaignId, creatorId: req.userId });
    if (existing) {
      res.status(400).json({ success: false, message: 'Already applied to this campaign' });
      return;
    }
    
    const application = new Application({
      campaignId,
      creatorId: req.userId,
      coverLetter,
      proposedPrice
    });
    
    await application.save();
    res.status(201).json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get my applications
router.get('/my', authenticate, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ creatorId: req.userId })
      .populate('campaignId')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get campaign applicants (brand only)
router.get('/campaign/:campaignId', authenticate, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ campaignId: req.params.campaignId })
      .populate('creatorId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update application status
router.patch('/:id', authenticate, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }
    res.json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
