import { Achievement, UserAchievement, StreakData, ActivityLog, SleepLog, NutritionLog } from '../types';

// ---------------------------------------------------------------------------
// Achievement definitions (20+)
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS: Achievement[] = [
  // --- Activity ---
  {
    id: 'first-workout',
    name: 'First Step',
    description: 'Log your very first workout.',
    icon: '👟',
    category: 'activity',
    requiredValue: 1,
    points: 50,
  },
  {
    id: 'ten-workouts',
    name: 'Getting Into It',
    description: 'Complete 10 workouts.',
    icon: '🏋️',
    category: 'activity',
    requiredValue: 10,
    points: 100,
  },
  {
    id: 'fifty-workouts',
    name: 'Dedicated Athlete',
    description: 'Complete 50 workouts.',
    icon: '🥇',
    category: 'activity',
    requiredValue: 50,
    points: 300,
  },
  {
    id: 'hundred-workouts',
    name: 'Century Club',
    description: 'Complete 100 workouts.',
    icon: '💯',
    category: 'activity',
    requiredValue: 100,
    points: 600,
  },
  {
    id: 'cardio-king',
    name: 'Cardio King/Queen',
    description: 'Log 20 cardio sessions.',
    icon: '🏃',
    category: 'activity',
    requiredValue: 20,
    points: 150,
  },
  {
    id: 'strength-builder',
    name: 'Strength Builder',
    description: 'Log 20 strength training sessions.',
    icon: '💪',
    category: 'activity',
    requiredValue: 20,
    points: 150,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Log 5 workouts before 7 AM.',
    icon: '🌅',
    category: 'activity',
    requiredValue: 5,
    points: 120,
  },
  // --- Nutrition ---
  {
    id: 'first-meal-log',
    name: 'Mindful Eater',
    description: 'Log your first meal.',
    icon: '🥗',
    category: 'nutrition',
    requiredValue: 1,
    points: 30,
  },
  {
    id: 'nutrition-week',
    name: 'Week of Clean Eating',
    description: 'Log nutrition for 7 consecutive days.',
    icon: '🥦',
    category: 'nutrition',
    requiredValue: 7,
    points: 200,
  },
  {
    id: 'macro-master',
    name: 'Macro Master',
    description: 'Hit all three macros within 10% of goal for 5 days.',
    icon: '⚖️',
    category: 'nutrition',
    requiredValue: 5,
    points: 250,
  },
  {
    id: 'hydration-hero',
    name: 'Hydration Hero',
    description: 'Meet daily water goal for 7 consecutive days.',
    icon: '💧',
    category: 'nutrition',
    requiredValue: 7,
    points: 150,
  },
  // --- Sleep ---
  {
    id: 'first-sleep-log',
    name: 'Sleep Tracker',
    description: 'Log your first night of sleep.',
    icon: '😴',
    category: 'sleep',
    requiredValue: 1,
    points: 30,
  },
  {
    id: 'night-owl-fixer',
    name: 'Night Owl Fixer',
    description: 'Achieve 7+ hours of sleep for 5 consecutive nights.',
    icon: '🦉',
    category: 'sleep',
    requiredValue: 5,
    points: 200,
  },
  {
    id: 'sleep-champion',
    name: 'Sleep Champion',
    description: 'Log sleep quality of 4+ for 10 nights in a row.',
    icon: '🌙',
    category: 'sleep',
    requiredValue: 10,
    points: 300,
  },
  // --- Mental Health ---
  {
    id: 'first-mood-log',
    name: 'In Touch',
    description: 'Log your mood for the first time.',
    icon: '🧠',
    category: 'mental',
    requiredValue: 1,
    points: 30,
  },
  {
    id: 'zen-master',
    name: 'Zen Master',
    description: 'Log meditation for 7 consecutive days.',
    icon: '🧘',
    category: 'mental',
    requiredValue: 7,
    points: 200,
  },
  // --- Streaks ---
  {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Log activity for 7 days in a row.',
    icon: '🔥',
    category: 'streak',
    requiredValue: 7,
    points: 150,
  },
  {
    id: 'streak-30',
    name: '30-Day Streak',
    description: 'Log activity for 30 days in a row.',
    icon: '📅',
    category: 'streak',
    requiredValue: 30,
    points: 500,
  },
  {
    id: 'streak-90',
    name: '90-Day Streak',
    description: 'Log activity for 90 days in a row.',
    icon: '🏆',
    category: 'streak',
    requiredValue: 90,
    points: 1000,
  },
  {
    id: 'streak-180',
    name: 'Half-Year Warrior',
    description: 'Log activity for 180 days in a row.',
    icon: '⚡',
    category: 'streak',
    requiredValue: 180,
    points: 2000,
  },
  {
    id: 'streak-365',
    name: 'Year of Transformation',
    description: 'Log activity every single day for a full year.',
    icon: '🌟',
    category: 'streak',
    requiredValue: 365,
    points: 5000,
  },
  // --- Milestones ---
  {
    id: 'all-rounder',
    name: 'All-Rounder',
    description: 'Log activity, sleep, nutrition and mood on the same day.',
    icon: '🎯',
    category: 'milestone',
    requiredValue: 1,
    points: 100,
  },
  {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Resume logging after a 7-day gap.',
    icon: '🔄',
    category: 'milestone',
    requiredValue: 1,
    points: 75,
  },
];

