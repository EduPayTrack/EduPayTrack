import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler';
import { requireAuth, requireRole } from '../middleware/auth';
import { ReminderCampaignStatus, ReminderScheduleType, UserRole } from '../generated/prisma';
import {
    getUserNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    createBulkNotifications,
} from '../services/notification.service';
import { prisma } from '../lib/prisma';
import {
    createReminderCampaign,
    listReminderCampaigns,
    runDueReminderCampaigns,
    runReminderCampaign,
    updateReminderCampaignStatus,
} from '../services/reminder-campaign.service';

export const notificationRouter = Router();

notificationRouter.use(requireAuth);

// Get my notifications
notificationRouter.get(
    '/',
    asyncHandler(async (req, res) => {
        const notifications = await getUserNotifications(req.user!.userId);
        res.status(200).json(notifications);
    })
);

// Mark a single notification read
notificationRouter.patch(
    '/:id/read',
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const notification = await markNotificationRead(req.user!.userId, id);
        res.status(200).json(notification);
    })
);

// Mark all read
notificationRouter.patch(
    '/read-all',
    asyncHandler(async (req, res) => {
        await markAllNotificationsRead(req.user!.userId);
        res.status(200).json({ message: 'All notifications marked as read' });
    })
);

// Admin trigger to send balance reminders
notificationRouter.post(
    '/admin-send',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const { studentIds } = req.body;
        
        let students: any[] = [];
        if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
            students = await prisma.student.findMany({
                where: { id: { in: studentIds } },
            });
        } else {
            // Target all students with a positive balance
            students = await prisma.student.findMany({
                where: { currentBalance: { gt: 0 } },
            });
        }

        const notifications = students.map((s) => ({
            userId: s.userId,
            title: 'Fee Balance Reminder',
            message: `Please be reminded that you have an outstanding fee balance of MK ${Number(s.currentBalance).toLocaleString()}. Kindly clear your balance.`,
            type: 'BALANCE_REMINDER' as const,
        }));

        if (notifications.length > 0) {
            await createBulkNotifications(notifications);
        }

        res.status(200).json({ message: `Sent ${notifications.length} reminders.` });
    })
);

notificationRouter.get(
    '/campaigns',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (_req, res) => {
        const campaigns = await listReminderCampaigns();
        res.status(200).json(campaigns);
    })
);

notificationRouter.post(
    '/campaigns',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const campaign = await createReminderCampaign(req.user!.userId, {
            name: req.body.name,
            scheduleType: req.body.scheduleType as ReminderScheduleType,
            dayOfWeek: req.body.dayOfWeek,
            sendHour: req.body.sendHour,
            sendMinute: req.body.sendMinute,
            minBalance: req.body.minBalance,
            maxBalance: req.body.maxBalance,
            titleTemplate: req.body.titleTemplate,
            messageTemplate: req.body.messageTemplate,
            targetStudentIds: req.body.targetStudentIds,
        });
        res.status(201).json(campaign);
    })
);

notificationRouter.patch(
    '/campaigns/:campaignId/status',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const campaign = await updateReminderCampaignStatus(
            req.params.campaignId,
            req.body.status as ReminderCampaignStatus
        );
        res.status(200).json(campaign);
    })
);

notificationRouter.post(
    '/campaigns/:campaignId/run',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const result = await runReminderCampaign(req.params.campaignId);
        res.status(200).json(result);
    })
);

notificationRouter.post(
    '/campaigns/run-due',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (_req, res) => {
        const result = await runDueReminderCampaigns();
        res.status(200).json(result);
    })
);

// Delete a single notification
notificationRouter.delete(
    '/:id',
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const userId = req.user!.userId;

        // Verify the notification belongs to this user
        const notification = await prisma.notification.findFirst({
            where: { id, userId }
        });

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        await prisma.notification.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Notification deleted' });
    })
);

// Delete all notifications for the user
notificationRouter.delete(
    '/',
    asyncHandler(async (req, res) => {
        const userId = req.user!.userId;

        const { count } = await prisma.notification.deleteMany({
            where: { userId }
        });

        res.status(200).json({ message: `Deleted ${count} notifications` });
    })
);
