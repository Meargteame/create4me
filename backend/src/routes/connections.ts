import express from 'express';
import {
  getConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection
} from '../controllers/connectionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All connection routes require authentication
router.get('/', authenticateToken, getConnections);
router.post('/request', authenticateToken, sendConnectionRequest);
router.post('/:id/accept', authenticateToken, acceptConnectionRequest);
router.post('/:id/reject', authenticateToken, rejectConnectionRequest);
router.delete('/:id', authenticateToken, removeConnection);

export default router;