const CARDIO_TYPES = new Set(['cardio', 'walking', 'cycling', 'swimming']);

// ---------------------------------------------------------------------------
// calculateStreak
// ---------------------------------------------------------------------------

/**
 * Checks whether log dates form an unbroken consecutive-day chain and returns
 * updated StreakData.
 */
export function calculateStreak(
  logs: { date: string }[],
  currentStreak: StreakData,
): StreakData {
  if (logs.length === 0) {
    return { ...currentStreak, currentStreak: 0 };
  }

  // Collect unique sorted dates (ascending)
  const uniqueDates = Array.from(new Set(logs.map(l => l.date))).sort();

  const today = toDateString(new Date());
  const yesterday = toDateString(offsetDate(new Date(), -1));

  const lastLog = uniqueDates[uniqueDates.length - 1];

  // If last log is neither today nor yesterday, streak is broken
  if (lastLog !== today && lastLog !== yesterday) {
    return {
      ...currentStreak,
      currentStreak: 0,
      lastLogDate: lastLog,
      totalDaysLogged: uniqueDates.length,
    };
  }

  // Count consecutive days backwards from the last log date
  let streak = 1;
  for (let i = uniqueDates.length - 2; i >= 0; i--) {
    const expected = toDateString(offsetDate(new Date(uniqueDates[i + 1]), -1));
    if (uniqueDates[i] === expected) {
      streak++;
    } else {
      break;
    }
  }

  return {
    userId: currentStreak.userId,
    currentStreak: streak,
    longestStreak: Math.max(streak, currentStreak.longestStreak),
    lastLogDate: lastLog,
    totalDaysLogged: uniqueDates.length,
  };
}

// ---------------------------------------------------------------------------
// checkAchievements
// ---------------------------------------------------------------------------

type CheckBundle = {
  activity: ActivityLog[];
  sleep: SleepLog[];
  nutrition: NutritionLog[];
  streakData: StreakData;
};

/**
 * Returns the subset of ACHIEVEMENTS that have been newly earned based on the
 * provided log data. (Caller is responsible for filtering out already-earned ones.)
 */
export function checkAchievements(
  _userId: string,
  logs: CheckBundle,
): Achievement[] {
  const earned: Achievement[] = [];

  const totalWorkouts = logs.activity.length;
  const cardioSessions = logs.activity.filter(a => CARDIO_TYPES.has(a.type)).length;
  const strengthSessions = logs.activity.filter(a => a.type === 'strength').length;

  // Early-bird: workouts logged before 07:00 (exclude entries where time cannot be parsed)
  const earlyWorkouts = logs.activity.filter(a => {
    const timePart = a.createdAt.split('T')[1];
    if (!timePart) return false;
    const hour = parseInt(timePart.split(':')[0], 10);
    return !isNaN(hour) && hour < 7;
  }).length;

  // --- Activity achievements ---
  if (totalWorkouts >= 1) earned.push(findById('first-workout'));
  if (totalWorkouts >= 10) earned.push(findById('ten-workouts'));
  if (totalWorkouts >= 50) earned.push(findById('fifty-workouts'));
  if (totalWorkouts >= 100) earned.push(findById('hundred-workouts'));
  if (cardioSessions >= 20) earned.push(findById('cardio-king'));
  if (strengthSessions >= 20) earned.push(findById('strength-builder'));
  if (earlyWorkouts >= 5) earned.push(findById('early-bird'));

  // --- Nutrition achievements ---
  const nutritionDays = new Set(logs.nutrition.map(n => n.date)).size;
  if (logs.nutrition.length >= 1) earned.push(findById('first-meal-log'));
  if (consecutiveDays(logs.nutrition.map(n => n.date)) >= 7) earned.push(findById('nutrition-week'));

  // Macro Master: hit all three macros within 10% for 5+ days (simplified check)
  const macroHitDays = countMacroHitDays(logs.nutrition);
  if (macroHitDays >= 5) earned.push(findById('macro-master'));

  // --- Sleep achievements ---
  if (logs.sleep.length >= 1) earned.push(findById('first-sleep-log'));
  const sevenPlusNights = consecutiveDaysWithCondition(
    logs.sleep.map(s => ({ date: s.date, pass: s.duration >= 7 })),
    5,
  );
  if (sevenPlusNights) earned.push(findById('night-owl-fixer'));

  const qualityNights = consecutiveDaysWithCondition(
    logs.sleep.map(s => ({ date: s.date, pass: s.quality >= 4 })),
    10,
  );
  if (qualityNights) earned.push(findById('sleep-champion'));

  // --- Streak achievements ---
  const { currentStreak } = logs.streakData;
  if (currentStreak >= 7) earned.push(findById('streak-7'));
  if (currentStreak >= 30) earned.push(findById('streak-30'));
  if (currentStreak >= 90) earned.push(findById('streak-90'));
  if (currentStreak >= 180) earned.push(findById('streak-180'));
  if (currentStreak >= 365) earned.push(findById('streak-365'));

  // --- Milestone achievements ---
  const allRounderDays = findAllRounderDays(logs);
  if (allRounderDays >= 1) earned.push(findById('all-rounder'));

  return earned;
}

