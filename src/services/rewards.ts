import { ActivityLog, Streak, Badge, Achievement } from '../types';

export function calculateStreak(logs: ActivityLog[]): Streak {
  const sorted = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalDaysLogged = sorted.filter((l) => l.status === 'completed').length;

  // Calculate currentStreak — consecutive completed days from today backwards
  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;
  let lastLogDate = '';

  if (sorted.length > 0) {
    lastLogDate = sorted[0].date;
  }

  const completedDates = [
    ...new Set(
      sorted
        .filter((l) => l.status === 'completed')
        .map((l) => l.date)
    ),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Compute currentStreak (consecutive days from the most recent completed date)
  if (completedDates.length > 0) {
    currentStreak = 1;
    for (let i = 1; i < completedDates.length; i++) {
      const prev = new Date(completedDates[i - 1]);
      const curr = new Date(completedDates[i]);
      const diffDays = Math.round(
        (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  // Compute longestStreak across all completed dates
  runningStreak = 0;
  for (let i = 0; i < completedDates.length; i++) {
    if (i === 0) {
      runningStreak = 1;
    } else {
      const prev = new Date(completedDates[i - 1]);
      const curr = new Date(completedDates[i]);
      const diffDays = Math.round(
        (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      );
      runningStreak = diffDays === 1 ? runningStreak + 1 : 1;
    }
    if (longestStreak < runningStreak) longestStreak = runningStreak;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    lastLogDate,
    totalDaysLogged,
  };
}

const ALL_BADGES: Array<
  Badge & { streakRequired?: number; totalRequired?: number }
> = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first day of activity.',
    icon: '🎯',
    unlockedAt: null,
    requirement: '1 day streak',
    streakRequired: 1,
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day activity streak.',
    icon: '⚔️',
    unlockedAt: null,
    requirement: '7 day streak',
    streakRequired: 7,
  },
  {
    id: 'two_week_champion',
    name: 'Two Week Champion',
    description: 'Maintain a 14-day activity streak.',
    icon: '🏆',
    unlockedAt: null,
    requirement: '14 day streak',
    streakRequired: 14,
  },
  {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Maintain a 30-day activity streak.',
    icon: '👑',
    unlockedAt: null,
    requirement: '30 day streak',
    streakRequired: 30,
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Maintain a 50-day activity streak.',
    icon: '🦾',
    unlockedAt: null,
    requirement: '50 day streak',
    streakRequired: 50,
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Log a total of 100 completed activity days.',
    icon: '💯',
    unlockedAt: null,
    requirement: '100 total days logged',
    totalRequired: 100,
  },
];

export function checkBadgeEligibility(
  streak: Streak,
  _logs: ActivityLog[]
): Badge[] {
  const now = new Date().toISOString();

  return ALL_BADGES.filter((badge) => {
    if (badge.totalRequired !== undefined) {
      return streak.totalDaysLogged >= badge.totalRequired;
    }
    if (badge.streakRequired !== undefined) {
      return streak.longestStreak >= badge.streakRequired;
    }
    return false;
  }).map((badge) => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    unlockedAt: now,
    requirement: badge.requirement,
  }));
}

export function getAchievements(userId: string): Achievement[] {
  const now = new Date().toISOString();
  return [
    { id: 'ach_1', userId, badgeId: 'first_step', unlockedAt: now, streakCount: 1 },
    { id: 'ach_2', userId, badgeId: 'week_warrior', unlockedAt: now, streakCount: 7 },
    { id: 'ach_3', userId, badgeId: 'two_week_champion', unlockedAt: now, streakCount: 14 },
    { id: 'ach_4', userId, badgeId: 'monthly_master', unlockedAt: now, streakCount: 30 },
  ];
}

export function getMilestoneMessage(streak: Streak): string {
  const { currentStreak } = streak;
  if (currentStreak >= 100) return '🏅 Legendary! 100+ days — you are unstoppable!';
  if (currentStreak >= 50) return '🦾 Iron Will activated! 50 days and counting!';
  if (currentStreak >= 30) return '👑 Monthly Master! 30 days of pure dedication!';
  if (currentStreak >= 14) return '🏆 Two-week champion! Incredible consistency!';
  if (currentStreak >= 7) return '⚔️ Week Warrior! 7 days strong — keep going!';
  if (currentStreak >= 1) return '🎯 Great start! Every journey begins with one step.';
  return '🌱 Start today — your first streak is waiting!';
}
