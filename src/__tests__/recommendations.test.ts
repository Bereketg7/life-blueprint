import { generateRecommendations, recordRecommendationResponse, getAcceptanceRate } from '../services/recommendations/recommendationEngine';
import { ActivityLog, SleepLog, NutritionLog, MentalHealthLog } from '../types';

const TODAY = new Date().toISOString().split('T')[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];

function makeActivity(date: string, intensity: 'low' | 'moderate' | 'high' = 'moderate', duration = 30): ActivityLog {
  return {
    id: `act_${date}`,
    userId: 'u1',
    date,
    type: 'cardio',
    name: 'Run',
    duration,
    intensity,
    caloriesBurned: 300,
    createdAt: new Date().toISOString(),
  };
}

function makeSleep(date: string, duration = 7.5, quality: 1 | 2 | 3 | 4 | 5 = 4): SleepLog {
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

function makeNutrition(date: string, protein = 20): NutritionLog {
  return {
    id: `nut_${date}`,
    userId: 'u1',
    date,
    mealType: 'lunch',
    foodName: 'Chicken',
    calories: 500,
    protein,
    carbs: 50,
    fat: 15,
    createdAt: new Date().toISOString(),
  };
}

describe('generateRecommendations', () => {
  it('returns an array', () => {
    const result = generateRecommendations({ activity: [], sleep: [], nutrition: [], mental: [] });
    expect(Array.isArray(result)).toBe(true);
  });

  it('recommends more workouts when fewer than 3 this week', () => {
    const result = generateRecommendations({
      activity: [makeActivity(TODAY)],
      sleep: [],
      nutrition: [],
      mental: [],
    });
    const rec = result.find(r => r.title === 'Increase Workout Frequency');
    expect(rec).toBeDefined();
  });

  it('recommends recovery when all recent sessions were high intensity', () => {
    const result = generateRecommendations({
      activity: [
        makeActivity(TODAY, 'high'),
        makeActivity(YESTERDAY, 'high'),
        makeActivity(new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], 'high'),
      ],
      sleep: [],
      nutrition: [],
      mental: [],
    });
    const rec = result.find(r => r.title === 'Add a Recovery Day');
    expect(rec).toBeDefined();
  });

  it('recommends more sleep when average < 7h', () => {
    const dates = [TODAY, YESTERDAY, new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]];
    const result = generateRecommendations({
      activity: [],
      sleep: dates.map(d => makeSleep(d, 5.5)),
      nutrition: [],
      mental: [],
    });
    const rec = result.find(r => r.title === 'Prioritize More Sleep');
    expect(rec).toBeDefined();
  });

  it('recommends protein increase when average protein is low', () => {
    const dates = [TODAY, YESTERDAY, new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]];
    const result = generateRecommendations({
      activity: [],
      sleep: [],
      nutrition: dates.map(d => makeNutrition(d, 10)),
      mental: [],
    });
    const rec = result.find(r => r.title === 'Increase Protein Intake');
    expect(rec).toBeDefined();
  });

  it('sorts by priority descending', () => {
    const result = generateRecommendations({
      activity: [makeActivity(TODAY)],
      sleep: [makeSleep(TODAY, 5)],
      nutrition: [],
      mental: [],
    });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].priority).toBeLessThanOrEqual(result[i - 1].priority);
    }
  });

  it('each recommendation has required fields', () => {
    const result = generateRecommendations({
      activity: [],
      sleep: [makeSleep(TODAY, 5)],
      nutrition: [],
      mental: [],
    });
    for (const rec of result) {
      expect(typeof rec.id).toBe('string');
      expect(typeof rec.title).toBe('string');
      expect(rec.confidence).toBeGreaterThanOrEqual(0);
      expect(rec.confidence).toBeLessThanOrEqual(1);
      expect(rec.priority).toBeGreaterThan(0);
    }
  });
});

describe('recommendation feedback loop', () => {
  it('tracks acceptance rate', () => {
    recordRecommendationResponse('r1', true);
    recordRecommendationResponse('r2', true);
    recordRecommendationResponse('r3', false);
    const rate = getAcceptanceRate();
    expect(rate).toBeGreaterThan(0);
    expect(rate).toBeLessThanOrEqual(1);
  });
});
