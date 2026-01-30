import express, { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authenticate as requireAuth, AuthRequest } from '../middleware/auth';
import { requireRole as rbac } from '../middleware/auth';

const router = express.Router();

// Apply to a campaign
router.post('/', requireAuth, rbac(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const { campaignId, coverLetter, proposedPrice } = req.body;
    const creatorId = req.userId;

    // 1. Check campaign status
    const { data: campaign, error: campError } = await supabaseAdmin
      .from('campaigns')
      .select('status, brand_id, applications_count')
      .eq('id', campaignId)
      .single();

    if (campError || !campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Campaign is not active' });
    }

    // 2. Check existing application
    const { data: existingApp } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('creator_id', creatorId)
      .single();

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'Already applied' });
    }

    // 3. Create application
    const { data: newApp, error: appError } = await supabaseAdmin
      .from('applications')
      .insert({
        campaign_id: campaignId,
        creator_id: creatorId,
        brand_id: campaign.brand_id,
        cover_letter: coverLetter,
        proposed_price: proposedPrice,
        status: 'pending'
      })
      .select()
      .single();

    if (appError) throw appError;

    // 4. Update campaign stats (increment applications_count)
    await supabaseAdmin
      .from('campaigns')
      .update({ applications_count: (campaign.applications_count || 0) + 1 })
      .eq('id', campaignId);

    res.status(201).json({ success: true, application: newApp });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a single application by ID
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        campaign:campaigns(title, description, budget),
        creator:users!creator_id(name, email)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Access control
    const isCreator = application.creator_id === req.userId;
    const isBrandOwner = application.brand_id === req.userId;

    if (!isCreator && !isBrandOwner) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all applications for the logged-in creator
router.get('/my-applications', requireAuth, rbac(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        campaign:campaigns(*)
      `)
      .eq('creator_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get campaign applicants (brand only)
router.get('/campaign/:campaignId', requireAuth, rbac(['brand']), async (req: AuthRequest, res: Response) => {
  try {
    // Check ownership
    const { data: campaign } = await supabaseAdmin
      .from('campaigns')
      .select('brand_id')
      .eq('id', req.params.campaignId)
      .single();

    if (!campaign || campaign.brand_id !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        creator:users!creator_id(id, name, email),
        profile:creator_profiles!creator_id(avatar, username, display_name)
      `)
      .eq('campaign_id', req.params.campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update application status
router.patch('/:id', requireAuth, rbac(['brand']), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // 1. Get application & verify ownership
    const { data: application } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.brand_id !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // 2. Update status
    const { data: updatedApp, error } = await supabaseAdmin
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // 3. If accepted, add to campaign selected creators
    if (status === 'accepted') {
      const { data: campaign } = await supabaseAdmin
        .from('campaigns')
        .select('selected_creators, status')
        .eq('id', application.campaign_id)
        .single();

      if (campaign) {
        const creators = campaign.selected_creators || [];
        if (!creators.includes(application.creator_id)) {
          creators.push(application.creator_id);

          await supabaseAdmin
            .from('campaigns')
            .update({
              selected_creators: creators,
              status: campaign.status === 'active' ? 'in_progress' : campaign.status
            })
            .eq('id', application.campaign_id);
        }
      }
    }

    res.json({ success: true, application: updatedApp });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
