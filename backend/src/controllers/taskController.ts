import { Response } from 'express';
import prisma from '../database/prisma';
import { AuthRequest } from '../middleware/auth';

// Get all tasks for a campaign
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user?.id;

    // Ensure user has access to the campaign
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or you do not have access',
      });
    }

    const tasks = await prisma.task.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user?.id;
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    // Ensure user has access to the campaign
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or you do not have access',
      });
    }

    const task = await prisma.task.create({
      data: {
        campaignId,
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update a task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { campaign: true },
    });

    if (!task || task.campaign.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have access',
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { campaign: true },
    });

    if (!task || task.campaign.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have access',
      });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
