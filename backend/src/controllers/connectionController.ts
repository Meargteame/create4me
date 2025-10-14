import { Request, Response } from 'express';
import prisma from '../database/prisma';

// Get all connections for current user
export const getConnections = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { 
      tab = 'connected', 
      search = '',
      role 
    } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let where: any = {};

    // Filter by connection status
    if (tab === 'connected') {
      where = {
        OR: [
          { requesterId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' }
        ]
      };
    } else if (tab === 'pending') {
      where = {
        receiverId: userId,
        status: 'pending'
      };
    } else if (tab === 'suggested') {
      // For suggestions, we'll return users who are not connected
      // This is a simplified version - you might want more sophisticated logic
      const existingConnections = await prisma.connection.findMany({
        where: {
          OR: [
            { requesterId: userId },
            { receiverId: userId }
          ]
        },
        select: {
          requesterId: true,
          receiverId: true
        }
      });

      const connectedUserIds = new Set<string>();
      existingConnections.forEach(conn => {
        if (conn.requesterId !== userId) connectedUserIds.add(conn.requesterId);
        if (conn.receiverId !== userId) connectedUserIds.add(conn.receiverId);
      });

      // Get creator profiles excluding connected users
      const suggestions = await prisma.creatorProfile.findMany({
        where: {
          userId: {
            not: userId,
            notIn: Array.from(connectedUserIds)
          },
          ...(role && role !== 'all' ? { category: role as string } : {}),
          ...(search ? {
            OR: [
              { displayName: { contains: search as string, mode: 'insensitive' } },
              { username: { contains: search as string, mode: 'insensitive' } }
            ]
          } : {})
        },
        take: 20,
        orderBy: { rating: 'desc' }
      });

      // Calculate stats
      const totalConnections = await prisma.connection.count({
        where: {
          OR: [
            { requesterId: userId, status: 'accepted' },
            { receiverId: userId, status: 'accepted' }
          ]
        }
      });

      const pendingRequests = await prisma.connection.count({
        where: {
          receiverId: userId,
          status: 'pending'
        }
      });

      return res.json({
        connections: suggestions.map(profile => ({
          id: profile.id,
          userId: profile.userId,
          name: profile.displayName,
          username: profile.username,
          avatar: profile.avatar,
          role: profile.category,
          category: profile.category,
          bio: profile.bio,
          location: profile.location,
          followers: profile.followers,
          engagement: profile.engagement,
          rating: profile.rating,
          isVerified: profile.isVerified,
          mutualConnections: 0,
          status: 'suggested',
          lastActive: new Date()
        })),
        stats: {
          total: totalConnections,
          brands: 0, // You might want to add brand tracking
          creators: totalConnections,
          pending: pendingRequests
        }
      });
    }

    // Fetch connections
    const connections = await prisma.connection.findMany({
      where,
      orderBy: { lastActive: 'desc' }
    });

    // Get profile details for connected users
    const userIds = connections.map(conn => 
      conn.requesterId === userId ? conn.receiverId : conn.requesterId
    );

    const profiles = await prisma.creatorProfile.findMany({
      where: {
        userId: { in: userIds }
      }
    });

    // Merge connection data with profiles
    const connectionsWithProfiles = connections.map(conn => {
      const otherUserId = conn.requesterId === userId ? conn.receiverId : conn.requesterId;
      const profile = profiles.find(p => p.userId === otherUserId);

      return {
        id: conn.id,
        userId: otherUserId,
        name: profile?.displayName || 'Unknown User',
        username: profile?.username || 'unknown',
        avatar: profile?.avatar,
        role: profile?.category || 'creator',
        category: profile?.category,
        bio: profile?.bio,
        location: profile?.location,
        followers: profile?.followers || 0,
        engagement: profile?.engagement || 0,
        rating: profile?.rating || 0,
        isVerified: profile?.isVerified || false,
        mutualConnections: conn.mutualConnections,
        status: conn.status,
        lastActive: conn.lastActive
      };
    });

    // Filter by search and role if provided
    let filteredConnections = connectionsWithProfiles;

    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredConnections = filteredConnections.filter(conn =>
        conn.name.toLowerCase().includes(searchLower) ||
        conn.username.toLowerCase().includes(searchLower)
      );
    }

    if (role && role !== 'all') {
      filteredConnections = filteredConnections.filter(conn => 
        conn.category === role
      );
    }

    // Calculate stats
    const totalConnections = await prisma.connection.count({
      where: {
        OR: [
          { requesterId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' }
        ]
      }
    });

    const pendingRequests = await prisma.connection.count({
      where: {
        receiverId: userId,
        status: 'pending'
      }
    });

    res.json({
      connections: filteredConnections,
      stats: {
        total: totalConnections,
        brands: 0, // You might want to add brand tracking
        creators: totalConnections,
        pending: pendingRequests
      }
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ message: 'Failed to fetch connections' });
  }
};

// Send connection request
export const sendConnectionRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { receiverId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    if (userId === receiverId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    // Check if connection already exists
    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId: userId, receiverId },
          { requesterId: receiverId, receiverId: userId }
        ]
      }
    });

    if (existingConnection) {
      return res.status(400).json({ 
        message: existingConnection.status === 'pending' 
          ? 'Connection request already sent' 
          : 'Already connected'
      });
    }

    // Create connection request
    const connection = await prisma.connection.create({
      data: {
        requesterId: userId,
        receiverId,
        status: 'pending'
      }
    });

    res.json({ 
      success: true, 
      message: 'Connection request sent',
      connection 
    });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({ message: 'Failed to send connection request' });
  }
};

// Accept connection request
export const acceptConnectionRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find connection
    const connection = await prisma.connection.findUnique({
      where: { id }
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Verify user is the receiver
    if (connection.receiverId !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({ message: 'Connection request is not pending' });
    }

    // Update connection status
    const updatedConnection = await prisma.connection.update({
      where: { id },
      data: { 
        status: 'accepted',
        lastActive: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: 'Connection request accepted',
      connection: updatedConnection 
    });
  } catch (error) {
    console.error('Accept connection request error:', error);
    res.status(500).json({ message: 'Failed to accept connection request' });
  }
};

// Reject connection request
export const rejectConnectionRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find connection
    const connection = await prisma.connection.findUnique({
      where: { id }
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Verify user is the receiver
    if (connection.receiverId !== userId) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    // Delete connection request
    await prisma.connection.delete({
      where: { id }
    });

    res.json({ 
      success: true, 
      message: 'Connection request rejected'
    });
  } catch (error) {
    console.error('Reject connection request error:', error);
    res.status(500).json({ message: 'Failed to reject connection request' });
  }
};

// Remove connection
export const removeConnection = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find connection
    const connection = await prisma.connection.findUnique({
      where: { id }
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Verify user is part of the connection
    if (connection.requesterId !== userId && connection.receiverId !== userId) {
      return res.status(403).json({ message: 'Not authorized to remove this connection' });
    }

    // Delete connection
    await prisma.connection.delete({
      where: { id }
    });

    res.json({ 
      success: true, 
      message: 'Connection removed'
    });
  } catch (error) {
    console.error('Remove connection error:', error);
    res.status(500).json({ message: 'Failed to remove connection' });
  }
};
