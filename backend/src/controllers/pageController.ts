import { Response } from 'express';
import prisma from '../database/prisma';
import { AuthRequest } from '../middleware/auth';

// Create new page for campaign
export const createPage = async (req: AuthRequest, res: Response) => {
  try {
    const { id: campaignId } = req.params;
    const { name, structureJson = {} } = req.body;
    const userId = req.user?.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Page name is required',
      });
    }

    // Verify campaign belongs to user
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        userId: userId!,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    const page = await prisma.page.create({
      data: {
        campaignId,
        name,
        structureJson,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      page,
    });
  } catch (error) {
    console.error('Create page error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all pages for a campaign
export const getPages = async (req: AuthRequest, res: Response) => {
  try {
    const { id: campaignId } = req.params;
    const userId = req.user?.id;

    // Verify campaign belongs to user
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        userId: userId!,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    const pages = await prisma.page.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      pages,
    });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get single page
export const getPage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.page.findFirst({
      where: { id },
      include: {
        campaign: {
          select: {
            id: true,
            userId: true,
            title: true,
          },
        },
      },
    });

    if (!page || page.campaign.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    res.json({
      success: true,
      page,
    });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update page structure/content
export const updatePage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, structureJson } = req.body;
    const userId = req.user?.id;

    // Check if page exists and belongs to user
    const existingPage = await prisma.page.findFirst({
      where: { id },
      include: {
        campaign: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!existingPage || existingPage.campaign.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(structureJson && { structureJson }),
      },
    });

    res.json({
      success: true,
      message: 'Page updated successfully',
      page,
    });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete page
export const deletePage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if page exists and belongs to user
    const existingPage = await prisma.page.findFirst({
      where: { id },
      include: {
        campaign: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!existingPage || existingPage.campaign.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    await prisma.page.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Publish page - convert to static HTML/JSON
export const publishPage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.page.findFirst({
      where: { id },
      include: {
        campaign: {
          select: {
            userId: true,
            title: true,
          },
        },
      },
    });

    if (!page || page.campaign.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    // Here you would implement the logic to convert the page structure
    // to static HTML or a publishable format
    const publishedData = {
      name: page.name,
      structure: page.structureJson,
      publishedAt: new Date().toISOString(),
      campaignTitle: page.campaign.title,
    };

    res.json({
      success: true,
      message: 'Page published successfully',
      publishedData,
    });
  } catch (error) {
    console.error('Publish page error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
