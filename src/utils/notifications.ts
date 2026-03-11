import { Notification } from '../types';

export async function getNotificationPermission(): Promise<boolean> {
  return true;
}

export function formatNotificationTime(hour: number, minute = 0): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

export function groupNotificationsByDate(
  notifications: Notification[],
): Record<string, Notification[]> {
  return notifications.reduce<Record<string, Notification[]>>((groups, notification) => {
    const tIndex = notification.scheduledAt.indexOf('T');
    const dateKey = tIndex !== -1
      ? notification.scheduledAt.slice(0, tIndex)
      : notification.scheduledAt.slice(0, 10);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(notification);
    return groups;
  }, {});
}
