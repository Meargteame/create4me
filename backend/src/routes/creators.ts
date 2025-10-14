import express from 'express';
import {
  getCreators,
  getCreatorById,
  likeCreator,
  bookmarkCreator,
  contactCreator
} from '../controllers/creatorController';
import { authenticate, requireBrand } from '../middleware/auth';

const router = express.Router();

// Brand-only routes (brands browsing and interacting with creators)
router.get('/', authenticate, requireBrand, getCreators);
router.get('/:id', authenticate, requireBrand, getCreatorById);
router.post('/:id/like', authenticate, requireBrand, likeCreator);
router.post('/:id/bookmark', authenticate, requireBrand, bookmarkCreator);
router.post('/:id/contact', authenticate, requireBrand, contactCreator);

export default router;