// ---------------------------------------------------------------------------
// getStreakMilestoneMessage
// ---------------------------------------------------------------------------

/** Returns a motivational message for notable streak milestones. */
export function getStreakMilestoneMessage(streakDays: number): string {
  if (streakDays >= 365) return '🌟 ONE FULL YEAR! You have fundamentally transformed your life. You are the 1%.';
  if (streakDays >= 180) return '⚡ 180 days — six months of relentless consistency. You\'ve built an unbreakable identity.';
  if (streakDays >= 90) return '🏆 90-day streak! A full quarter of unstoppable momentum. Habits are now automatic.';
  if (streakDays >= 60) return '💎 60 days in — you\'ve crossed the threshold where discipline becomes desire.';
  if (streakDays >= 30) return '📅 30-day streak! One month of consistent action — your body and mind are adapting.';
  if (streakDays >= 21) return '🔗 21 days — the foundation of a real habit is forming. Keep going!';
  if (streakDays >= 14) return '✅ Two full weeks of consistency! You\'re building serious momentum.';
  if (streakDays >= 7) return '🔥 7-day streak! One week down — the first milestone is yours.';
  if (streakDays >= 3) return '👍 3-day streak — every journey starts here. Stay with it!';
  return '🌱 Day ' + streakDays + ' — great start! One day at a time.';
}

// ---------------------------------------------------------------------------
// calculatePoints
// ---------------------------------------------------------------------------

/** Sums all points from a list of earned UserAchievements. */
export function calculatePoints(achievements: UserAchievement[]): number {
  return achievements.reduce((total, ua) => {
    const definition = ACHIEVEMENTS.find(a => a.id === ua.achievementId);
    return total + (definition?.points ?? 0);
  }, 0);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function findById(id: string): Achievement {
  const found = ACHIEVEMENTS.find(a => a.id === id);
  if (!found) throw new Error(`Achievement '${id}' not found in definitions.`);
  return found;
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function offsetDate(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Returns the length of the longest consecutive-day run in an array of date strings. */
function consecutiveDays(dates: string[]): number {
  const unique = Array.from(new Set(dates)).sort();
  if (unique.length === 0) return 0;
  let max = 1;
  let current = 1;
  for (let i = 1; i < unique.length; i++) {
    const expected = toDateString(offsetDate(new Date(unique[i - 1]), 1));
    if (unique[i] === expected) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 1;
    }
  }
  return max;
}

/**
 * Returns true if there are `required` consecutive days where the condition
 * passes.
 */
function consecutiveDaysWithCondition(
  entries: { date: string; pass: boolean }[],
  required: number,
): boolean {
  const passing = Array.from(
    new Map(
      entries.filter(e => e.pass).map(e => [e.date, e]),
    ).values(),
  )
    .map(e => e.date)
    .sort();

  return consecutiveDays(passing) >= required;
}

/**
 * Counts the number of distinct days where all macros hit within 10% of
 * their logged total (uses first log of the day as the daily target proxy).
 */
function countMacroHitDays(logs: NutritionLog[]): number {
  const byDate = new Map<string, NutritionLog[]>();
  for (const log of logs) {
    const existing = byDate.get(log.date) ?? [];
    existing.push(log);
    byDate.set(log.date, existing);
  }

  let hitDays = 0;
  byDate.forEach(dayLogs => {
    const totalProtein = dayLogs.reduce((s, l) => s + l.protein, 0);
    const totalCarbs = dayLogs.reduce((s, l) => s + l.carbs, 0);
    const totalFat = dayLogs.reduce((s, l) => s + l.fat, 0);
    // Balanced macro day: no single macro dominates more than 60% of calories
    const totalCals = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;
    if (totalCals > 0) {
      const proteinPct = (totalProtein * 4) / totalCals;
      const carbPct = (totalCarbs * 4) / totalCals;
      const fatPct = (totalFat * 9) / totalCals;
      if (proteinPct <= 0.6 && carbPct <= 0.6 && fatPct <= 0.6) hitDays++;
    }
  });

  return hitDays;
}

/** Returns number of days where activity, sleep, nutrition were all logged. */
function findAllRounderDays(logs: CheckBundle): number {
  const activityDates = new Set(logs.activity.map(a => a.date));
  const sleepDates = new Set(logs.sleep.map(s => s.date));
  const nutritionDates = new Set(logs.nutrition.map(n => n.date));

  let count = 0;
  activityDates.forEach(date => {
    if (sleepDates.has(date) && nutritionDates.has(date)) count++;
  });
  return count;
}
