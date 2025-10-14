import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: 'creator' | 'brand';
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
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password with bcrypt (salt rounds: 12)
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        role: data.role || 'creator'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    return { user, token };
  }

  /**
   * Login user
   */
  static async login(data: LoginData) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  /**
   * Logout user (invalidate session)
   */
  static async logout(token: string) {
    try {
      await prisma.session.delete({
        where: { token }
      });
    } catch (error) {
      // Session might not exist, but that's okay
      console.log('Session already removed or does not exist');
    }
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

      // Check if session exists and is valid
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true }
      });

      if (!session || session.expiresAt < new Date()) {
        throw new Error('Session expired');
      }

      const { passwordHash: _, ...userWithoutPassword } = session.user;

      return userWithoutPassword;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get current user from token
   */
  static async getCurrentUser(token: string) {
    return this.verifyToken(token);
  }

  /**
   * Clean up expired sessions (run periodically)
   */
  static async cleanupExpiredSessions() {
    const now = new Date();
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    });
    console.log(`Cleaned up ${result.count} expired sessions`);
    return result.count;
  }
}
