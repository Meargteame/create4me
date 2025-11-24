import express, { Response } from 'express';
import { Application } from '../models/Application';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { Campaign } from '../models/Campaign';
import mongoose from 'mongoose';

const router = express.Router();

// Apply to a campaign
router.post('/', authenticate, requireRole('creator'), async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { campaignId, coverLetter, proposedPrice } = req.body;
    const creatorId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ success: false, message: 'Invalid campaign ID.' });
    }

    const campaign = await Campaign.findById(campaignId).session(session);
    if (!campaign) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    if (campaign.status !== 'active') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: 'This campaign is not active and is not accepting applications.' });
    }

    const existingApplication = await Application.findOne({ campaignId, creatorId }).session(session);
    if (existingApplication) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'You have already applied to this campaign.' });
    }

    const application = new Application({
      campaignId,
      creatorId,
      coverLetter,
      proposedPrice,
      brandId: campaign.brandId,
    });

    await application.save({ session });

    campaign.applicationsCount += 1;
    await campaign.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, application });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: `An error occurred: ${error.message}` });
  }
});

// Get a single application by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('campaignId', 'title description budget')
            .populate('creatorId', 'name email profile.avatar');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Security check: only creator or brand owner can view
        const isCreator = application.creatorId._id.toString() === req.userId;
        const campaign = await Campaign.findById(application.campaignId._id);
        const isBrandOwner = campaign?.brandId.toString() === req.userId;

        if (!isCreator && !isBrandOwner) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.json({ success: true, application });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all applications for the logged-in creator
router.get('/my-applications', authenticate, requireRole('creator'), async (req: AuthRequest, res: Response) => {
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
router.get('/campaign/:campaignId', authenticate, requireRole('brand'), async (req: AuthRequest, res: Response): Promise<void> => {
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
router.patch('/:id', authenticate, requireRole('brand'), async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['accepted', 'rejected'].includes(status)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: 'Invalid status. Must be "accepted" or "rejected".' });
    }

    const application = await Application.findById(id).session(session);

    if (!application) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const campaign = await Campaign.findById(application.campaignId).session(session);
    if (!campaign) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ success: false, message: 'Associated campaign not found.' });
    }

    // Authorization: ensure the user is the brand owner of the campaign
    if (campaign.brandId.toString() !== req.userId) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ success: false, message: 'You are not authorized to update this application.' });
    }

    // Prevent status change if already decided
    if (application.status === 'accepted' || application.status === 'rejected') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: `Application has already been ${application.status}.` });
    }

    application.status = status;

    if (status === 'accepted') {
        campaign.selectedCreators = campaign.selectedCreators || [];
        if (!campaign.selectedCreators.includes(application.creatorId)) {
            campaign.selectedCreators.push(application.creatorId);
        }
        // Optionally, update campaign status if this is the first accepted creator
        if (campaign.status === 'active') {
            campaign.status = 'in_progress';
        }
    }

    await application.save({ session });
    await campaign.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, application, campaign });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: `An error occurred: ${error.message}` });
  }
});

export default router;
