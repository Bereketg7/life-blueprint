import { Notification } from '../../types';

export function createNotification(
  title: string,
  body: string,
  scheduledAt: string,
  relatedId?: string
): Notification {
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    title,
    body,
    scheduledAt,
    type: 'goal',
    relatedId,
  };
}

export async function scheduleGoalReminder(goalTitle: string, targetDate: string, goalId: string): Promise<Notification> {
  const notification = createNotification(
    'Goal Reminder',
    `Don't forget your goal: ${goalTitle}`,
    targetDate,
    goalId
  );
  console.log('Scheduled notification:', notification);
  return notification;
}

export async function cancelNotification(notificationId: string): Promise<void> {
  console.log('Cancelled notification:', notificationId);
}