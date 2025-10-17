import { Request, Response } from "express";
import { User } from "../models/User";
import CreatorProfile from "../models/CreatorProfile";
import Campaign from "../models/Campaign";
import CampaignApplication from "../models/CampaignApplication";
import { AuthRequest } from "../middleware/auth";

/**
 * GET /api/analytics/registrations
 * Get creator registration statistics
 */
export const getRegistrationStats = async (req: AuthRequest, res: Response) => {
  try {
    const { timeRange = "30d" } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get total counts
    const totalCreators = await CreatorProfile.countDocuments();
    const totalBrands = await User.countDocuments({ role: "brand" });
    const totalUsers = await User.countDocuments();

    // Get new registrations in time range
    const newCreators = await User.countDocuments({
      role: "creator",
      createdAt: { $gte: startDate },
    });

    const newBrands = await User.countDocuments({
      role: "brand",
      createdAt: { $gte: startDate },
    });

    // Get daily registration breakdown
    const dailyStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    // Get creator profile completion stats
    const profileStats = await CreatorProfile.aggregate([
      {
        $project: {
          isComplete: {
            $and: [
              { $ne: ["$bio", "New creator - profile not yet completed"] },
              { $gt: [{ $size: "$platforms" }, 0] },
              { $gt: [{ $size: "$tags" }, 0] },
              { $ne: ["$location", "Not specified"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$isComplete",
          count: { $sum: 1 },
        },
      },
    ]);

    const completedProfiles =
      profileStats.find((s) => s._id === true)?.count || 0;
    const incompleteProfiles =
      profileStats.find((s) => s._id === false)?.count || 0;

    // Get top categories
    const topCategories = await CreatorProfile.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get availability stats
    const availabilityStats = await CreatorProfile.aggregate([
      {
        $group: {
          _id: "$isAvailable",
          count: { $sum: 1 },
        },
      },
    ]);

    const availableCreators =
      availabilityStats.find((s) => s._id === true)?.count || 0;
    const unavailableCreators =
      availabilityStats.find((s) => s._id === false)?.count || 0;

    res.json({
      success: true,
      data: {
        timeRange,
        totals: {
          creators: totalCreators,
          brands: totalBrands,
          users: totalUsers,
        },
        newRegistrations: {
          creators: newCreators,
          brands: newBrands,
          total: newCreators + newBrands,
        },
        profileCompletion: {
          completed: completedProfiles,
          incomplete: incompleteProfiles,
          completionRate:
            totalCreators > 0
              ? ((completedProfiles / totalCreators) * 100).toFixed(1)
              : 0,
        },
        availability: {
          available: availableCreators,
          unavailable: unavailableCreators,
        },
        topCategories: topCategories.map((c) => ({
          category: c._id,
          count: c.count,
        })),
        dailyRegistrations: dailyStats,
      },
    });
  } catch (error) {
    console.error("Get registration stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get registration statistics",
    });
  }
};

/**
 * GET /api/analytics/platform
 * Get overall platform statistics
 */
export const getPlatformStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalCreators = await CreatorProfile.countDocuments();
    const totalBrands = await User.countDocuments({ role: "brand" });
    const totalCampaigns = await Campaign.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ status: "active" });
    const totalApplications = await CampaignApplication.countDocuments();

    // Get verification stats
    const verifiedCreators = await CreatorProfile.countDocuments({ isVerified: true });
    const unverifiedCreators = await CreatorProfile.countDocuments({
      isVerified: false,
    });

    // Get average stats
    const avgStats = await CreatorProfile.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          avgFollowers: { $avg: "$followers" },
          avgEngagement: { $avg: "$engagement" },
          totalFollowers: { $sum: "$followers" },
        },
      },
    ]);

    const averages = avgStats[0] || {
      avgRating: 0,
      avgFollowers: 0,
      avgEngagement: 0,
      totalFollowers: 0,
    };

    // Get campaign stats
    const campaignStats = await Campaign.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get application stats
    const applicationStats = await CampaignApplication.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const recentCampaigns = await Campaign.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const recentApplications = await CampaignApplication.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          creators: totalCreators,
          brands: totalBrands,
        },
        creators: {
          total: totalCreators,
          verified: verifiedCreators,
          unverified: unverifiedCreators,
          verificationRate:
            totalCreators > 0
              ? ((verifiedCreators / totalCreators) * 100).toFixed(1)
              : 0,
        },
        campaigns: {
          total: totalCampaigns,
          active: activeCampaigns,
          byStatus: campaignStats.reduce(
            (acc, stat) => {
              acc[stat._id] = stat.count;
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
        applications: {
          total: totalApplications,
          byStatus: applicationStats.reduce(
            (acc, stat) => {
              acc[stat._id] = stat.count;
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
        averages: {
          rating: averages.avgRating.toFixed(1),
          followers: Math.round(averages.avgFollowers),
          engagement: averages.avgEngagement.toFixed(1),
          totalFollowers: averages.totalFollowers,
        },
        recentActivity: {
          newUsers: recentUsers,
          newCampaigns: recentCampaigns,
          newApplications: recentApplications,
        },
      },
    });
  } catch (error) {
    console.error("Get platform stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get platform statistics",
    });
  }
};

