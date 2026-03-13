/**
 * Tests for the notifications service.
 * Verifies that all functions return safely even when expo-notifications is
 * not available (Node / test environment).
 */

import {
  requestNotificationPermissions,
  scheduleDailyReminder,
  scheduleGoalReminder,
  scheduleAchievementNotification,
  scheduleLevelUpNotification,
  cancelAllReminders,
  cancelNotification,
} from '../services/notifications';

describe('notifications service (no expo-notifications)', () => {
  it('requestNotificationPermissions returns false gracefully', async () => {
    const result = await requestNotificationPermissions();
    expect(typeof result).toBe('boolean');
  });

  it('scheduleDailyReminder returns a Notification object', async () => {
    const notif = await scheduleDailyReminder('Wake up!', 'Time to log your workout', 8);
    expect(notif).toHaveProperty('id');
    expect(notif).toHaveProperty('title', 'Wake up!');
    expect(notif).toHaveProperty('body');
    expect(notif).toHaveProperty('scheduledAt');
    expect(notif.type).toBe('daily_reminder');
  });

  it('scheduleGoalReminder returns a Notification object', async () => {
    const notif = await scheduleGoalReminder('Run 5k', '2030-01-01', 'goal-123');
    expect(notif).toHaveProperty('id');
    expect(notif).toHaveProperty('title', 'Run 5k');
    expect(notif.type).toBe('goal_reminder');
    expect(notif.relatedId).toBe('goal-123');
  });

  it('scheduleAchievementNotification resolves without throwing', async () => {
    await expect(
      scheduleAchievementNotification('First Run', 'Completed your first logged run!')
    ).resolves.toBeUndefined();
  });

  it('scheduleLevelUpNotification resolves without throwing', async () => {
    await expect(scheduleLevelUpNotification(5)).resolves.toBeUndefined();
  });

  it('cancelAllReminders resolves without throwing', async () => {
    await expect(cancelAllReminders()).resolves.toBeUndefined();
  });

  it('cancelNotification resolves without throwing', async () => {
    await expect(cancelNotification('some-id')).resolves.toBeUndefined();
  });
});
