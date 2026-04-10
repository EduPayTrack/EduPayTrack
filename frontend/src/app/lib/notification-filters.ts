import { useMemo } from 'react';

type NotificationItem = {
  id: string;
  read?: boolean;
  title?: string;
  description?: string;
  createdAt?: string;
  time?: string;
  type?: string;
};

type NotificationGroups = {
  today: NotificationItem[];
  yesterday: NotificationItem[];
  thisWeek: NotificationItem[];
  earlier: NotificationItem[];
};

type UseNotificationFiltersArgs = {
  notifications: NotificationItem[];
  activeTab: string;
  typeFilter: string;
  searchQuery: string;
  matchesTypeFilter: (notification: NotificationItem, typeFilter: string) => boolean;
};

function groupNotificationsByDate(notifications: NotificationItem[]): NotificationGroups {
  const groups: NotificationGroups = { today: [], yesterday: [], thisWeek: [], earlier: [] };
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt || notification.time || now.toISOString());
    if (date >= today) {
      groups.today.push(notification);
    } else if (date >= yesterday) {
      groups.yesterday.push(notification);
    } else if (date >= weekAgo) {
      groups.thisWeek.push(notification);
    } else {
      groups.earlier.push(notification);
    }
  });

  return groups;
}

export function useNotificationFilters({
  notifications,
  activeTab,
  typeFilter,
  searchQuery,
  matchesTypeFilter,
}: UseNotificationFiltersArgs) {
  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);
  const readCount = useMemo(() => notifications.filter((notification) => notification.read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return notifications.filter((notification) => {
      if (activeTab === 'unread' && notification.read) return false;
      if (activeTab === 'read' && !notification.read) return false;

      if (!matchesTypeFilter(notification, typeFilter)) return false;

      if (query.length > 0) {
        const searchable = `${notification.title || ''} ${notification.description || ''}`.toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [notifications, activeTab, typeFilter, searchQuery, matchesTypeFilter]);

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications]
  );

  return {
    unreadCount,
    readCount,
    filteredNotifications,
    groupedNotifications,
    hasNotifications: filteredNotifications.length > 0,
    hasAnyNotifications: notifications.length > 0,
  };
}
