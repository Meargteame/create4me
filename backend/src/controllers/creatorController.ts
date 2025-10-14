import { Request, Response } from 'express';
import prisma from '../database/prisma';

// Get all creators with filtering and pagination
export const getCreators = async (req: Request, res: Response) => {
  try {
    const {
      search = '',
      category,
      location,
      platform,
      minRating,
      verified,
      available,
      sortBy = 'rating',
      page = '1',
      limit = '9'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { displayName: { contains: search as string, mode: 'insensitive' } },
        { username: { contains: search as string, mode: 'insensitive' } },
        { bio: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (location && location !== 'all') {
      where.location = { contains: location as string, mode: 'insensitive' };
    }

    if (verified === 'true') {
      where.isVerified = true;
    }

    if (available === 'true') {
      where.isAvailable = true;
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating as string) };
    }

    // Build sort conditions
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'followers':
        orderBy = { followers: 'desc' };
        break;
      case 'engagement':
        orderBy = { engagement: 'desc' };
        break;
      case 'campaigns':
        orderBy = { completedCampaigns: 'desc' };
        break;
      case 'price-low':
        orderBy = { priceRange: 'asc' };
        break;
      case 'price-high':
        orderBy = { priceRange: 'desc' };
        break;
      default:
        orderBy = { rating: 'desc' };
    }

    // Get creators with counts
    const [creators, total] = await Promise.all([
      prisma.creatorProfile.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          _count: {
            select: {
              likes: true,
              bookmarks: true
            }
          }
        }
      }),
      prisma.creatorProfile.count({ where })
    ]);

    // Get like and bookmark status for current user
    const userId = (req as any).user?.userId;
    let creatorsWithStatus = creators;

    if (userId) {
      const creatorIds = creators.map(c => c.id);
      
      const [likes, bookmarks] = await Promise.all([
        prisma.creatorLike.findMany({
          where: { userId, creatorId: { in: creatorIds } }
        }),
        prisma.creatorBookmark.findMany({
          where: { userId, creatorId: { in: creatorIds } }
        })
      ]);

      const likedSet = new Set(likes.map(l => l.creatorId));
      const bookmarkedSet = new Set(bookmarks.map(b => b.creatorId));

      creatorsWithStatus = creators.map(creator => ({
        ...creator,
        isLiked: likedSet.has(creator.id),
        isBookmarked: bookmarkedSet.has(creator.id),
        likesCount: (creator._count as any).likes,
        bookmarksCount: (creator._count as any).bookmarks
      }));
    }

    // Calculate stats
    const totalCreators = total;
    const availableCreators = await prisma.creatorProfile.count({
      where: { isAvailable: true }
    });
    const avgRating = creators.length > 0 
      ? creators.reduce((sum, c) => sum + c.rating, 0) / creators.length 
      : 0;
    const bookmarkedCount = userId 
      ? await prisma.creatorBookmark.count({ where: { userId } })
      : 0;

    res.json({
      creators: creatorsWithStatus,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      stats: {
        total: totalCreators,
        available: availableCreators,
        avgRating: parseFloat(avgRating.toFixed(1)),
        bookmarked: bookmarkedCount
      }
    });
  } catch (error) {
    console.error('Get creators error:', error);
    res.status(500).json({ message: 'Failed to fetch creators' });
  }
};

// Get single creator profile
export const getCreatorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const creator = await prisma.creatorProfile.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            likes: true,
            bookmarks: true
          }
        }
      }
    });

    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    // Check if current user liked/bookmarked
    let isLiked = false;
    let isBookmarked = false;

    if (userId) {
      const [like, bookmark] = await Promise.all([
        prisma.creatorLike.findUnique({
          where: {
            creatorId_userId: {
              creatorId: id,
              userId
            }
          }
        }),
        prisma.creatorBookmark.findUnique({
          where: {
            creatorId_userId: {
              creatorId: id,
              userId
            }
          }
        })
      ]);

      isLiked = !!like;
      isBookmarked = !!bookmark;
    }

    res.json({
      ...creator,
      isLiked,
      isBookmarked,
      likesCount: (creator._count as any).likes,
      bookmarksCount: (creator._count as any).bookmarks
    });
  } catch (error) {
    console.error('Get creator by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch creator profile' });
  }
};

// Like a creator
export const likeCreator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if creator exists
    const creator = await prisma.creatorProfile.findUnique({ where: { id } });
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    // Toggle like
    const existingLike = await prisma.creatorLike.findUnique({
      where: {
        creatorId_userId: {
          creatorId: id,
          userId
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.creatorLike.delete({
        where: {
          creatorId_userId: {
            creatorId: id,
            userId
          }
        }
      });
      res.json({ liked: false, message: 'Creator unliked' });
    } else {
      // Like
      await prisma.creatorLike.create({
        data: {
          creatorId: id,
          userId
        }
      });
      res.json({ liked: true, message: 'Creator liked' });
    }
  } catch (error) {
    console.error('Like creator error:', error);
    res.status(500).json({ message: 'Failed to like creator' });
  }
};

// Bookmark a creator
export const bookmarkCreator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if creator exists
    const creator = await prisma.creatorProfile.findUnique({ where: { id } });
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    // Toggle bookmark
    const existingBookmark = await prisma.creatorBookmark.findUnique({
      where: {
        creatorId_userId: {
          creatorId: id,
          userId
        }
      }
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.creatorBookmark.delete({
        where: {
          creatorId_userId: {
            creatorId: id,
            userId
          }
        }
      });
      res.json({ bookmarked: false, message: 'Bookmark removed' });
    } else {
      // Add bookmark
      await prisma.creatorBookmark.create({
        data: {
          creatorId: id,
          userId
        }
      });
      res.json({ bookmarked: true, message: 'Creator bookmarked' });
    }
  } catch (error) {
    console.error('Bookmark creator error:', error);
    res.status(500).json({ message: 'Failed to bookmark creator' });
  }
};

// Contact creator (placeholder - you might want to integrate with messaging system)
export const contactCreator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Check if creator exists
    const creator = await prisma.creatorProfile.findUnique({ where: { id } });
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    // TODO: Implement actual messaging system
    // For now, just return success
    console.log(`User ${userId} contacted creator ${id}: ${message}`);

    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      note: 'Messaging system integration pending'
    });
  } catch (error) {
    console.error('Contact creator error:', error);
    res.status(500).json({ message: 'Failed to contact creator' });
  }
};
