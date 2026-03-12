import {
  calculateConsistencyScore,
  generateHealthProjection,
  predictiveWarnings,
  momentumMessage,
} from '../services/awarenessEngine';
import { ActivityLog, SleepLog, NutritionLog, MentalHealthLog } from '../types';

const TODAY = new Date().toISOString().split('T')[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const TWO_DAYS_AGO = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

function makeActivity(date: string): ActivityLog {
  return {
    id: `act_${date}`,
    userId: 'u1',
    date,
    type: 'cardio',
    name: 'Running',
    duration: 30,
    intensity: 'moderate',
    caloriesBurned: 250,
    createdAt: new Date().toISOString(),
  };
}

function makeSleep(date: string, duration = 7.5): SleepLog {
  return {
    id: `slp_${date}`,
    userId: 'u1',
    date,
    bedtime: '22:00',
    wakeTime: '05:30',
    duration,
    quality: 4,
    createdAt: new Date().toISOString(),
  };
}

function makeNutrition(date: string): NutritionLog {
  return {
    id: `nut_${date}`,
    userId: 'u1',
    date,
    mealType: 'lunch',
    foodName: 'Chicken & Rice',
    calories: 600,
    protein: 40,
    carbs: 60,
    fat: 15,
    createdAt: new Date().toISOString(),
  };
}

function makeMental(date: string): MentalHealthLog {
  return {
    id: `mnt_${date}`,
    userId: 'u1',
    date,
    mood: 4,
    stressLevel: 2,
    anxietyLevel: 2,
    energyLevel: 4,
    createdAt: new Date().toISOString(),
  };
}

describe('calculateConsistencyScore', () => {
  it('returns a score between 0 and 100', () => {
    const score = calculateConsistencyScore(
      {
        activity: [makeActivity(TODAY), makeActivity(YESTERDAY)],
        sleep: [makeSleep(TODAY), makeSleep(YESTERDAY)],
        nutrition: [makeNutrition(TODAY)],
        mental: [makeMental(TODAY)],
      },
      7,
    );
    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(100);
  });

  it('returns 0 for empty logs', () => {
    const score = calculateConsistencyScore(
      { activity: [], sleep: [], nutrition: [], mental: [] },
      7,
    );
    expect(score.overall).toBe(0);
  });

  it('returns high score for consistent logging', () => {
    const days = [TODAY, YESTERDAY, TWO_DAYS_AGO];
    const score = calculateConsistencyScore(
      {
        activity: days.map(makeActivity),
        sleep: days.map((d) => makeSleep(d)),
        nutrition: days.map(makeNutrition),
        mental: days.map(makeMental),
      },
      3,
    );
    expect(score.overall).toBeGreaterThan(50);
  });

  it('includes category scores', () => {
    const score = calculateConsistencyScore(
      {
        activity: [makeActivity(TODAY)],
        sleep: [],
        nutrition: [],
        mental: [],
      },
      7,
    );
    expect(typeof score.activity).toBe('number');
    expect(typeof score.sleep).toBe('number');
    expect(typeof score.nutrition).toBe('number');
    expect(typeof score.mental).toBe('number');
  });

  it('returns trend property', () => {
    const score = calculateConsistencyScore(
      { activity: [makeActivity(TODAY)], sleep: [], nutrition: [], mental: [] },
      7,
    );
    expect(['improving', 'declining', 'stable']).toContain(score.trend);
  });
});

describe('generateHealthProjection', () => {
  it('returns a HealthProjection object', () => {
    const score = calculateConsistencyScore(
      {
        activity: [makeActivity(TODAY)],
        sleep: [makeSleep(TODAY)],
        nutrition: [makeNutrition(TODAY)],
        mental: [makeMental(TODAY)],
      },
      7,
    );
    const projection = generateHealthProjection(score, 'weight-loss', 80, 70);
    expect(projection).toHaveProperty('currentScore');
    expect(projection).toHaveProperty('projectedScore3Month');
    expect(projection).toHaveProperty('projectedScore6Month');
    expect(projection).toHaveProperty('projectedScore1Year');
    expect(projection).toHaveProperty('goalReachDate');
    expect(Array.isArray(projection.keyInsights)).toBe(true);
    expect(Array.isArray(projection.warnings)).toBe(true);
  });

  it('clamps projected scores to 0-100', () => {
    const score = {
      overall: 95,
      activity: 95,
      nutrition: 95,
      sleep: 95,
      mental: 95,
      trend: 'improving' as const,
      weeklyBreakdown: [],
    };
    const projection = generateHealthProjection(score, 'general-wellness');
    expect(projection.projectedScore3Month).toBeLessThanOrEqual(100);
    expect(projection.projectedScore6Month).toBeLessThanOrEqual(100);
    expect(projection.projectedScore1Year).toBeLessThanOrEqual(100);
  });
});

describe('predictiveWarnings', () => {
  it('returns an array of strings', () => {
    const warnings = predictiveWarnings({
      activity: [],
      sleep: [],
      nutrition: [],
      mental: [],
    });
    expect(Array.isArray(warnings)).toBe(true);
  });

  it('generates sleep warning for low sleep hours', () => {
    const logs = {
      activity: [],
      sleep: [TODAY, YESTERDAY, TWO_DAYS_AGO].map((d) =>
        makeSleep(d, 4.5), // below 6h threshold
      ),
      nutrition: [],
      mental: [],
    };
    const warnings = predictiveWarnings(logs);
    const hasSleepWarning = warnings.some(
      (w) => w.toLowerCase().includes('sleep') || w.toLowerCase().includes('immune'),
    );
    expect(hasSleepWarning).toBe(true);
  });

  it('generates stress warning for high stress', () => {
    const highStressLog: MentalHealthLog = {
      ...makeMental(TODAY),
      stressLevel: 5,
    };
    const logs = {
      activity: [],
      sleep: [],
      nutrition: [],
      mental: [highStressLog, { ...highStressLog, id: 'mnt2', date: YESTERDAY }],
    };
    const warnings = predictiveWarnings(logs);
    const hasStressWarning = warnings.some((w) => w.toLowerCase().includes('stress'));
    expect(hasStressWarning).toBe(true);
  });
});

describe('momentumMessage', () => {
  it('returns high momentum message for 90+', () => {
    const msg = momentumMessage(92, 'weight-loss', '2026-06-01');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns steady progress message for 70-89', () => {
    const msg = momentumMessage(75, 'muscle-gain');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns deviation warning for under 70', () => {
    const msg = momentumMessage(60, 'general-wellness');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns critical message for under 50', () => {
    const msg = momentumMessage(40, 'weight-loss');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });
});