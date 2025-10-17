import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

import { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: Partial<IUser>;
}

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message:
          "No token provided. Authorization header must be in format: Bearer <token>",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const user = await AuthService.verifyToken(token);

    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid or expired token",
    });
  }
};

/**
 * Middleware to check if user has required role(s)
 */
export const requireRole = (roles: string | string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};

/**
 * Middleware for creator-only routes
 */
export const requireCreator = requireRole("creator");

/**
 * Middleware for brand-only routes
 */
export const requireBrand = requireRole("brand");

/**
 * Middleware for admin-only routes
 */
export const requireAdmin = requireRole("admin");

// For backwards compatibility
export const authenticateToken = authenticate;
