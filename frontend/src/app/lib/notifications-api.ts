import { apiFetch } from './api';

export async function listNotifications() {
  return apiFetch<any[]>('/notifications');
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await apiFetch(`/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch('/notifications/read-all', { method: 'PATCH' });
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await apiFetch(`/notifications/${notificationId}`, { method: 'DELETE' });
}

export async function clearAllNotifications(): Promise<void> {
  await apiFetch('/notifications', { method: 'DELETE' });
}
