import express from 'express';
import {
  getRegistrationStats,
  getPlatformStats,
  getCreatorAnalytics,
  getBrandAnalytics
} from '../controllers/analyticsController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// Registration statistics - admin only
router.get('/registrations', authenticate, requireRole(['admin']), getRegistrationStats);

// Platform statistics - admin only
router.get('/platform', authenticate, requireRole(['admin']), getPlatformStats);

// Creator analytics - creator can view their own, admin can view any
router.get('/creator/:creatorId', authenticate, getCreatorAnalytics);

// Brand analytics - brand can view their own, admin can view any
router.get('/brand/:brandId', authenticate, getBrandAnalytics);

export default router;
