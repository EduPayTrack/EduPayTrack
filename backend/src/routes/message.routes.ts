import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler';
import { requireAuth } from '../middleware/auth';
import {
    sendMessage,
    getConversation,
    getConversations,
    markConversationAsRead,
    getAccountsUsers
} from '../services/message.service';

export const messageRouter = Router();

messageRouter.use(requireAuth);

// Get all conversations for the current user
messageRouter.get(
    '/conversations',
    asyncHandler(async (req, res) => {
        const conversations = await getConversations(req.user!.userId);
        res.status(200).json(conversations);
    })
);

// Get list of ACCOUNTS users (useful for students to start a chat)
messageRouter.get(
    '/accounts-users',
    asyncHandler(async (req, res) => {
        const users = await getAccountsUsers();
        res.status(200).json(users);
    })
);

// Get messages for a specific conversation
messageRouter.get(
    '/:otherUserId',
    asyncHandler(async (req, res) => {
        const { otherUserId } = req.params;
        const messages = await getConversation(req.user!.userId, otherUserId);
        res.status(200).json(messages);
    })
);

// Send a message
messageRouter.post(
    '/',
    asyncHandler(async (req, res) => {
        const { receiverId, content } = req.body;
        if (!receiverId || !content) {
            res.status(400).json({ message: 'receiverId and content are required' });
            return;
        }
        const message = await sendMessage(req.user!.userId, receiverId, content);
        res.status(201).json(message);
    })
);

// Mark conversation as read
messageRouter.patch(
    '/:otherUserId/read',
    asyncHandler(async (req, res) => {
        const { otherUserId } = req.params;
        await markConversationAsRead(req.user!.userId, otherUserId);
        res.status(200).json({ success: true });
    })
);
