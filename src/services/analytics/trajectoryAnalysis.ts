import { ActivityLog, NutritionLog, TrendData } from '../../types';
import { linearRegression, movingAverage } from './mlModels';

const DEFAULT_TARGET_CALORIES = 2000;

export function calculateWeightTrend(
  weightEntries: Array<{ date: string; weight: number }>,
): TrendData {
  const sorted = [...weightEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const values = sorted.map((e) => e.weight);
  const dates = sorted.map((e) => e.date);
  const xs = values.map((_, i) => i);

  const { slope } = linearRegression(xs, values);
  const average = values.reduce((a, b) => a + b, 0) / (values.length || 1);

  let trend: TrendData['trend'] = 'stable';
  if (slope < -0.05) trend = 'declining';
  else if (slope > 0.05) trend = 'improving';

  return { values, dates, slope, average, trend };
}

export function calculateFitnessTrend(activityLogs: ActivityLog[]): TrendData {
  const sorted = [...activityLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const values = sorted.map((l) => l.duration);
  const dates = sorted.map((l) => l.date);
  const xs = values.map((_, i) => i);

  const { slope } = linearRegression(xs, values);
  const average = values.reduce((a, b) => a + b, 0) / (values.length || 1);

  let trend: TrendData['trend'] = 'stable';
  if (slope > 1) trend = 'improving';
  else if (slope < -1) trend = 'declining';

  return { values, dates, slope, average, trend };
}

/**
 * Projects future weight given current weight, weekly caloric deficit and
 * number of weeks to project.
 */
export function projectFutureWeight(
  currentWeight: number,
  weeklyDeficitKcal: number,
  weeks: number,
): number[] {
  const kgPerWeek = weeklyDeficitKcal / 7700;
  return Array.from({ length: weeks }, (_, i) =>
    parseFloat((currentWeight - kgPerWeek * (i + 1)).toFixed(2)),
  );
}

export function calculateWeightTrendFromNutrition(
  nutritionLogs: NutritionLog[],
  startingWeight: number,
): TrendData {
  let weight = startingWeight;
  const entries = nutritionLogs
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((log) => {
      const deficit = DEFAULT_TARGET_CALORIES - log.calories;
      weight -= deficit / 7700;
      return { date: log.date, weight };
    });
  return calculateWeightTrend(entries);
}

export function smoothedValues(values: number[], window = 7): number[] {
  return movingAverage(values, window);
}
