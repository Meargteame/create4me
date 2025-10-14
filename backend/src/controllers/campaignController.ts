import { Response } from 'express';
import prisma from '../database/prisma';
import { AuthRequest } from '../middleware/auth';

// Create new campaign
export const createCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const campaign = await prisma.campaign.create({
      data: {
        userId: userId!,
        title,
        description,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign,
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all user campaigns
export const getCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const campaigns = await prisma.campaign.findMany({
      where: { userId: userId! },
      orderBy: { createdAt: 'desc' },
      include: {
        pages: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });

    res.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all campaigns for any user (for creator campaign board)
export const getAllCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { // Include brand/user info
          select: {
            id: true,
            email: true,
          }
        }
      },
    });

    res.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error('Get all campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get single campaign
export const getCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        userId: userId!,
      },
      include: {
        pages: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    res.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update campaign
export const updateCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user?.id;

    const campaign = await prisma.campaign.updateMany({
      where: {
        id,
        userId: userId!,
      },
      data: {
        title,
        description,
      },
    });

    if (campaign.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or user not authorized',
      });
    }

    res.json({
      success: true,
      message: 'Campaign updated successfully',
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete campaign
export const deleteCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const campaign = await prisma.campaign.deleteMany({
      where: {
        id,
        userId: userId!,
      },
    });

    if (campaign.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or user not authorized',
      });
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
