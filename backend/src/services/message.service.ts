import { prisma } from '../lib/prisma';
import { UserRole } from '../generated/prisma';
import { broadcastNewMessage, broadcastReaction } from './websocket.service';

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
