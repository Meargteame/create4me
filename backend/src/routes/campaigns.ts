import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  getAllCampaigns,
} from "../controllers/campaignController";
import { authenticate, requireBrand } from "../middleware/auth";

const router = express.Router();

// Public/authenticated routes - any authenticated user can view campaigns
router.get("/all", authenticate, getAllCampaigns); // All campaigns for browsing
router.get("/:id", authenticate, getCampaign); // Single campaign details

// Brand-only routes (creating, updating, deleting campaigns)
router.post("/", authenticate, requireBrand, createCampaign);
router.put("/:id", authenticate, requireBrand, updateCampaign);
router.delete("/:id", authenticate, requireBrand, deleteCampaign);

// Brand routes (get their own campaigns)
router.get("/", authenticate, requireBrand, getCampaigns);

export default router;
