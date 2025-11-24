import { Request, Response, NextFunction } from 'express';
import { requireRole, AuthenticatedRequest } from '../middleware/rbac';

describe('RBAC Middleware', () => {
    let mockRequest: Partial<AuthenticatedRequest>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    test('should allow access if user has required role', () => {
        mockRequest = {
            user: {
                id: '123',
                email: 'test@example.com',
                role: 'brand',
                isVettedProfile: true
            }
        };

        const middleware = requireRole('brand');
        middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    test('should block access if user has wrong role', () => {
        mockRequest = {
            user: {
                id: '123',
                email: 'test@example.com',
                role: 'creator',
                isVettedProfile: true
            }
        };

        const middleware = requireRole('brand');
        middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            code: 'ROLE_FORBIDDEN'
        }));
    });

    test('should block access if user is not authenticated', () => {
        mockRequest = {
            // No user object
        };

        const middleware = requireRole('brand');
        middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            code: 'AUTH_REQUIRED'
        }));
    });

    test('should allow access for multiple allowed roles', () => {
        mockRequest = {
            user: {
                id: '123',
                email: 'admin@example.com',
                role: 'admin',
                isVettedProfile: true
            }
        };

        const middleware = requireRole('brand', 'admin');
        middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
    });
});
