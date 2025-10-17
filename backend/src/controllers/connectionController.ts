import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import Connection from "../models/Connection";
import CreatorProfile from "../models/CreatorProfile";

// Get all connections for current user
export const getConnections = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const {
      tab = "connected",
      search = "",
      role,
    } = req.query as { tab: string; search: string; role: string };

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const searchFilter = search
      ? {
          $or: [
            { displayName: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const roleFilter = role && role !== "all" ? { category: role } : {};

    // --- Stats Calculation ---
    const totalConnections = await Connection.countDocuments({
      $or: [{ requesterId: userId }, { receiverId: userId }],
      status: "accepted",
    });

    const pendingRequests = await Connection.countDocuments({
      receiverId: userId,
      status: "pending",
    });

    const stats = {
      total: totalConnections,
      brands: 0, // Placeholder for future logic
      creators: totalConnections, // Placeholder
      pending: pendingRequests,
    };

    // --- Suggested Tab ---
    if (tab === "suggested") {
      const existingConnections = await Connection.find({
        $or: [{ requesterId: userId }, { receiverId: userId }],
      }).select("requesterId receiverId");

      const connectedUserIds = existingConnections.reduce((acc, conn) => {
        acc.add(conn.requesterId.toString());
        acc.add(conn.receiverId.toString());
        return acc;
      }, new Set<string>());

      const suggestions = await CreatorProfile.find({
        userId: { $nin: Array.from(connectedUserIds) },
        ...searchFilter,
        ...roleFilter,
      })
        .limit(20)
        .sort({ rating: -1 });

      return res.json({
        connections: suggestions.map((profile) => ({
          ...profile.toObject(),
          status: "suggested",
        })),
        stats,
      });
    }

    // --- Connected and Pending Tabs ---
    let connectionFilter: any = {};
    if (tab === "connected") {
      connectionFilter = {
        $or: [{ requesterId: userId }, { receiverId: userId }],
        status: "accepted",
      };
    } else if (tab === "pending") {
      connectionFilter = {
        receiverId: userId,
        status: "pending",
      };
    }

    const connections = await Connection.find(connectionFilter).sort({
      lastActive: -1,
    });

    const userIds = connections.map((conn) =>
      conn.requesterId.toString() === userId.toString()
        ? conn.receiverId
        : conn.requesterId,
    );

    const profiles = await CreatorProfile.find({
      userId: { $in: userIds },
      ...searchFilter,
      ...roleFilter,
    });

    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    const connectionsWithProfiles = connections
      .map((conn) => {
        const otherUserId =
          conn.requesterId.toString() === userId.toString()
            ? conn.receiverId.toString()
            : conn.requesterId.toString();
        const profile = profileMap.get(otherUserId);

        if (!profile) return null;

        return {
          ...conn.toObject(),
          ...profile.toObject(),
          id: conn._id, // Ensure connection ID is present
        };
      })
      .filter(Boolean);

    res.json({
      connections: connectionsWithProfiles,
      stats,
    });
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({ message: "Failed to fetch connections" });
  }
};

// Send connection request
export const sendConnectionRequest = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const requesterId = req.user?._id;
    const { receiverId } = req.body;

    if (!requesterId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }
    if (requesterId.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { requesterId, receiverId },
        { requesterId: receiverId, receiverId: requesterId },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({
        message:
          existingConnection.status === "pending"
            ? "Connection request already sent"
            : "Already connected",
      });
    }

    const connection = await Connection.create({
      requesterId,
      receiverId,
      status: "pending",
    });

    res
      .status(201)
      .json({ success: true, message: "Connection request sent", connection });
  } catch (error) {
    console.error("Send connection request error:", error);
    res.status(500).json({ message: "Failed to send connection request" });
  }
};

// Respond to a connection request (accept or reject)
export const respondToConnectionRequest = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const connection = await Connection.findById(id);

    if (!connection || connection.receiverId.toString() !== userId.toString()) {
      return res
        .status(404)
        .json({ message: "Connection request not found or not authorized" });
    }
    if (connection.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Connection request is not pending" });
    }

    if (action === "accept") {
      connection.status = "accepted";
      connection.lastActive = new Date();
      await connection.save();
      return res.json({
        success: true,
        message: "Connection request accepted",
        connection,
      });
    } else {
      // action === 'reject'
      await Connection.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: "Connection request rejected",
      });
    }
  } catch (error) {
    console.error("Respond to connection request error:", error);
    res
      .status(500)
      .json({ message: "Failed to respond to connection request" });
  }
};

// Accept a connection request
export const acceptConnectionRequest = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connection = await Connection.findById(id);

    if (!connection || connection.receiverId.toString() !== userId.toString()) {
      return res
        .status(404)
        .json({ message: "Connection request not found or not authorized" });
    }

    if (connection.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Connection request is not pending" });
    }

    connection.status = "accepted";
    connection.lastActive = new Date();
    await connection.save();

    res.json({
      success: true,
      message: "Connection request accepted",
      connection,
    });
  } catch (error) {
    console.error("Accept connection request error:", error);
    res.status(500).json({ message: "Failed to accept connection request" });
  }
};

// Reject a connection request
export const rejectConnectionRequest = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connection = await Connection.findById(id);

    if (!connection || connection.receiverId.toString() !== userId.toString()) {
      return res
        .status(404)
        .json({ message: "Connection request not found or not authorized" });
    }

    if (connection.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Connection request is not pending" });
    }

    await Connection.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Connection request rejected",
    });
  } catch (error) {
    console.error("Reject connection request error:", error);
    res.status(500).json({ message: "Failed to reject connection request" });
  }
};

// Remove a connection
export const removeConnection = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params; // This is the connection ID

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const isParticipant =
      connection.requesterId.toString() === userId.toString() ||
      connection.receiverId.toString() === userId.toString();

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Not authorized to remove this connection" });
    }

    await Connection.findByIdAndDelete(id);

    res.json({ success: true, message: "Connection removed" });
  } catch (error) {
    console.error("Remove connection error:", error);
    res.status(500).json({ message: "Failed to remove connection" });
  }
};