/**
 * GET /api/analytics/creator/:creatorId
 * Get individual creator analytics
 */
export const getCreatorAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { creatorId } = req.params;

    // Get creator
    const creator = await CreatorProfile.findById(creatorId);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    // Get applications count
    const totalApplications = await CampaignApplication.countDocuments({
      creatorId: creator.userId,
    });

    const applicationsByStatus = await CampaignApplication.aggregate([
      {
        $match: { creatorId: creator.userId },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get profile views (if you implement tracking)
    // For now, we'll return 0
    const profileViews = 0;

    res.json({
      success: true,
      data: {
        creator: {
          id: creator._id,
          displayName: creator.displayName,
          username: creator.username,
          category: creator.category,
          isVerified: creator.isVerified,
        },
        stats: {
          followers: creator.followers,
          engagement: creator.engagement,
          rating: creator.rating,
          completedCampaigns: creator.completedCampaigns,
          profileViews,
        },
        applications: {
          total: totalApplications,
          byStatus: applicationsByStatus.reduce(
            (acc, stat) => {
              acc[stat._id] = stat.count;
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
      },
    });
  } catch (error) {
    console.error("Get creator analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get creator analytics",
    });
  }
};

/**
 * GET /api/analytics/brand/:brandId
 * Get individual brand analytics
 */
export const getBrandAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { brandId } = req.params;

    // Get brand user
    const brand = await User.findById(brandId);
    if (!brand || brand.role !== "brand") {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // Get campaigns
    const totalCampaigns = await Campaign.countDocuments({ userId: brandId });
    const activeCampaigns = await Campaign.countDocuments({
      userId: brandId,
      status: "active",
    });

    const campaignsByStatus = await Campaign.aggregate([
      {
        $match: { userId: brand._id },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get applications to brand's campaigns
    const campaigns = await Campaign.find({ userId: brandId }).select("_id");
    const campaignIds = campaigns.map((c) => c._id);

    const totalApplications = await CampaignApplication.countDocuments({
      campaignId: { $in: campaignIds },
    });

    const applicationsByStatus = await CampaignApplication.aggregate([
      {
        $match: { campaignId: { $in: campaignIds } },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        brand: {
          id: brand._id,
          name: brand.name,
          email: brand.email,
        },
        campaigns: {
          total: totalCampaigns,
          active: activeCampaigns,
          byStatus: campaignsByStatus.reduce(
            (acc, stat) => {
              acc[stat._id] = stat.count;
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
        applications: {
          total: totalApplications,
          byStatus: applicationsByStatus.reduce(
            (acc, stat) => {
              acc[stat._id] = stat.count;
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
      },
    });
  } catch (error) {
    console.error("Get brand analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get brand analytics",
    });
  }
};
