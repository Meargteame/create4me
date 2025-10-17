import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import Campaign from "../models/Campaign";
import CampaignApplication from "../models/CampaignApplication";

// Apply to a campaign
export const applyToCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { campaignId } = req.params;
    const { coverLetter, portfolioLink, deliverables } = req.body;
    const creatorId = req.user?._id;

    if (!creatorId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    if (req.user?.role !== "creator") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only creators can apply to campaigns.",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid campaign ID" });
    }

    if (!coverLetter || coverLetter.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cover letter is required" });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    }

    const existingApplication = await CampaignApplication.findOne({
      campaignId,
      creatorId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already applied to this campaign",
        });
    }

    const application = await CampaignApplication.create({
      campaignId,
      creatorId,
      coverLetter,
      portfolioLink,
      deliverables,
    });

    res.status(201).json({
      success: true,
      message: "Successfully applied to campaign",
      application,
    });
  } catch (error) {
    console.error("Apply to campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all applications for a campaign (for brands)
export const getCampaignApplicants = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid campaign ID" });
    }

    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) {
      return res
        .status(404)
        .json({ message: "Campaign not found or you are not the owner" });
    }

    const applicants = await CampaignApplication.find({ campaignId }).populate(
      "creatorId",
      "name email",
    );

    res.json({ success: true, applicants });
  } catch (error) {
    console.error("Get applicants error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all applications for a creator
export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const creatorId = req.user?._id;

    if (!creatorId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const applications = await CampaignApplication.find({ creatorId })
      .populate("campaignId", "title")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update application status (for brands)
export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const userId = req.user?._id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid application ID" });
    }

    const application = await CampaignApplication.findById(
      applicationId,
    ).populate<{ campaignId: { userId: mongoose.Types.ObjectId } }>(
      "campaignId",
    );

    if (
      !application ||
      !application.campaignId ||
      application.campaignId.userId.toString() !== userId?.toString()
    ) {
      return res
        .status(404)
        .json({ message: "Application not found or you are not authorized" });
    }

    const updatedApplication = await CampaignApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true },
    );

    res.json({ success: true, application: updatedApplication });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
