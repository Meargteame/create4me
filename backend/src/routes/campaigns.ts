import express, { Request, Response } from 'express';
import { Campaign } from '../models/Campaign';
import { authenticate as requireAuth } from '../middleware/auth';
import { requireRole as rbac, AuthenticatedRequest } from '../middleware/rbac';
import { Application } from '../models/Application';

const router = express.Router();

// Get all campaigns with optional filtering
router.get('/all', requireAuth, async (req: Request, res: Response) => {
    try {
        const campaigns = await Campaign.find(req.query);
        res.status(200).json({ campaigns });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaigns', error });
    }
});

// Get campaigns for the logged-in brand
router.get('/', requireAuth, rbac('brand'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const campaigns = await Campaign.find({ brandId: req.user?.id });
        res.status(200).json({ campaigns });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaigns', error });
    }
});

// Create a new campaign
router.post('/', requireAuth, rbac('brand'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const newCampaign = new Campaign({
            ...req.body,
            brandId: req.user?.id,
        });
        await newCampaign.save();
        res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
    } catch (error) {
        res.status(500).json({ message: 'Error creating campaign', error });
    }
});

// Get a specific campaign by ID
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json({ campaign });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaign', error });
    }
});

// Update a campaign
router.put('/:id', requireAuth, rbac('brand'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const updatedCampaign = await Campaign.findOneAndUpdate(
            { _id: req.params.id, brandId: req.user?.id },
            req.body,
            { new: true }
        );
        if (!updatedCampaign) {
            return res.status(404).json({ message: 'Campaign not found or you do not have permission to update it' });
        }
        res.status(200).json({ message: 'Campaign updated successfully', campaign: updatedCampaign });
    } catch (error) {
        res.status(500).json({ message: 'Error updating campaign', error });
    }
});

// Delete a campaign
router.delete('/:id', requireAuth, rbac('brand'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const deletedCampaign = await Campaign.findOneAndDelete({ _id: req.params.id, brandId: req.user?.id });
        if (!deletedCampaign) {
            return res.status(404).json({ message: 'Campaign not found or you do not have permission to delete it' });
        }
        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting campaign', error });
    }
});

// Apply to a campaign
router.post('/:campaignId/apply', requireAuth, rbac('creator'), async (req: AuthenticatedRequest, res: Response) => {
    const { campaignId } = req.params;
    const creatorId = req.user?.id;

    try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Check if creator has already applied
        const existingApplication = await Application.findOne({ campaignId, creatorId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this campaign' });
        }

        const newApplication = new Application({
            campaignId,
            creatorId,
            brandId: campaign.brandId,
            status: 'pending',
        });

        await newApplication.save();

        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });

    } catch (error) {
        console.error('Error applying to campaign:', error);
        res.status(500).json({ message: 'Server error applying to campaign' });
    }
});

export default router;
