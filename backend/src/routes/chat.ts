import express, { Response } from 'express';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { FilterResult, ContentFilterService } from '../services/contentFilter';

const router = express.Router();

// Fetch messages for a conversation
router.get('/:partnerId', authenticate, async (req: AuthRequest, res: Response) => {
    const { partnerId } = req.params;
    const userId = req.userId;

    if (!partnerId) {
        return res.status(400).json({ message: 'Partner ID is required' });
    }

    try {
        const conversationId = [userId, partnerId].sort().join('_');
        
        const messages = await Message.find({ conversationId })
            .populate('senderId', 'name role')
            .populate('receiverId', 'name role')
            .sort({ createdAt: 'asc' });

        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
});

// Send a new message
router.post('/send', authenticate, async (req: AuthRequest, res: Response) => {
    const { receiverId, content, conversationId: providedConvId } = req.body;
    const senderId = req.userId;
    const senderRole = req.user?.role;

    if (!receiverId || !content) {
        return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    // Content Filtering
    const filterResult: FilterResult = ContentFilterService.filterMessage(content);
    if (filterResult.hasFilteredContent) {
        return res.status(400).json({
            message: 'Message flagged for review. Please remove sensitive information.',
            details: filterResult.filteredWords
        });
    }

    try {
        const conversationId = providedConvId || [senderId, receiverId].sort().join('_');

        const newMessage = new Message({
            conversationId,
            senderId,
            receiverId,
            senderRole,
            content: filterResult.cleanContent,
            read: false,
            hasFilteredContent: filterResult.hasFilteredContent,
            warningIssued: !!filterResult.warningMessage,
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('senderId', 'name role')
            .populate('receiverId', 'name role')
            .exec();

        // Prepare response with warnings if content was filtered
        const response: any = {
            success: true,
            message: populatedMessage
        };

        if (filterResult.hasFilteredContent) {
            response.warning = {
                message: filterResult.warningMessage,
                filteredCount: filterResult.filteredWords.length,
                riskLevel: filterResult.riskLevel
            };
        }

        // Add high-risk alert if necessary
        if (filterResult.riskLevel === 'high') {
            response.alert = {
                level: 'high',
                message: '🚨 Your message contains high-risk content. Repeated violations may result in account suspension.',
                reasons: filterResult.filteredWords
            };
        }

        res.status(201).json(response);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error sending message' });
    }
});

export default router;
