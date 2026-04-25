import { prisma } from '../lib/prisma';
import { UserRole } from '../generated/prisma';
import { broadcastNewMessage, broadcastReaction, broadcastMessageEdit, broadcastMessageDelete } from './websocket.service';

interface AttachmentData {
    url: string;
    name: string;
    size: string;
    type: string;
}

export async function sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    replyToId?: string,
    attachment?: AttachmentData
) {
    const data: any = {
        senderId,
        receiverId,
        content,
    };

    if (replyToId) {
        data.replyToId = replyToId;
    }

    if (attachment) {
        data.attachmentUrl = attachment.url;
        data.attachmentName = attachment.name;
        data.attachmentSize = attachment.size;
        data.attachmentType = attachment.type;
    }

    const message = await prisma.message.create({
        data,
        include: {
            sender: {
                select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true }
            },
            receiver: {
                select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true }
            },
            replyTo: {
                include: {
                    sender: {
                        select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true }
                    }
                }
            }
        }
    });

    // Broadcast the new message via WebSocket
    broadcastNewMessage(message);

    return message;
}

export async function getConversation(userId: string, otherUserId: string) {
    return prisma.message.findMany({
        where: {
            OR: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        },
        orderBy: { createdAt: 'asc' },
        include: {
            sender: {
                select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true }
            },
            replyTo: {
                include: {
                    sender: {
                        select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true }
                    }
                }
            },
            reactions: {
                include: {
                    user: { select: { id: true, firstName: true, lastName: true } }
                }
            }
        }
    });
}

export async function getConversations(userId: string) {
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: userId },
                { receiverId: userId }
            ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
            sender: { select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true } },
            receiver: { select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true } }
        }
    });

    const conversationMap = new Map();
    for (const msg of messages) {
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
        if (!conversationMap.has(otherUser.id)) {
            conversationMap.set(otherUser.id, {
                user: otherUser,
                lastMessage: msg,
                unreadCount: msg.receiverId === userId && !msg.read ? 1 : 0
            });
        } else {
            if (msg.receiverId === userId && !msg.read) {
                conversationMap.get(otherUser.id).unreadCount++;
            }
        }
    }
    
    return Array.from(conversationMap.values());
}

export async function markConversationAsRead(userId: string, otherUserId: string) {
    return prisma.message.updateMany({
        where: {
            receiverId: userId,
            senderId: otherUserId,
            read: false
        },
        data: {
            read: true
        }
    });
}

export async function getAccountsUsers() {
    return prisma.user.findMany({
        where: { role: 'ACCOUNTS' },
        select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true }
    });
}

// Add or remove a reaction to a message
export async function toggleReaction(userId: string, messageId: string, emoji: string) {
    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findFirst({
        where: {
            messageId,
            userId,
            emoji,
        },
    });

    let reactionResult;
    let isAdded: boolean;

    if (existingReaction) {
        // Remove reaction (toggle off)
        await prisma.reaction.delete({
            where: { id: existingReaction.id },
        });
        isAdded = false;
    } else {
        // Add reaction
        reactionResult = await prisma.reaction.create({
            data: {
                messageId,
                userId,
                emoji,
            },
            include: {
                user: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
        isAdded = true;
    }

    // Get updated message with all reactions
    const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
            sender: { select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true } },
            receiver: { select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true } },
            reactions: {
                include: {
                    user: { select: { id: true, firstName: true, lastName: true } },
                },
            },
        },
    });

    if (!message) {
        throw new Error('Message not found');
    }

    // Broadcast reaction update via WebSocket
    broadcastReaction({
        messageId,
        emoji,
        userId,
        isAdded,
        senderId: message.senderId,
        receiverId: message.receiverId,
        reactions: message.reactions,
    });

    return { message, isAdded, reaction: reactionResult };
}

// Get reactions for a message (for initial load)
export async function getMessageReactions(messageId: string) {
    return prisma.reaction.findMany({
        where: { messageId },
        include: {
            user: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'asc' },
    });
}
