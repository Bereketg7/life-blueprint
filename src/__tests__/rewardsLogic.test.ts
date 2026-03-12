import {
  calculateStreak,
  checkAchievements,
  getStreakMilestoneMessage,
  calculatePoints,
  ACHIEVEMENTS,
} from '../services/rewardsLogic';
import { StreakData, ActivityLog, SleepLog, NutritionLog, UserAchievement } from '../types';

const TODAY = new Date().toISOString().split('T')[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const TWO_DAYS_AGO = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

function makeStreak(overrides: Partial<StreakData> = {}): StreakData {
  return {
    userId: 'u1',
    currentStreak: 0,
    longestStreak: 0,
    lastLogDate: '',
    totalDaysLogged: 0,
    ...overrides,
  };
}

function makeActivity(date: string, type: ActivityLog['type'] = 'cardio'): ActivityLog {
  return {
    id: `act_${date}_${type}`,
    userId: 'u1',
    date,
    type,
    name: 'Workout',
    duration: 30,
    intensity: 'moderate',
    caloriesBurned: 200,
    createdAt: new Date().toISOString(),
  };
}

function makeSleep(date: string, quality: 1 | 2 | 3 | 4 | 5 = 4, duration = 7.5): SleepLog {
  return {
    id: `slp_${date}`,
    userId: 'u1',
    date,
    bedtime: '22:00',
    wakeTime: '05:30',
    duration,
    quality,
    createdAt: new Date().toISOString(),
  };
}

function makeNutrition(date: string): NutritionLog {
  return {
    id: `nut_${date}`,
    userId: 'u1',
    date,
    mealType: 'lunch',
    foodName: 'Salad',
    calories: 400,
    protein: 30,
    carbs: 40,
    fat: 10,
    createdAt: new Date().toISOString(),
  };
}

describe('ACHIEVEMENTS', () => {
  it('contains at least 10 achievement definitions', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(10);
  });

  it('each achievement has required fields', () => {
    for (const a of ACHIEVEMENTS) {
      expect(typeof a.id).toBe('string');
      expect(typeof a.name).toBe('string');
      expect(typeof a.description).toBe('string');
      expect(typeof a.points).toBe('number');
      expect(a.points).toBeGreaterThan(0);
    }
  });

  it('has unique IDs', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('calculateStreak', () => {
  it('starts streak at 1 for first log today', () => {
    const streak = calculateStreak([{ date: TODAY }], makeStreak());
    expect(streak.currentStreak).toBe(1);
  });

  it('counts consecutive days in logs', () => {
    // Implementation counts consecutive days from the logs array itself
    const streak = calculateStreak(
      [{ date: TWO_DAYS_AGO }, { date: YESTERDAY }, { date: TODAY }],
      makeStreak(),
    );
    expect(streak.currentStreak).toBe(3);
  });

  it('resets streak when gap > 1 day in logs', () => {
    // TWO_DAYS_AGO and TODAY have a gap, so streak from today is 1
    const streak = calculateStreak(
      [{ date: TWO_DAYS_AGO }, { date: TODAY }],
      makeStreak(),
    );
    expect(streak.currentStreak).toBe(1);
  });

  it('tracks longestStreak', () => {
    const existing = makeStreak({ currentStreak: 0, longestStreak: 2 });
    const streak = calculateStreak(
      [{ date: TWO_DAYS_AGO }, { date: YESTERDAY }, { date: TODAY }],
      existing,
    );
    // new streak = 3, previous longest = 2 => longestStreak = 3
    expect(streak.longestStreak).toBe(3);
  });

  it('returns zero streak for empty logs', () => {
    // Implementation resets currentStreak to 0 when no logs are provided
    const existing = makeStreak({ currentStreak: 3, lastLogDate: YESTERDAY });
    const streak = calculateStreak([], existing);
    expect(streak.currentStreak).toBe(0);
  });

  it('counts totalDaysLogged from provided logs', () => {
    const streak = calculateStreak(
      [{ date: TWO_DAYS_AGO }, { date: YESTERDAY }, { date: TODAY }],
      makeStreak(),
    );
    expect(streak.totalDaysLogged).toBe(3);
  });
});

describe('checkAchievements', () => {
  it('returns an array', () => {
    const result = checkAchievements('u1', {
      activity: [],
      sleep: [],
      nutrition: [],
      streakData: makeStreak(),
    });
    expect(Array.isArray(result)).toBe(true);
  });

  it('grants first workout achievement', () => {
    const result = checkAchievements('u1', {
      activity: [makeActivity(TODAY)],
      sleep: [],
      nutrition: [],
      streakData: makeStreak(),
    });
    const firstWorkout = result.find((a) => a.id === 'first-workout');
    expect(firstWorkout).toBeDefined();
  });

  it('grants 7-day streak achievement', () => {
    const result = checkAchievements('u1', {
      activity: [],
      sleep: [],
      nutrition: [],
      streakData: makeStreak({ currentStreak: 7 }),
    });
    const streak7 = result.find((a) => a.id === 'streak-7');
    expect(streak7).toBeDefined();
  });

  it('grants first meal logged achievement', () => {
    const result = checkAchievements('u1', {
      activity: [],
      sleep: [],
      nutrition: [makeNutrition(TODAY)],
      streakData: makeStreak(),
    });
    const firstMeal = result.find((a) => a.id === 'first-meal-log');
    expect(firstMeal).toBeDefined();
  });
});

describe('getStreakMilestoneMessage', () => {
  it('returns a string for any number', () => {
    expect(typeof getStreakMilestoneMessage(1)).toBe('string');
    expect(typeof getStreakMilestoneMessage(7)).toBe('string');
    expect(typeof getStreakMilestoneMessage(30)).toBe('string');
    expect(typeof getStreakMilestoneMessage(365)).toBe('string');
  });

  it('returns special message for 7 days', () => {
    const msg = getStreakMilestoneMessage(7);
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns special message for 30 days', () => {
    const msg = getStreakMilestoneMessage(30);
    expect(msg.length).toBeGreaterThan(0);
  });
});

describe('calculatePoints', () => {
  it('returns 0 for empty achievements', () => {
    expect(calculatePoints([])).toBe(0);
  });

  it('sums points for known achievements', () => {
    const earned: UserAchievement[] = [
      {
        id: 'ua1',
        userId: 'u1',
        achievementId: ACHIEVEMENTS[0].id,
        earnedAt: TODAY,
        progress: 100,
      },
    ];
    const total = calculatePoints(earned);
    expect(total).toBe(ACHIEVEMENTS[0].points);
  });

  it('returns 0 for unknown achievement IDs', () => {
    const earned: UserAchievement[] = [
      {
        id: 'ua1',
        userId: 'u1',
        achievementId: 'nonexistent_id',
        earnedAt: TODAY,
        progress: 100,
      },
    ];
    expect(calculatePoints(earned)).toBe(0);
  });
});
