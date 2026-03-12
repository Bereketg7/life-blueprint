import { ActivityLog, SleepLog, NutritionLog, MentalHealthLog } from '../../types';

// --- OLS Linear Regression ---
export interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
  predict: (x: number) => number;
}

export function linearRegression(xs: number[], ys: number[]): RegressionResult {
  const n = xs.length;
  if (n < 2) {
    return { slope: 0, intercept: ys[0] ?? 0, r2: 0, predict: () => ys[0] ?? 0 };
  }

  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;

  let ssXY = 0;
  let ssXX = 0;
  let ssTot = 0;
  let ssRes = 0;

  for (let i = 0; i < n; i++) {
    ssXY += (xs[i] - xMean) * (ys[i] - yMean);
    ssXX += (xs[i] - xMean) ** 2;
    ssTot += (ys[i] - yMean) ** 2;
  }

  const slope = ssXX !== 0 ? ssXY / ssXX : 0;
  const intercept = yMean - slope * xMean;

  // Calculate R²
  for (let i = 0; i < n; i++) {
    const predicted = slope * xs[i] + intercept;
    ssRes += (ys[i] - predicted) ** 2;
  }

  const r2 = ssTot !== 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;

  return {
    slope,
    intercept,
    r2,
    predict: (x: number) => slope * x + intercept,
  };
}

// --- ±2σ Anomaly Detection ---
export interface AnomalyResult {
  value: number;
  index: number;
  zscore: number;
  isAnomaly: boolean;
}

export function detectAnomalies(values: number[]): AnomalyResult[] {
  if (values.length < 3) {
    return values.map((value, index) => ({ value, index, zscore: 0, isAnomaly: false }));
  }

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return values.map((value, index) => {
    const zscore = stdDev !== 0 ? Math.abs((value - mean) / stdDev) : 0;
    return { value, index, zscore, isAnomaly: zscore > 2 };
  });
}

// --- Injury Risk Scoring ---
export interface InjuryRisk {
  score: number; // 0-100
  level: 'low' | 'moderate' | 'high' | 'critical';
  factors: string[];
}

export function calculateInjuryRisk(
  activity: ActivityLog[],
  sleep: SleepLog[],
): InjuryRisk {
  const factors: string[] = [];
  let score = 0;

  const recent7 = activity.slice(-7);
  const consecutiveHard = recent7.filter(l => l.intensity === 'high').length;

  if (consecutiveHard >= 4) {
    score += 35;
    factors.push('4+ consecutive high-intensity sessions');
  } else if (consecutiveHard >= 3) {
    score += 20;
    factors.push('3+ consecutive high-intensity sessions');
  }

  // Check for rapid volume increase
  const prev7 = activity.slice(-14, -7);
  const recentVolume = recent7.reduce((s, l) => s + l.duration, 0);
  const prevVolume = prev7.reduce((s, l) => s + l.duration, 0);
  if (prevVolume > 0 && recentVolume / prevVolume > 1.3) {
    score += 25;
    factors.push('Training volume increased >30% this week');
  }

  // Sleep debt
  const recentSleep = sleep.slice(-7);
  const avgSleep = recentSleep.length
    ? recentSleep.reduce((s, l) => s + l.duration, 0) / recentSleep.length
    : 7;
  if (avgSleep < 6) {
    score += 30;
    factors.push('Significant sleep debt (<6h avg)');
  } else if (avgSleep < 7) {
    score += 15;
    factors.push('Mild sleep debt (<7h avg)');
  }

  // No rest days
  if (recent7.length >= 7) {
    score += 10;
    factors.push('No rest days in the past week');
  }

  score = Math.min(100, score);
  const level = score >= 75 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'moderate' : 'low';

  return { score, level, factors };
}

// --- Burnout Risk Assessment ---
export interface BurnoutRisk {
  score: number; // 0-100
  level: 'low' | 'moderate' | 'high' | 'critical';
  factors: string[];
}

export function calculateBurnoutRisk(
  activity: ActivityLog[],
  mental: MentalHealthLog[],
  sleep: SleepLog[],
): BurnoutRisk {
  const factors: string[] = [];
  let score = 0;

  const recentMental = mental.slice(-14);
  const avgMood = recentMental.length
    ? recentMental.reduce((s, l) => s + l.mood, 0) / recentMental.length
    : 3;
  const avgEnergy = recentMental.length
    ? recentMental.reduce((s, l) => s + l.energyLevel, 0) / recentMental.length
    : 3;
  const avgStress = recentMental.length
    ? recentMental.reduce((s, l) => s + l.stressLevel, 0) / recentMental.length
    : 3;

  if (avgMood < 2.5) { score += 25; factors.push('Consistently low mood'); }
  if (avgEnergy < 2.5) { score += 20; factors.push('Chronically low energy'); }
  if (avgStress > 4) { score += 25; factors.push('Very high sustained stress'); }

  const recentActivity = activity.slice(-14);
  if (recentActivity.length > 10) {
    score += 15;
    factors.push('Very high training frequency');
  }

  const recentSleep = sleep.slice(-7);
  const avgSleep = recentSleep.length
    ? recentSleep.reduce((s, l) => s + l.duration, 0) / recentSleep.length
    : 7;
  if (avgSleep < 6.5) { score += 15; factors.push('Insufficient sleep recovery'); }

  score = Math.min(100, score);
  const level = score >= 75 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'moderate' : 'low';

  return { score, level, factors };
}

// --- Projected Weight Trajectory ---
export interface WeightProjection {
  currentWeight: number;
  projectedWeights: { day: number; weight: number }[];
  targetWeight?: number;
  targetReachDays?: number;
}

export function projectWeightTrajectory(
  currentWeight: number,
  dailyCalorieDeficit: number, // negative = deficit, positive = surplus
  days: number = 90,
  targetWeight?: number,
): WeightProjection {
  // ~7700 kcal per kg
  const kgPerDay = dailyCalorieDeficit / 7700;
  const projectedWeights: { day: number; weight: number }[] = [];

  for (let d = 0; d <= days; d += 7) {
    const weight = Math.max(40, currentWeight + kgPerDay * d);
    projectedWeights.push({ day: d, weight: Math.round(weight * 10) / 10 });
  }

  let targetReachDays: number | undefined;
  if (targetWeight !== undefined && kgPerDay !== 0) {
    const daysNeeded = (targetWeight - currentWeight) / kgPerDay;
    if (daysNeeded > 0) targetReachDays = Math.round(daysNeeded);
  }

  return { currentWeight, projectedWeights, targetWeight, targetReachDays };
}

// --- TFLite Model Runner (stub) ---
export const tfliteRunner = {
  isAvailable: (): boolean => false,
  runInference: async (inputData: number[]): Promise<number[]> => {
    // Real impl would load a .tflite model and run inference
    void inputData;
    return [0];
  },
};
