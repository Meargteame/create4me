import { Request, Response, NextFunction } from 'express';

/**
 * Extended Request interface with authenticated user
 */
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: 'creator' | 'brand' | 'admin';
        isVettedProfile: boolean;
    };
}

/**
 * RBAC Middleware: Require specific role(s) to access route
 * 
 * @param allowedRoles - Array of roles that can access this route
 * @returns Express middleware function
 * 
 * @example
 * // Only brands can create campaigns
 * router.post('/campaigns', authenticate, requireRole('brand'), createCampaign);
 * 
 * @example
 * // Both creators and brands can view analytics
 * router.get('/analytics', authenticate, requireRole('creator', 'brand'), getAnalytics);
 */
export const requireRole = (...allowedRoles: Array<'creator' | 'brand' | 'admin'>) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'AUTH_REQUIRED'
            });
        }

        // Check if user has allowed role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
                code: 'ROLE_FORBIDDEN',
                requiredRoles: allowedRoles,
                userRole: req.user.role
            });
        }

        // User has valid role, proceed
        next();
    };
};

/**
 * Check if user is owner of resource OR has admin/specific role
 * Useful for profile/resource endpoints where owners can access their own data
 * 
 * @param allowedRoles - Roles that can access regardless of ownership
 * @param resourceIdParam - Name of the param that contains the resource owner ID (default: 'id')
 * 
 * @example
 * // Creators can edit their own profile, admins can edit any
 * router.put('/profiles/:id', authenticate, requireRoleOrOwner('admin'), updateProfile);
 */
export const requireRoleOrOwner = (
    allowedRoles: Array<'creator' | 'brand' | 'admin'>,
    resourceIdParam: string = 'id'
) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const isAllowedRole = allowedRoles.includes(req.user.role);
        const resourceId = req.params[resourceIdParam] || req.body.userId;
        const isOwner = resourceId === req.user.id;

        if (!isAllowedRole && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You must be the owner or have admin privileges.',
                code: 'OWNER_OR_ROLE_REQUIRED'
            });
        }

        next();
    };
};

/**
 * Require user to have vetted profile status
 * Used for features that require manual verification
 * 
 * @example
 * // Only vetted brands can create paid campaigns
 * router.post('/campaigns/paid', authenticate, requireRole('brand'), requireVetted, createPaidCampaign);
 */
export const requireVetted = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (!req.user.isVettedProfile) {
        return res.status(403).json({
            success: false,
            message: 'This action requires a vetted profile. Please complete verification.',
            code: 'VERIFICATION_REQUIRED'
        });
    }

    next();
};
