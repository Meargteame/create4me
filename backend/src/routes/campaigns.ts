import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  getAllCampaigns,
} from '../controllers/campaignController';
import { authenticate, requireBrand, requireCreator } from '../middleware/auth';

const router = express.Router();

// Brand-only routes (creating, updating, deleting campaigns)
router.post('/', authenticate, requireBrand, createCampaign);
router.put('/:id', authenticate, requireBrand, updateCampaign);
router.delete('/:id', authenticate, requireBrand, deleteCampaign);

// Brand routes (get their own campaigns)
router.get('/', authenticate, requireBrand, getCampaigns);

// Creator routes (browse all campaigns)
router.get('/all', authenticate, requireCreator, getAllCampaigns);

// Both brands and creators can view campaign details
router.get('/:id', authenticate, getCampaign);

export default router;
