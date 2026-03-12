// VO2 max estimator
import { Biomarker, UserProfile, ActivityLog } from '../../types';
import { createBiomarker } from './biomarkerCalculations';

// Cooper test estimation
export function estimateVO2MaxCooper(distanceMeters: number): number {
  return Math.round(((distanceMeters / 1000 - 0.3138) / 0.3948) * 10) / 10;
}

// Rockport walking test estimation
export function estimateVO2MaxRockport(
  weightKg: number,
  ageYears: number,
  gender: 'male' | 'female' | 'other',
  walkingTimeMinutes: number,
  heartRateAtEnd: number
): number {
  const sexFactor = gender === 'male' ? 1 : 0;
  const vo2 =
    132.853 -
    0.0769 * (weightKg * 2.2046) -
    0.3877 * ageYears +
    6.315 * sexFactor -
    3.2649 * walkingTimeMinutes -
    0.1565 * heartRateAtEnd;
  return Math.round(Math.max(0, vo2) * 10) / 10;
}

// Estimate from recent running data
export function estimateVO2MaxFromActivity(
  activityLogs: ActivityLog[],
  profile: UserProfile
): number {
  const runs = activityLogs.filter(
    (a) => a.type.toLowerCase().includes('run') && a.status === 'completed'
  );
  if (runs.length === 0) return 35; // Default moderate fitness

  const avgCaloriesPerMin =
    runs.reduce((s, r) => s + r.caloriesBurned / Math.max(r.duration, 1), 0) / runs.length;

  // Simple heuristic: higher calorie burn rate correlates with VO2 max
  return Math.min(80, Math.max(20, Math.round(avgCaloriesPerMin * 4 + 30)));
}

export function logVO2Max(userId: string, vo2Max: number): Biomarker {
  return createBiomarker(userId, 'vo2_max', vo2Max);
}

export function interpretVO2Max(vo2Max: number, age: number): string {
  if (vo2Max >= 55) return 'Elite fitness level';
  if (vo2Max >= 45) return 'Above average fitness';
  if (vo2Max >= 35) return 'Average fitness';
  if (vo2Max >= 25) return 'Below average fitness';
  return 'Poor fitness – consult a physician before intense exercise';
}
