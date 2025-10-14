import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';

/**
 * POST /api/auth/register
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate role
    if (role && !['brand', 'creator', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "brand" or "creator"'
      });
    }

    const result = await AuthService.register({
      email,
      password,
      name,
      role: role || 'creator'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

/**
 * POST /api/auth/login
 * Login user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await AuthService.login({ email, password });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

/**
 * POST /api/auth/logout
 * Logout user (invalidate session)
 */
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await AuthService.logout(token);
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Logout failed'
    });
  }
};

/**
 * GET /api/auth/me
 * Get current user
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get user'
    });
  }
};

// For backwards compatibility
export const signup = register;
