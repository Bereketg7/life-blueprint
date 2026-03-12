import {
  linearRegression,
  detectAnomalies,
  calculateInjuryRisk,
  calculateBurnoutRisk,
  projectWeightTrajectory,
} from '../services/analytics/predictiveAnalytics';
import { ActivityLog, SleepLog, MentalHealthLog } from '../types';

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

function makeSleep(date: string, duration = 7): SleepLog {
  return {
    id: `slp_${date}`,
    userId: 'u1',
    date,
    bedtime: '22:00',
    wakeTime: '05:00',
    duration,
    quality: 4,
    createdAt: new Date().toISOString(),
  };
}

function makeMental(date: string, mood: 1 | 2 | 3 | 4 | 5 = 3, energy: 1 | 2 | 3 | 4 | 5 = 3, stress: 1 | 2 | 3 | 4 | 5 = 3): MentalHealthLog {
  return {
    id: `mnt_${date}`,
    userId: 'u1',
    date,
    mood,
    stressLevel: stress,
    anxietyLevel: 2,
    energyLevel: energy,
    createdAt: new Date().toISOString(),
  };
}

describe('linearRegression', () => {
  it('fits a perfect line', () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = [2, 4, 6, 8, 10];
    const result = linearRegression(xs, ys);
    expect(result.slope).toBeCloseTo(2, 5);
    expect(result.intercept).toBeCloseTo(0, 5);
    expect(result.r2).toBeCloseTo(1, 5);
  });

  it('predict works', () => {
    const result = linearRegression([1, 2, 3], [2, 4, 6]);
    expect(result.predict(4)).toBeCloseTo(8, 4);
  });

  it('handles single-point input', () => {
    const result = linearRegression([1], [5]);
    expect(result.slope).toBe(0);
    expect(result.intercept).toBe(5);
  });

  it('R² is between 0 and 1', () => {
    const result = linearRegression([1, 2, 3, 4], [1, 3, 2, 5]);
    expect(result.r2).toBeGreaterThanOrEqual(0);
    expect(result.r2).toBeLessThanOrEqual(1);
  });
});

describe('detectAnomalies', () => {
  it('returns results for each value', () => {
    const values = [10, 11, 10, 12, 10, 100];
    const result = detectAnomalies(values);
    expect(result.length).toBe(values.length);
  });

  it('flags obvious outlier as anomaly', () => {
    const values = [10, 11, 9, 10, 11, 100];
    const result = detectAnomalies(values);
    const outlier = result.find(r => r.value === 100);
    expect(outlier?.isAnomaly).toBe(true);
  });

  it('does not flag normal values as anomaly', () => {
    const values = [10, 11, 9, 10, 11];
    const result = detectAnomalies(values);
    expect(result.every(r => !r.isAnomaly)).toBe(true);
  });

  it('includes zscore for each result', () => {
    const values = [10, 11, 12];
    const result = detectAnomalies(values);
    for (const r of result) {
      expect(typeof r.zscore).toBe('number');
    }
  });
});

describe('calculateInjuryRisk', () => {
  const TODAY = new Date().toISOString().split('T')[0];

  it('returns low risk for moderate activity', () => {
    const activity = [makeActivity(TODAY, 'moderate')];
    const risk = calculateInjuryRisk(activity, [makeSleep(TODAY)]);
    expect(risk.level).toBe('low');
    expect(risk.score).toBeLessThan(25);
  });

  it('detects high risk with 4+ consecutive high-intensity sessions', () => {
    const days = Array.from({ length: 5 }, (_, i) =>
      new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    );
    const activity = days.map(d => makeActivity(d, 'high'));
    const risk = calculateInjuryRisk(activity, []);
    expect(risk.score).toBeGreaterThan(0);
    expect(risk.factors.length).toBeGreaterThan(0);
  });

  it('adds sleep debt factor for < 6h avg sleep', () => {
    const days = Array.from({ length: 7 }, (_, i) =>
      new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    );
    const risk = calculateInjuryRisk([], days.map(d => makeSleep(d, 5)));
    const hasSleepFactor = risk.factors.some(f => f.toLowerCase().includes('sleep'));
    expect(hasSleepFactor).toBe(true);
  });

  it('risk level matches score bands', () => {
    const risk = calculateInjuryRisk([], []);
    const validLevels = ['low', 'moderate', 'high', 'critical'];
    expect(validLevels).toContain(risk.level);
  });
});

describe('calculateBurnoutRisk', () => {
  const TODAY = new Date().toISOString().split('T')[0];

  it('returns low risk for normal activity', () => {
    const risk = calculateBurnoutRisk([], [], []);
    expect(risk.level).toBe('low');
  });

  it('increases risk with low mood and high stress', () => {
    const days = Array.from({ length: 7 }, (_, i) =>
      new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    );
    const mental = days.map(d => makeMental(d, 2, 1, 5));
    const risk = calculateBurnoutRisk([], mental, []);
    expect(risk.score).toBeGreaterThan(20);
  });

  it('returns factors array', () => {
    const risk = calculateBurnoutRisk([], [], []);
    expect(Array.isArray(risk.factors)).toBe(true);
  });
});

describe('projectWeightTrajectory', () => {
  it('returns weight projection with data points', () => {
    const result = projectWeightTrajectory(80, -500, 90);
    expect(result.currentWeight).toBe(80);
    expect(result.projectedWeights.length).toBeGreaterThan(0);
  });

  it('shows weight decrease with caloric deficit', () => {
    const result = projectWeightTrajectory(80, -500, 90);
    const lastWeight = result.projectedWeights[result.projectedWeights.length - 1].weight;
    expect(lastWeight).toBeLessThan(80);
  });

  it('shows weight increase with caloric surplus', () => {
    const result = projectWeightTrajectory(70, 500, 90);
    const lastWeight = result.projectedWeights[result.projectedWeights.length - 1].weight;
    expect(lastWeight).toBeGreaterThan(70);
  });

  it('calculates target reach days', () => {
    const result = projectWeightTrajectory(80, -500, 90, 75);
    expect(result.targetReachDays).toBeDefined();
    expect(result.targetReachDays).toBeGreaterThan(0);
  });

  it('never goes below minimum weight', () => {
    const result = projectWeightTrajectory(50, -5000, 90);
    for (const pt of result.projectedWeights) {
      expect(pt.weight).toBeGreaterThanOrEqual(40);
    }
  });
});
