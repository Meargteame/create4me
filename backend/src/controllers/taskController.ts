import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import Task from "../models/Task";
import Campaign from "../models/Campaign";

// Get all tasks for a campaign
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid campaign ID" });
    }

    // Ensure user has access to the campaign
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found or user not authorized",
      });
    }

    const tasks = await Task.find({ campaignId }).sort({ createdAt: "desc" });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create a new task for a campaign
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { campaignId } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid campaign ID" });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Task title is required" });
    }

    // Ensure user has access to the campaign
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found or user not authorized",
      });
    }

    const task = await Task.create({
      campaignId,
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update an existing task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?._id;
    const { title, description, status, priority, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Check if the user owns the campaign this task belongs to
    const campaign = await Campaign.findOne({ _id: task.campaignId, userId });
    if (!campaign) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to update this task",
        });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Check if the user owns the campaign this task belongs to
    const campaign = await Campaign.findOne({ _id: task.campaignId, userId });
    if (!campaign) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this task",
        });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
