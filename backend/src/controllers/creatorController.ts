import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import CreatorProfile, { ICreatorProfile } from "../models/CreatorProfile";
import CreatorLike from "../models/CreatorLike";
import CreatorBookmark from "../models/CreatorBookmark";

interface CreatorWithInteractions extends mongoose.Document {
  isLiked: boolean;
  isBookmarked: boolean;
  [key: string]: any;
}

// Get all creators with filtering and pagination
export const getCreators = async (req: AuthRequest, res: Response) => {
  try {
    const {
      search = "",
      category,
      location,
      platform,
      tags,
      minFollowers,
      maxFollowers,
      rating,
      isVerified,
      isAvailable,
      sortBy = "rating",
      sortOrder = "desc",
      page = "1",
      limit = "12",
    } = req.query;

    const userId = req.user?._id;

    // Build Query
    const query: mongoose.FilterQuery<ICreatorProfile> = {};

    if (search) {
      query.$or = [
        { displayName: { $regex: search as string, $options: "i" } },
        { username: { $regex: search as string, $options: "i" } },
        { bio: { $regex: search as string, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (location)
      query.location = { $regex: location as string, $options: "i" };
    if (platform) query.platforms = platform;
    if (tags) query.tags = { $in: (tags as string).split(",") };
    if (minFollowers)
      query.followers = { ...query.followers, $gte: Number(minFollowers) };
    if (maxFollowers)
      query.followers = { ...query.followers, $lte: Number(maxFollowers) };
    if (rating) query.rating = { $gte: Number(rating) };
    if (isVerified) query.isVerified = isVerified === "true";
    if (isAvailable) query.isAvailable = isAvailable === "true";

    // Sorting
    const sortOptions: { [key: string]: 1 | -1 } = {
      [sortBy as string]: sortOrder === "desc" ? -1 : 1,
    };

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, parseInt(limit as string, 10)); // Cap at 50 items per page
    const skip = (pageNum - 1) * limitNum;

    // Execute Queries
    const [creators, total] = await Promise.all([
      CreatorProfile.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      CreatorProfile.countDocuments(query),
    ]);

    // Add user-specific data (likes, bookmarks)
    let augmentedCreators = [...creators];

    if (userId) {
      const creatorIds = creators.map((c) => c._id);
      const [likes, bookmarks] = await Promise.all([
        CreatorLike.find({ userId, creatorId: { $in: creatorIds } })
          .select("creatorId")
          .lean(),
        CreatorBookmark.find({ userId, creatorId: { $in: creatorIds } })
          .select("creatorId")
          .lean(),
      ]);

      const likedIds = new Set(likes.map((l) => l.creatorId.toString()));
      const bookmarkedIds = new Set(
        bookmarks.map((b) => b.creatorId.toString()),
      );

      augmentedCreators = creators.map((creator) => ({
        ...creator,
        isLiked: likedIds.has(creator._id.toString()),
        isBookmarked: bookmarkedIds.has(creator._id.toString()),
      }));
    }

    // Get Stats
    const [totalCreators, availableCreators, bookmarkedCount] =
      await Promise.all([
        CreatorProfile.countDocuments(),
        CreatorProfile.countDocuments({ isAvailable: true }),
        userId ? CreatorBookmark.countDocuments({ userId }) : 0,
      ]);

    res.json({
      success: true,
      data: augmentedCreators,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      stats: {
        totalCreators,
        availableCreators,
        bookmarkedCount,
      },
    });
  } catch (error) {
    console.error("Get creators error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get a single creator by their ID or username
export const getCreatorById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { username: id.toLowerCase() };

    const creator = await CreatorProfile.findOne(query).lean();

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    const [likesCount, bookmarksCount, isLiked, isBookmarked] =
      await Promise.all([
        CreatorLike.countDocuments({ creatorId: creator._id }),
        CreatorBookmark.countDocuments({ creatorId: creator._id }),
        userId ? CreatorLike.exists({ userId, creatorId: creator._id }) : null,
        userId
          ? CreatorBookmark.exists({ userId, creatorId: creator._id })
          : null,
      ]);

    const creatorWithStats = {
      ...creator,
      likesCount,
      bookmarksCount,
      isLiked: !!isLiked,
      isBookmarked: !!isBookmarked,
    };

    res.json({
      success: true,
      data: creatorWithStats,
    });
  } catch (error) {
    console.error("Get creator by ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Like or unlike a creator
export const likeCreator = async (req: AuthRequest, res: Response) => {
  try {
    const { id: creatorId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(400).json({ message: "Invalid creator ID" });
    }

    const like = await CreatorLike.findOne({ userId, creatorId });

    if (like) {
      await like.deleteOne();
      res.json({ success: true, liked: false, message: "Creator unliked" });
    } else {
      await CreatorLike.create({ userId, creatorId });
      res.json({ success: true, liked: true, message: "Creator liked" });
    }
  } catch (error) {
    console.error("Like creator error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Bookmark or unbookmark a creator
export const bookmarkCreator = async (req: AuthRequest, res: Response) => {
  try {
    const { id: creatorId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(400).json({ message: "Invalid creator ID" });
    }

    const bookmark = await CreatorBookmark.findOne({ userId, creatorId });

    if (bookmark) {
      await bookmark.deleteOne();
      res.json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed",
      });
    } else {
      await CreatorBookmark.create({ userId, creatorId });
      res.json({
        success: true,
        bookmarked: true,
        message: "Creator bookmarked",
      });
    }
  } catch (error) {
    console.error("Bookmark creator error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Contact a creator
export const contactCreator = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;
    const senderId = req.user?._id;

    if (!senderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: "Subject and message are required" });
    }

    const creator = await CreatorProfile.findById(id);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    // In a real app, you would integrate an email service or messaging system here.
    console.log(`
      New Message to ${creator.displayName} (User ID: ${creator.userId})
      From: User ID ${senderId}
      Subject: ${subject}
      Message: ${message}
    `);

    res.json({ success: true, message: "Your message has been sent!" });
  } catch (error) {
    console.error("Contact creator error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
