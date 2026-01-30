import express, { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authenticate as requireAuth, AuthRequest } from '../middleware/auth';
import { requireRole as rbac } from '../middleware/auth';

const router = express.Router();

// Get all campaigns with optional filtering
router.get('/all', requireAuth, async (req: Request, res: Response) => {
    try {
        const { data: campaigns, error } = await supabaseAdmin.from('campaigns').select('*');
        if (error) throw error;
        res.status(200).json({ campaigns });
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
    }
});

// Get campaigns for the logged-in brand
router.get('/', requireAuth, rbac(['brand']), async (req: AuthRequest, res: Response) => {
    try {
        const { data: campaigns, error } = await supabaseAdmin
            .from('campaigns')
            .select('*')
            .eq('brand_id', req.userId); // Note: using snake_case column names

        if (error) throw error;
        res.status(200).json({ campaigns });
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
    }
});

// Create a new campaign
router.post('/', requireAuth, rbac(['brand']), async (req: AuthRequest, res: Response) => {
    try {
        // Map camelCase body to snake_case db columns
        const campaignData = {
            user_id: req.userId,
            brand_id: req.userId,
            title: req.body.title,
            description: req.body.description,
            budget: req.body.budget,
            category: req.body.category,
            requirements: req.body.requirements,
            deliverables: req.body.deliverables,
            deadline: req.body.deadline,
            cover_image: req.body.coverImage,
            target_audience: req.body.targetAudience,
            platforms: req.body.platforms,
            content_type: req.body.contentType,
            status: 'active'
        };

        const { data: newCampaign, error } = await supabaseAdmin
            .from('campaigns')
            .insert(campaignData)
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating campaign', error: error.message });
    }
});

// Get a specific campaign by ID
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const { data: campaign, error } = await supabaseAdmin
            .from('campaigns')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json({ campaign });
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching campaign', error: error.message });
    }
});

// Update a campaign
router.put('/:id', requireAuth, rbac(['brand']), async (req: AuthRequest, res: Response) => {
    try {
        // Map updates to snake_case
        const updates: any = {};
        if (req.body.title) updates.title = req.body.title;
        if (req.body.description) updates.description = req.body.description;
        if (req.body.budget) updates.budget = req.body.budget;
        if (req.body.status) updates.status = req.body.status;
        if (req.body.coverImage) updates.cover_image = req.body.coverImage;

        const { data: updatedCampaign, error } = await supabaseAdmin
            .from('campaigns')
            .update(updates)
            .eq('id', req.params.id)
            .eq('brand_id', req.userId)
            .select()
            .single();

        if (error || !updatedCampaign) {
            return res.status(404).json({ message: 'Campaign not found or permission denied' });
        }
        res.status(200).json({ message: 'Campaign updated successfully', campaign: updatedCampaign });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating campaign', error: error.message });
    }
});

// Delete a campaign
router.delete('/:id', requireAuth, rbac(['brand']), async (req: AuthRequest, res: Response) => {
    try {
        const { error } = await supabaseAdmin
            .from('campaigns')
            .delete()
            .eq('id', req.params.id)
            .eq('brand_id', req.userId);

        if (error) throw error;
        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting campaign', error: error.message });
    }
});

// Apply to a campaign
router.post('/:campaignId/apply', requireAuth, rbac(['creator']), async (req: AuthRequest, res: Response) => {
    const { campaignId } = req.params;
    const creatorId = req.userId;

    try {
        // Check if campaign exists
        const { data: campaign, error: campError } = await supabaseAdmin
            .from('campaigns')
            .select('brand_id')
            .eq('id', campaignId)
            .single();

        if (campError || !campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Check for existing application
        const { data: existingApp } = await supabaseAdmin
            .from('applications')
            .select('id')
            .eq('campaign_id', campaignId)
            .eq('creator_id', creatorId)
            .single();

        if (existingApp) {
            return res.status(400).json({ message: 'You have already applied' });
        }

        const { data: newApplication, error: appError } = await supabaseAdmin
            .from('applications')
            .insert({
                campaign_id: campaignId,
                creator_id: creatorId,
                brand_id: campaign.brand_id,
                status: 'pending',
                cover_letter: req.body.coverLetter,
                proposed_price: req.body.proposedPrice
            })
            .select()
            .single();

        if (appError) throw appError;

        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });

    } catch (error: any) {
        console.error('Error applying:', error);
        res.status(500).json({ message: 'Server error applying to campaign' });
    }
});

export default router;
