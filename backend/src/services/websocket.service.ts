import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';

// User socket mapping: userId -> Set of socket IDs
const userSockets = new Map<string, Set<string>>();

// Online status tracking
const onlineUsers = new Set<string>();

let io: SocketIOServer | null = null;

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
}

/**
 * Initialize Socket.IO server
 */
export function initializeWebSocket(server: HttpServer): SocketIOServer {
    io = new SocketIOServer(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || env.NODE_ENV !== 'production') {
                    callback(null, true);
                    return;
                }
                // Allow origins from env
                const allowedOrigins = env.CORS_ORIGINS?.split(',') || [];
                if (allowedOrigins.includes(origin)) {
                    callback(null, true);
                    return;
                }
                callback(new Error('Origin not allowed by CORS'));
            },
            credentials: true,
            methods: ['GET', 'POST'],
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    // Authentication middleware
    io.use(async (socket: AuthenticatedSocket, next) => {
        try {
            const token = socket.handshake.auth.token as string;
            
            if (!token) {
                return next(new Error('Authentication token required'));
            }

            const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
            socket.userId = decoded.userId;
            socket.userRole = decoded.role;
            
            // Verify user exists in database
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, role: true, firstName: true, lastName: true }
            });

            if (!user) {
                return next(new Error('User not found'));
            }

            next();
        } catch (error) {
            next(new Error('Invalid authentication token'));
        }
    });

    io.on('connection', (socket: AuthenticatedSocket) => {
        const userId = socket.userId!;
        
        console.log(`[WebSocket] User ${userId} connected: ${socket.id}`);

        // Track user's socket connections
        if (!userSockets.has(userId)) {
            userSockets.set(userId, new Set());
        }
        userSockets.get(userId)!.add(socket.id);

        // Mark user as online
        const wasOffline = !onlineUsers.has(userId);
        onlineUsers.add(userId);

        // Broadcast online status to relevant users
        if (wasOffline) {
            broadcastUserStatus(userId, true);
        }

        // Join user-specific room for direct messages
        socket.join(`user:${userId}`);

        // Handle joining conversation rooms
        socket.on('join_conversation', (otherUserId: string) => {
            const roomId = getConversationRoom(userId, otherUserId);
            socket.join(roomId);
            console.log(`[WebSocket] User ${userId} joined room ${roomId}`);
        });

        // Handle leaving conversation rooms
        socket.on('leave_conversation', (otherUserId: string) => {
            const roomId = getConversationRoom(userId, otherUserId);
            socket.leave(roomId);
            console.log(`[WebSocket] User ${userId} left room ${roomId}`);
        });

        // Handle typing indicators
        socket.on('typing_start', (data: { conversationId: string; receiverId: string }) => {
            const roomId = getConversationRoom(userId, data.receiverId);
            socket.to(roomId).emit('typing_start', {
                userId,
                conversationId: data.conversationId,
            });
        });

        socket.on('typing_stop', (data: { conversationId: string; receiverId: string }) => {
            const roomId = getConversationRoom(userId, data.receiverId);
            socket.to(roomId).emit('typing_stop', {
                userId,
                conversationId: data.conversationId,
            });
        });

        // Handle message read receipts
        socket.on('mark_read', async (data: { senderId: string; conversationId: string }) => {
            try {
                // Update messages in database
                await prisma.message.updateMany({
                    where: {
                        senderId: data.senderId,
                        receiverId: userId,
                        read: false,
                    },
                    data: { read: true },
                });

                // Notify sender that their messages were read
                emitToUser(data.senderId, 'messages_read', {
                    byUserId: userId,
                    conversationId: data.conversationId,
                });
            } catch (error) {
                console.error('[WebSocket] Error marking messages as read:', error);
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`[WebSocket] User ${userId} disconnected: ${socket.id}`);
            
            const sockets = userSockets.get(userId);
            if (sockets) {
                sockets.delete(socket.id);
                
                // If no more sockets for this user, mark as offline
                if (sockets.size === 0) {
                    userSockets.delete(userId);
                    onlineUsers.delete(userId);
                    broadcastUserStatus(userId, false);
                }
            }
        });
    });

    return io;
}

/**
 * Get the Socket.IO instance
 */
export function getIO(): SocketIOServer {
    if (!io) {
        throw new Error('Socket.IO not initialized. Call initializeWebSocket first.');
    }
    return io;
}

/**
 * Check if a user is online
 */
export function isUserOnline(userId: string): boolean {
    return onlineUsers.has(userId);
}

