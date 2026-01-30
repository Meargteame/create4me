import express, { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authenticate as requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Send message
router.post('/send', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const { receiverId, content, conversationId } = req.body;
        const senderId = req.userId;

        if (!receiverId || !content) {
            return res.status(400).json({ success: false, message: 'Receiver and content are required' });
        }

        const convId = conversationId || [senderId, receiverId].sort().join('_');

        const { data: message, error } = await supabaseAdmin
            .from('messages')
            .insert({
                sender_id: senderId,
                receiver_id: receiverId,
                conversation_id: convId,
                content,
                is_read: false
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, message });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get conversation messages
router.get('/conversation/:userId', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const otherUserId = req.params.userId;
        const currentUserId = req.userId;

        // Construct conversation ID deterministically
        // NOTE: This assumes 1-on-1 chats. Supabase query could also simply be: 
        // OR( (sender=me AND receiver=other), (sender=other AND receiver=me) )

        const { data: messages, error } = await supabaseAdmin
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
            .order('created_at', { ascending: true });

        if (error) throw error;

        res.json({ success: true, messages });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Mark messages as read
router.put('/read/:senderId', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const senderId = req.params.senderId;
        const currentUserId = req.userId;

        const { error } = await supabaseAdmin
            .from('messages')
            .update({ is_read: true })
            .eq('sender_id', senderId)
            .eq('receiver_id', currentUserId)
            .eq('is_read', false);

        if (error) throw error;

        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get conversations list (recent chats)
// This is complex in SQL/Supabase without a dedicated 'conversations' table.
// We'll simulate it by grouping messages.
router.get('/conversations', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.userId;

        // Fetch all messages involving the user
        // Note: This is inefficient for large datasets. 
        // Optimization: Create a 'conversations' table or Postgres View.
        const { data: messages, error } = await supabaseAdmin
            .from('messages')
            .select(`
        *,
        sender:users!sender_id(name, email),
        receiver:users!receiver_id(name, email)
      `)
            .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Group by conversation partner
        const conversationMap = new Map();

        messages?.forEach((msg: any) => {
            const partnerId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
            if (!conversationMap.has(partnerId)) {
                conversationMap.set(partnerId, {
                    userId: partnerId,
                    lastMessage: msg.content,
                    timestamp: msg.created_at,
                    unreadCount: (msg.receiver_id === currentUserId && !msg.is_read) ? 1 : 0,
                    partnerName: msg.sender_id === currentUserId ? msg.receiver?.name : msg.sender?.name,
                    partnerEmail: msg.sender_id === currentUserId ? msg.receiver?.email : msg.sender?.email
                });
            } else {
                // Accumulate unread count
                if (msg.receiver_id === currentUserId && !msg.is_read) {
                    const conv = conversationMap.get(partnerId);
                    conv.unreadCount += 1;
                }
            }
        });

        const conversations = Array.from(conversationMap.values());
        res.json({ success: true, conversations });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
