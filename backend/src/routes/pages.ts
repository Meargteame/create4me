import express from 'express';
import {
  createPage,
  getPages,
  getPage,
  updatePage,
  deletePage,
  publishPage,
} from '../controllers/pageController';
import { authenticate, requireBrand } from '../middleware/auth';

const router = express.Router();

// Brand-only routes (managing campaign pages/landing pages)
router.get('/:id', authenticate, requireBrand, getPage);
router.put('/:id', authenticate, requireBrand, updatePage);
router.delete('/:id', authenticate, requireBrand, deletePage);
router.post('/:id/publish', authenticate, requireBrand, publishPage);

export default router;
