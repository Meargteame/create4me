import { Response } from 'express';
import prisma from '../database/prisma';
import { AuthRequest } from '../middleware/auth';

// Apply to a campaign
export const applyToCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { campaignId } = req.params;
    const { coverLetter, portfolioLink, deliverables } = req.body;
    const creatorId = req.user?.id;

    if (!creatorId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    // Check if user is a creator
    if (req.user?.role !== 'creator') {
        return res.status(403).json({ success: false, message: 'Only creators can apply to campaigns.' });
    }

    // Validate required fields
    if (!coverLetter || coverLetter.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Cover letter is required' });
    }

    // Check if campaign exists
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Check if already applied
    const existingApplication = await prisma.campaignApplication.findFirst({
      where: {
        campaignId,
        creatorId,
      },
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied to this campaign' });
    }

    const application = await prisma.campaignApplication.create({
      data: {
        campaignId,
        creatorId,
        coverLetter,
        portfolioLink,
        deliverables,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Successfully applied to campaign',
      application,
    });
  } catch (error) {
    console.error('Apply to campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all applications for a campaign (for brands)
export const getCampaignApplicants = async (req: AuthRequest, res: Response) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user?.id;

    // Verify campaign ownership
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found or you are not the owner' });
    }

    const applicants = await prisma.campaignApplication.findMany({
      where: { campaignId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, applicants });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all applications for a creator
export const getMyApplications = async (req: AuthRequest, res: Response) => {
    try {
      const creatorId = req.user?.id;
  
      const applications = await prisma.campaignApplication.findMany({
        where: { creatorId },
        include: {
          campaign: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
  
      res.json({ success: true, applications });
    } catch (error) {
      console.error('Get my applications error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Update application status (for brands)
  export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body; // 'approved' or 'rejected'
      const userId = req.user?.id;
  
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const application = await prisma.campaignApplication.findUnique({
        where: { id: applicationId },
        include: { campaign: true },
      });
  
      if (!application || application.campaign.userId !== userId) {
        return res.status(404).json({ message: 'Application not found or you are not authorized' });
      }
  
      const updatedApplication = await prisma.campaignApplication.update({
        where: { id: applicationId },
        data: { status },
      });
  
      res.json({ success: true, application: updatedApplication });
    } catch (error) {
      console.error('Update application status error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
