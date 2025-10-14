import express from 'express';
import { register, signup, login, logout, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);  // New endpoint
router.post('/signup', signup);      // Backwards compatibility
router.post('/login', login);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
