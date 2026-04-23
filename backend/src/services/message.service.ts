import { prisma } from '../lib/prisma';
import { UserRole } from '../generated/prisma';

export async function sendMessage(senderId: string, receiverId: string, content: string) {
    return prisma.message.create({
        data: {
            senderId,
            receiverId,
            content,
        },
        include: {
            sender: {
                select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true }
            },
            receiver: {
                select: { id: true, firstName: true, lastName: true, role: true, profilePictureUrl: true }
            }
        }
    });
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
