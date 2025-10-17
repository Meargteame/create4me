import express from "express";
import {
  getCreators,
  getCreatorById,
  likeCreator,
  bookmarkCreator,
  contactCreator,
} from "../controllers/creatorController";
import { authenticate, requireBrand } from "../middleware/auth";

const router = express.Router();

// Public routes (anyone can browse creators)
router.get("/", getCreators);
router.get("/:id", getCreatorById);

// Brand-only routes (brands interacting with creators - requires auth)
router.post("/:id/like", authenticate, requireBrand, likeCreator);
router.post("/:id/bookmark", authenticate, requireBrand, bookmarkCreator);
router.post("/:id/contact", authenticate, requireBrand, contactCreator);

export default router;
