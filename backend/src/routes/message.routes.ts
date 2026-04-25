import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { asyncHandler } from '../lib/async-handler';
import { requireAuth } from '../middleware/auth';
import {
    sendMessage,
    getConversation,
    getConversations,
    markConversationAsRead,
    getAccountsUsers,
    toggleReaction
} from '../services/message.service';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'messages');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `msg-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    // Allowed file types
    const allowedMimes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed: images, PDF, Word, Excel, text'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

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

// Send a message (text only or with replyToId)
messageRouter.post(
    '/',
    asyncHandler(async (req, res) => {
        const { receiverId, content, replyToId } = req.body;
        if (!receiverId || !content) {
            res.status(400).json({ message: 'receiverId and content are required' });
            return;
        }
        const message = await sendMessage(req.user!.userId, receiverId, content, replyToId);
        res.status(201).json(message);
    })
);

// Send a message with file attachment
messageRouter.post(
    '/attachment',
    upload.single('file'),
    asyncHandler(async (req, res) => {
        const { receiverId, content, replyToId } = req.body;
        
        if (!receiverId) {
            res.status(400).json({ message: 'receiverId is required' });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: 'File is required' });
            return;
        }

        // Build file URL
        const fileUrl = `/uploads/messages/${req.file.filename}`;
        
        // Format file size
        const formatFileSize = (bytes: number): string => {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        };

        const attachment = {
            url: fileUrl,
            name: req.file.originalname,
            size: formatFileSize(req.file.size),
            type: req.file.mimetype
        };

        const message = await sendMessage(
            req.user!.userId,
            receiverId,
            content || '',
            replyToId || undefined,
            attachment
        );
        
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

// Add/remove reaction to a message
messageRouter.post(
    '/:messageId/reaction',
    asyncHandler(async (req, res) => {
        const { messageId } = req.params;
        const { emoji } = req.body;
        
        if (!emoji) {
            res.status(400).json({ message: 'emoji is required' });
            return;
        }

        const result = await toggleReaction(req.user!.userId, messageId, emoji);
        res.status(200).json({
            success: true,
            message: result.isAdded ? 'Reaction added' : 'Reaction removed',
            isAdded: result.isAdded,
            reactions: result.message.reactions,
        });
    })
);
