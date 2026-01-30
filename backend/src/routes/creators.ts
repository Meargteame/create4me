import express, { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authenticate as requireAuth, AuthRequest } from '../middleware/auth';
import { requireRole as rbac } from '../middleware/auth';

const router = express.Router();

/**
 * CREATOR DISCOVERY ENDPOINT (Brand Dashboard)
 */
router.get('/discover', requireAuth, rbac(['brand']), async (req: AuthRequest, res: Response) => {
  try {
    const {
      verification_status,
      content_niche,
      primary_platform,
      min_followers,
      sort = 'followers',
      page = 1,
      limit = 20
    } = req.query;

    let query = supabaseAdmin
      .from('creator_profiles')
      .select(`
        *,
        user:user_id(name, email, is_vetted_profile)
      `, { count: 'exact' });

    // 1. Apply Filters

    // Status
    if (verification_status === 'verified') {
      query = query.eq('is_verified', true);
    }

    // Niche (category)
    if (content_niche && content_niche !== 'all') {
      // Assuming naive string match or ILIKE if category is text
      query = query.ilike('category', `%${content_niche}%`);
    }

    // Platform (array containment)
    if (primary_platform && primary_platform !== 'all') {
      query = query.contains('platforms', [primary_platform]);
    }

    // Followers
    if (min_followers) {
      query = query.gte('followers', parseInt(min_followers as string));
    }

    // Availability - Always filter for availability in discover
    query = query.eq('is_available', true);

    // 2. Sorting
    switch (sort) {
      case 'followers':
        query = query.order('followers', { ascending: false });
        break;
      case 'engagement':
        query = query.order('engagement', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'recent':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('followers', { ascending: false });
    }

    // 3. Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    query = query.range(from, to);

    const { data: creators, count, error } = await query;

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        creators,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all creators (public)
router.get('/', async (req, res): Promise<void> => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    let query = supabaseAdmin
      .from('creator_profiles')
      .select(`
        *,
        user:user_id(name, email)
      `, { count: 'exact' });

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.or(`display_name.ilike.${searchTerm},username.ilike.${searchTerm},bio.ilike.${searchTerm}`);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const from = (pageNum - 1) * limitNum;

    query = query
      .range(from, from + limitNum - 1)
      .order('created_at', { ascending: false });

    const { data: creators, count, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: creators,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single creator
router.get('/:id', async (req, res): Promise<void> => {
  try {
    // 1. Fetch creator
    const { data: creator, error } = await supabaseAdmin
      .from('creator_profiles')
      .select(`
        *,
        user:user_id(name, email)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    // 2. Increment view count (fire and forget)
    // We handle the promise to avoid unhandled rejections, but don't await response
    supabaseAdmin.rpc('increment_profile_views', { profile_id: req.params.id })
      .then(({ error }) => {
        if (error) console.error('Error incrementing views:', error);
      });

    res.json({ success: true, creator });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update own profile
router.put('/profile', requireAuth, rbac(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    // Upsert profile based on user_id
    const { data: profile, error } = await supabaseAdmin
      .from('creator_profiles')
      .upsert({
        user_id: req.userId,
        ...req.body,
        last_active: new Date()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get own profile
router.get('/profile/me', requireAuth, rbac(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('creator_profiles')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
