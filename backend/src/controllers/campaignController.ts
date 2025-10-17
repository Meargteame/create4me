import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Campaign from "../models/Campaign";
import mongoose from "mongoose";

// Create new campaign
export const createCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?._id; // Mongoose uses _id

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const campaign = await Campaign.create({
      userId,
      title,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign,
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all user campaigns
export const getCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const campaigns = await Campaign.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all campaigns for any user (for creator campaign board)
export const getAllCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "id name email")
      .lean();

    // Transform campaigns to match frontend expectations
    const transformedCampaigns = campaigns.map((campaign: any) => ({
      id: campaign._id.toString(),
      title: campaign.title,
      description: campaign.description,
      createdAt: campaign.createdAt,
      budget: campaign.budget,
      deadline: campaign.deadline,
      category: campaign.category,
      user: campaign.userId || { email: "unknown@example.com" },
    }));

    res.json({
      success: true,
      campaigns: transformedCampaigns,
    });
  } catch (error) {
    console.error("Get all campaigns error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get single campaign
export const getCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid campaign ID" });
    }

    const campaign = await Campaign.findOne({
      _id: id,
      userId,
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found or user not authorized",
      });
    }

    res.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Get campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update campaign
export const updateCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid campaign ID" });
    }

    const updatedCampaign = await Campaign.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        title,
        description,
      },
      { new: true }, // Return the updated document
    );

    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found or user not authorized",
      });
    }

    res.json({
      success: true,
      message: "Campaign updated successfully",
      campaign: updatedCampaign,
    });
  } catch (error) {
    console.error("Update campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete campaign
export const deleteCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid campaign ID" });
    }

    const deletedCampaign = await Campaign.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedCampaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found or user not authorized",
      });
    }

    // Optional: Also delete associated pages and tasks
    // await Page.deleteMany({ campaignId: id });
    // await Task.deleteMany({ campaignId: id });

    res.json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Delete campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
