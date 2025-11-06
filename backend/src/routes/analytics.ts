import express, { Response } from 'express';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { User } from '../models/User';
import { CreatorProfile } from '../models/CreatorProfile';
import { Campaign } from '../models/Campaign';
import { Application } from '../models/Application';

const router = express.Router();

// Get user dashboard analytics
router.get('/dashboard', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    if (user.role === 'brand') {
      // Brand analytics
      const campaigns = await Campaign.find({ userId: req.userId });
      const campaignIds = campaigns.map(c => c._id);
      
      const applications = await Application.find({ campaignId: { $in: campaignIds } });
      
      const stats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        acceptedApplications: applications.filter(a => a.status === 'accepted').length,
        completedCampaigns: campaigns.filter(c => c.status === 'completed').length
      };
      
      res.json({ success: true, stats, role: 'brand' });
    } else {
      // Creator analytics
      const profile = await CreatorProfile.findOne({ userId: req.userId });
      const applications = await Application.find({ creatorId: req.userId });
      
      const stats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        acceptedApplications: applications.filter(a => a.status === 'accepted').length,
        rejectedApplications: applications.filter(a => a.status === 'rejected').length,
        profileViews: profile?.profileViews || 0,
        rating: profile?.rating || 0,
        completedCampaigns: profile?.completedCampaigns || 0
      };
      
      res.json({ success: true, stats, role: 'creator' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get platform analytics (admin only)
router.get('/platform', authenticate, requireRole(['admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCreators = await User.countDocuments({ role: 'creator' });
    const totalBrands = await User.countDocuments({ role: 'brand' });
    const totalCampaigns = await Campaign.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    
    const stats = {
      totalUsers,
      totalCreators,
      totalBrands,
      totalCampaigns,
      activeCampaigns,
      totalApplications
    };
    
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get campaign analytics
router.get('/campaign/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }
    
    // Check ownership
    if (campaign.userId.toString() !== req.userId) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }
    
    const applications = await Application.find({ campaignId: campaign._id });
    
    const stats = {
      views: (campaign as any).views || 0,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'pending').length,
      acceptedApplications: applications.filter(a => a.status === 'accepted').length,
      rejectedApplications: applications.filter(a => a.status === 'rejected').length
    };
    
    res.json({ success: true, stats, campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get creator analytics
router.get('/creator/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await CreatorProfile.findById(req.params.id);
    
    if (!profile) {
      res.status(404).json({ success: false, message: 'Creator not found' });
      return;
    }
    
    const applications = await Application.find({ creatorId: profile.userId });
    
    const stats = {
      profileViews: profile.profileViews,
      followers: profile.followers,
      engagement: profile.engagement,
      rating: profile.rating,
      completedCampaigns: profile.completedCampaigns,
      totalApplications: applications.length,
      acceptedApplications: applications.filter(a => a.status === 'accepted').length,
      successRate: applications.length > 0 
        ? (applications.filter(a => a.status === 'accepted').length / applications.length * 100).toFixed(1)
        : 0
    };
    
    res.json({ success: true, stats, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
