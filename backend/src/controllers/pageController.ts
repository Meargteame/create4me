import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import Page from "../models/Page";
import Campaign from "../models/Campaign";

// Create new page for a campaign
export const createPage = async (req: AuthRequest, res: Response) => {
  try {
    const { id: campaignId } = req.params;
    const { name, structureJson = {} } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid campaign ID" });
    }

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Page name is required" });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found or user not authorized",
      });
    }

    const page = await Page.create({
      campaignId,
      name,
      structureJson,
    });

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      page,
    });
  } catch (error) {
    console.error("Create page error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all pages for a campaign
export const getPages = async (req: AuthRequest, res: Response) => {
  try {
    const { id: campaignId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid campaign ID" });
    }

    // Verify campaign belongs to user to ensure authorization
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found or user not authorized",
      });
    }

    const pages = await Page.find({ campaignId }).sort({ createdAt: "asc" });

    res.json({
      success: true,
      pages,
    });
  } catch (error) {
    console.error("Get pages error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get a single page
export const getPage = async (req: AuthRequest, res: Response) => {
  try {
    const { pageId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid page ID" });
    }

    const page = await Page.findById(pageId);

    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    // Verify that the user owns the campaign this page belongs to
    const campaign = await Campaign.findOne({ _id: page.campaignId, userId });
    if (!campaign) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view this page" });
    }

    res.json({
      success: true,
      page,
    });
  } catch (error) {
    console.error("Get page error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update a page's details (e.g., name)
export const updatePage = async (req: AuthRequest, res: Response) => {
  try {
    const { pageId } = req.params;
    const { name } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid page ID" });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    const campaign = await Campaign.findOne({ _id: page.campaignId, userId });
    if (!campaign) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this page",
      });
    }

    const updatedPage = await Page.findByIdAndUpdate(
      pageId,
      { name },
      { new: true },
    );

    res.json({
      success: true,
      message: "Page updated successfully",
      page: updatedPage,
    });
  } catch (error) {
    console.error("Update page error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a page
export const deletePage = async (req: AuthRequest, res: Response) => {
  try {
    const { pageId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid page ID" });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    const campaign = await Campaign.findOne({ _id: page.campaignId, userId });
    if (!campaign) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this page",
      });
    }

    await Page.findByIdAndDelete(pageId);

    res.json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("Delete page error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update page structure (the main builder content)
export const updatePageStructure = async (req: AuthRequest, res: Response) => {
  try {
    const { pageId } = req.params;
    const { structureJson } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid page ID" });
    }

    if (!structureJson) {
      return res
        .status(400)
        .json({ success: false, message: "Structure data is required" });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    const campaign = await Campaign.findOne({ _id: page.campaignId, userId });
    if (!campaign) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this page structure",
      });
    }

    const updatedPage = await Page.findByIdAndUpdate(
      pageId,
      { structureJson },
      { new: true },
    );

    res.json({
      success: true,
      message: "Page structure updated successfully",
      page: updatedPage,
    });
  } catch (error) {
    console.error("Update page structure error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Publish a page
export const publishPage = async (req: AuthRequest, res: Response) => {
  try {
    const { id: pageId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid page ID" });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    // Verify campaign ownership
    const campaign = await Campaign.findOne({ _id: page.campaignId, userId });
    if (!campaign) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to publish this page",
      });
    }

    const updatedPage = await Page.findByIdAndUpdate(
      pageId,
      { isPublished: true, publishedAt: new Date() },
      { new: true },
    );

    res.json({
      success: true,
      message: "Page published successfully",
      page: updatedPage,
    });
  } catch (error) {
    console.error("Publish page error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
