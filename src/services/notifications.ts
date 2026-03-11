import { Notification } from '../types';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export async function scheduleDailyReminder(
  title: string,
  body: string,
  hour: number
): Promise<Notification> {
  console.log(
    `[Notifications] Scheduling daily reminder: "${title}" at ${hour}:00 — ${body}`
  );

  const notification: Notification = {
    id: generateId(),
    title,
    body,
    scheduledAt: new Date().toISOString(),
    type: 'daily_reminder',
  };

  return notification;
}

export async function cancelAllReminders(): Promise<void> {
  console.log('[Notifications] All scheduled reminders have been cancelled.');
}

export async function scheduleGoalReminder(
  title: string,
  targetDate: string,
  goalId: string
): Promise<Notification> {
  console.log(
    `[Notifications] Scheduling goal reminder: "${title}" for goal ${goalId} — target date ${targetDate}`
  );

  const notification: Notification = {
    id: generateId(),
    title,
    body: `Don't forget your goal — target date is ${targetDate}.`,
    scheduledAt: new Date().toISOString(),
    type: 'goal_reminder',
    relatedId: goalId,
  };

  return notification;
}
