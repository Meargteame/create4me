import express from 'express';
import { uploadAvatar, uploadPortfolioImage, uploadCampaignImage } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All upload routes require authentication
router.post('/avatar', authenticateToken, uploadAvatar);
router.post('/portfolio', authenticateToken, uploadPortfolioImage);
router.post('/campaign', authenticateToken, uploadCampaignImage);

export default router;
