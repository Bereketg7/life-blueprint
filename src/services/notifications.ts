/**
 * Push Notifications Service — wraps expo-notifications.
 *
 * When expo-notifications is available (iOS / Android device or simulator)
 * the service uses the real API to schedule and manage local push
 * notifications. When it is not available (web, Node test environment) every
 * function is a safe no-op that returns a sensible default.
 *
 * Quick-start:
 *   1. Call requestNotificationPermissions() once at app start.
 *   2. Use scheduleDailyReminder() / scheduleGoalReminder() to create alerts.
 *   3. Call cancelAllReminders() to clear everything (e.g. on sign-out).
 */

import { Notification } from '../types';

// ── Lazy-load expo-notifications ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExpoNotifications = typeof import('expo-notifications');

function getNotificationsLib(): ExpoNotifications | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-notifications') as ExpoNotifications;
  } catch {
    return null;
  }
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

// ── Permissions ───────────────────────────────────────────────────────────

/**
 * Request notification permissions from the OS.
 * Returns true when permission is granted, false otherwise.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = getNotificationsLib();
  if (!Notifications) return false;

  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

// ── Channel setup (Android) ───────────────────────────────────────────────

// AndroidImportance.HIGH = 4; defined as a constant to avoid a magic number
// when the enum is not available (e.g. on iOS where the field doesn't exist).
const ANDROID_IMPORTANCE_HIGH = 4;

/**
 * Create the default notification channel required on Android 8+.
 * Safe to call multiple times.
 */
export async function setupNotificationChannel(): Promise<void> {
  const Notifications = getNotificationsLib();
  if (!Notifications?.setNotificationChannelAsync) return;

  try {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Life Blueprint',
      importance: Notifications.AndroidImportance?.HIGH ?? ANDROID_IMPORTANCE_HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4F86F7',
    });
  } catch {
    // No-op on platforms that do not support channels
  }
}

// ── Scheduling helpers ────────────────────────────────────────────────────

/**
 * Schedule a repeating daily reminder at the given hour (24-h clock).
 * Returns a Notification object representing the scheduled alert.
 */
export async function scheduleDailyReminder(
  title: string,
  body: string,
  hour: number,
): Promise<Notification> {
  const Notifications = getNotificationsLib();

  const notification: Notification = {
    id: generateId(),
    title,
    body,
    scheduledAt: new Date().toISOString(),
    type: 'daily_reminder',
  };

  if (Notifications) {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { type: 'daily_reminder' },
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
        },
      });
      notification.id = id;
    } catch (err) {
      console.warn('[Notifications] scheduleDailyReminder failed:', err);
    }
  } else {
    console.log(
      `[Notifications] Scheduling daily reminder: "${title}" at ${hour}:00 — ${body}`,
    );
  }

  return notification;
}

/**
 * Schedule a one-time reminder for a goal's target date.
 */
export async function scheduleGoalReminder(
  title: string,
  targetDate: string,
  goalId: string,
): Promise<Notification> {
  const Notifications = getNotificationsLib();
  const target = new Date(targetDate);

  const notification: Notification = {
    id: generateId(),
    title,
    body: `Don't forget your goal — target date is ${targetDate}.`,
    scheduledAt: target.toISOString(),
    type: 'goal_reminder',
    relatedId: goalId,
  };

  if (Notifications && target > new Date()) {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: notification.body,
          sound: true,
          data: { type: 'goal_reminder', goalId },
        },
        trigger: target,
      });
      notification.id = id;
    } catch (err) {
      console.warn('[Notifications] scheduleGoalReminder failed:', err);
    }
  } else {
    console.log(
      `[Notifications] Scheduling goal reminder: "${title}" for goal ${goalId} — target date ${targetDate}`,
    );
  }

  return notification;
}

/**
 * Schedule a one-time notification for an achievement unlock.
 */
export async function scheduleAchievementNotification(
  achievementName: string,
  description: string,
): Promise<void> {
  const Notifications = getNotificationsLib();
  if (!Notifications) {
    console.log(`[Notifications] Achievement unlocked: ${achievementName}`);
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🏆 Achievement Unlocked: ${achievementName}`,
        body: description,
        sound: true,
        data: { type: 'achievement' },
      },
      trigger: null, // deliver immediately
    });
  } catch (err) {
    console.warn('[Notifications] scheduleAchievementNotification failed:', err);
  }
}

/**
 * Schedule a one-time notification for a level-up event.
 */
export async function scheduleLevelUpNotification(newLevel: number): Promise<void> {
  const Notifications = getNotificationsLib();
  if (!Notifications) {
    console.log(`[Notifications] Level up! Now level ${newLevel}`);
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⬆️ Level Up! You're now Level ${newLevel}`,
        body: 'Keep up the amazing work on your health journey!',
        sound: true,
        data: { type: 'level_up', level: newLevel },
      },
      trigger: null,
    });
  } catch (err) {
    console.warn('[Notifications] scheduleLevelUpNotification failed:', err);
  }
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllReminders(): Promise<void> {
  const Notifications = getNotificationsLib();
  if (Notifications) {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      console.warn('[Notifications] cancelAllReminders failed:', err);
    }
  } else {
    console.log('[Notifications] All scheduled reminders have been cancelled.');
  }
}

/**
 * Cancel a single notification by its ID.
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  const Notifications = getNotificationsLib();
  if (Notifications) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (err) {
      console.warn('[Notifications] cancelNotification failed:', err);
    }
  }
}

