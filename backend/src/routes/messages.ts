import express, { Response } from 'express';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get conversations list
router.get('/conversations', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.userId },
        { receiverId: req.userId }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('senderId', 'name email')
    .populate('receiverId', 'name email');

    // Group by conversation
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const otherId = msg.senderId._id.toString() === req.userId 
        ? msg.receiverId._id.toString() 
        : msg.senderId._id.toString();
      
      if (!conversationsMap.has(otherId)) {
        conversationsMap.set(otherId, {
          userId: otherId,
          user: msg.senderId._id.toString() === req.userId ? msg.receiverId : msg.senderId,
          lastMessage: msg,
          unreadCount: 0
        });
      }
      
      if (!msg.read && msg.receiverId._id.toString() === req.userId) {
        conversationsMap.get(otherId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());
    
    res.json({ success: true, conversations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get messages in a conversation
router.get('/conversation/:userId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const conversationId = [req.userId, userId].sort().join('-');
    
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');
    
    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiverId: req.userId, read: false },
      { read: true, readAt: new Date() }
    );
    
    res.json({ success: true, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message
router.post('/send', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, content, attachments } = req.body;
    
    if (!receiverId || !content) {
      res.status(400).json({ success: false, message: 'Receiver and content are required' });
      return;
    }
    
    const conversationId = [req.userId, receiverId].sort().join('-');
    
    const message = new Message({
      conversationId,
      senderId: req.userId,
      receiverId,
      content,
      attachments
    });
    
    await message.save();
    await message.populate('senderId', 'name email');
    await message.populate('receiverId', 'name email');
    
    res.status(201).json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark message as read
router.patch('/:id/read', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, receiverId: req.userId },
      { read: true, readAt: new Date() },
      { new: true }
    );
    
    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    
    res.json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
