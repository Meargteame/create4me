import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import CreatorProfile from "../models/CreatorProfile";
import { connectDB } from "../database/mongoose";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: "creator" | "brand";
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterData) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (data.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Ensure database connection
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create user (password will be hashed by pre-save hook)
    const user = new User({
      email: data.email,
      passwordHash: data.password, // Will be hashed by pre-save hook
      name: data.name,
      role: data.role || "creator",
    });

    await user.save();

    // If user is a creator, automatically create a creator profile
    if (user.role === "creator") {
      const creatorProfile = new CreatorProfile({
        userId: user._id,
        username:
          data.name?.toLowerCase().replace(/\s+/g, "_") ||
          user.email.split("@")[0],
        displayName: data.name || user.email.split("@")[0],
        bio: "New creator - profile not yet completed",
        category: "General",
        location: "Not specified",
        isVerified: false,
        isAvailable: true,
        rating: 0,
        followers: 0,
        engagement: 0,
        completedCampaigns: 0,
        platforms: [],
        tags: [],
      });

      await creatorProfile.save();
      console.log(`✅ Created creator profile for user: ${user.email}`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // Create session (simplified for now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // For Mongoose, we'll create a simple session document
    // Note: In a full implementation, you'd want a proper Session model
    const { passwordHash, ...userObject } = user.toObject();

    return { user: userObject, token };
  }

  /**
   * Login user
   */
  static async login(data: LoginData) {
    // Ensure database connection
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: data.email });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await user.comparePassword(data.password);

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // Return user without password
    const { passwordHash, ...userObject } = user.toObject();

    return { user: userObject, token };
  }

  /**
   * Logout user (invalidate session) - simplified for Mongoose
   */
  static async logout(token: string) {
    // For Mongoose implementation, we'll skip complex session management for now
    // In a full implementation, you'd want a proper Session model
    console.log(
      "Logout requested - session management simplified for Mongoose migration",
    );
  }

  /**
   * Verify token and get user
   */
  static async verifyToken(token: string) {
    try {
      // Verify JWT
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };

      // Ensure database connection
      await connectDB();

      // Check if user exists
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Return user without password
      const { passwordHash, ...userObject } = user.toObject();

      return userObject;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  /**
   * Get current user from token
   */
  static async getCurrentUser(token: string) {
    return this.verifyToken(token);
  }

  /**
   * Clean up expired sessions (simplified for Mongoose)
   */
  static async cleanupExpiredSessions() {
    // Simplified for Mongoose migration
    console.log("Session cleanup - simplified for Mongoose migration");
    return 0;
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const { passwordHash, ...userObject } = user.toObject();
    return userObject;
  }
}