/**
 * Get online users list (for admin/monitoring)
 */
export function getOnlineUsers(): string[] {
    return Array.from(onlineUsers);
}

/**
 * Emit an event to a specific user
 */
export function emitToUser(userId: string, event: string, data: any): void {
    if (!io) return;
    io.to(`user:${userId}`).emit(event, data);
}

/**
 * Emit an event to a conversation room
 */
export function emitToConversation(
    userId1: string, 
    userId2: string, 
    event: string, 
    data: any,
    excludeUserId?: string
): void {
    if (!io) return;
    const roomId = getConversationRoom(userId1, userId2);
    
    if (excludeUserId) {
        // Emit to all in room except the sender
        io.to(roomId).except(`user:${excludeUserId}`).emit(event, data);
    } else {
        io.to(roomId).emit(event, data);
    }
}

/**
 * Broadcast new message to conversation participants
 */
export function broadcastNewMessage(message: any): void {
    const { senderId, receiverId } = message;
    
    // Emit to both users' rooms
    emitToUser(senderId, 'new_message', message);
    emitToUser(receiverId, 'new_message', message);
    
    // Emit to the conversation room
    emitToConversation(senderId, receiverId, 'new_message', message);
}

/**
 * Broadcast typing status to conversation
 */
export function broadcastTypingStatus(
    senderId: string, 
    receiverId: string, 
    isTyping: boolean
): void {
    const roomId = getConversationRoom(senderId, receiverId);
    if (!io) return;
    
    io.to(roomId).except(`user:${senderId}`).emit(isTyping ? 'typing_start' : 'typing_stop', {
        userId: senderId,
    });
}

/**
 * Broadcast reaction update to conversation participants
 */
export function broadcastReaction(reactionData: {
    messageId: string;
    emoji: string;
    userId: string;
    isAdded: boolean;
    senderId: string;
    receiverId: string;
    reactions: any[];
}): void {
    const { senderId, receiverId, messageId } = reactionData;
    
    // Emit to both users' rooms
    emitToUser(senderId, 'message_reaction', reactionData);
    emitToUser(receiverId, 'message_reaction', reactionData);
    
    // Emit to the conversation room
    emitToConversation(senderId, receiverId, 'message_reaction', reactionData);
}

/**
 * Broadcast message edit to conversation participants
 */
export function broadcastMessageEdit(editData: {
    messageId: string;
    content: string;
    edited: boolean;
    editedAt: Date | null;
    senderId: string;
    receiverId: string;
}): void {
    const { senderId, receiverId } = editData;
    
    // Emit to both users' rooms
    emitToUser(senderId, 'message_edited', editData);
    emitToUser(receiverId, 'message_edited', editData);
    
    // Emit to the conversation room
    emitToConversation(senderId, receiverId, 'message_edited', editData);
}

/**
 * Broadcast message deletion to conversation participants
 */
export function broadcastMessageDelete(deleteData: {
    messageId: string;
    deleted: boolean;
    deletedAt: Date | null;
    senderId: string;
    receiverId: string;
}): void {
    const { senderId, receiverId } = deleteData;
    
    // Emit to both users' rooms
    emitToUser(senderId, 'message_deleted', deleteData);
    emitToUser(receiverId, 'message_deleted', deleteData);
    
    // Emit to the conversation room
    emitToConversation(senderId, receiverId, 'message_deleted', deleteData);
}

/**
 * Broadcast message delivery status to sender
 */
export function broadcastMessageDelivered(deliveryData: {
    senderId: string;
    receiverId: string;
    messageIds: string[];
    deliveredAt: Date;
}): void {
    const { senderId } = deliveryData;
    
    // Only notify the sender that their messages were delivered
    emitToUser(senderId, 'messages_delivered', deliveryData);
}

/**
 * Broadcast user online/offline status
 */
function broadcastUserStatus(userId: string, isOnline: boolean): void {
    if (!io) return;
    
    // Get user's conversations and notify relevant users
    // For simplicity, we broadcast to all connected clients
    // In production, you might want to only notify "friends" or recent contacts
    io.emit('user_status_change', {
        userId,
        isOnline,
        timestamp: new Date().toISOString(),
    });
}

/**
 * Generate a consistent room ID for a conversation between two users
 */
function getConversationRoom(userId1: string, userId2: string): string {
    // Sort IDs to ensure consistent room naming
    const sortedIds = [userId1, userId2].sort();
    return `conversation:${sortedIds[0]}:${sortedIds[1]}`;
}
