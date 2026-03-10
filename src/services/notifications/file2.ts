import { Notification } from '../../types';

export function formatNotificationTime(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isNotificationDue(notification: Notification): boolean {
  return new Date(notification.scheduledAt) <= new Date();
}

export function groupNotificationsByDate(notifications: Notification[]): Record<string, Notification[]> {
  return notifications.reduce<Record<string, Notification[]>>((groups, notif) => {
    const date = notif.scheduledAt.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(notif);
    return groups;
  }, {});
}