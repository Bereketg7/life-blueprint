// Trajectory analysis – weight & performance trends
import { ActivityLog, SleepLog, NutritionLog } from '../../types';

export interface TrendPoint {
  date: string;
  value: number;
}

export interface Trajectory {
  metric: string;
  dataPoints: TrendPoint[];
  trend: 'improving' | 'declining' | 'stable';
  changeRate: number; // per week
  projectedValues: TrendPoint[];
}

export function calcActivityTrend(logs: ActivityLog[]): Trajectory {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const points: TrendPoint[] = sorted.map((l) => ({
    date: l.date,
    value: l.caloriesBurned,
  }));

  const trend = detectTrend(points.map((p) => p.value));
  const changeRate = calcChangeRate(points.map((p) => p.value));

  return {
    metric: 'calories_burned',
    dataPoints: points,
    trend,
    changeRate,
    projectedValues: projectValues(points, 4),
  };
}

export function calcSleepTrend(logs: SleepLog[]): Trajectory {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const points: TrendPoint[] = sorted.map((l) => ({
    date: l.date,
    value: l.hoursSlept,
  }));

  return {
    metric: 'hours_slept',
    dataPoints: points,
    trend: detectTrend(points.map((p) => p.value)),
    changeRate: calcChangeRate(points.map((p) => p.value)),
    projectedValues: projectValues(points, 4),
  };
}

export function calcNutritionTrend(logs: NutritionLog[]): Trajectory {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const points: TrendPoint[] = sorted.map((l) => ({
    date: l.date,
    value: l.calories,
  }));

  return {
    metric: 'calories_consumed',
    dataPoints: points,
    trend: detectTrend(points.map((p) => p.value)),
    changeRate: calcChangeRate(points.map((p) => p.value)),
    projectedValues: projectValues(points, 4),
  };
}

function detectTrend(values: number[]): 'improving' | 'declining' | 'stable' {
  if (values.length < 2) return 'stable';
  const half = Math.ceil(values.length / 2);
  const recentAvg = values.slice(0, half).reduce((s, v) => s + v, 0) / half;
  const olderAvg =
    values.slice(half).reduce((s, v) => s + v, 0) / Math.max(values.length - half, 1);
  const diff = recentAvg - olderAvg;
  if (diff > olderAvg * 0.05) return 'improving';
  if (diff < -olderAvg * 0.05) return 'declining';
  return 'stable';
}

function calcChangeRate(values: number[]): number {
  if (values.length < 2) return 0;
  const first = values[0];
  const last = values[values.length - 1];
  return Math.round(((last - first) / Math.max(first, 1)) * 100 * 10) / 10;
}

function projectValues(points: TrendPoint[], weeks: number): TrendPoint[] {
  if (points.length === 0) return [];
  const lastPoint = points[points.length - 1];
  const lastDate = new Date(lastPoint.date);
  const values = points.map((p) => p.value);
  const changeRate = calcChangeRate(values) / 100 / Math.max(values.length - 1, 1);

  return Array.from({ length: weeks }, (_, i) => {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + (i + 1) * 7);
    return {
      date: d.toISOString().split('T')[0],
      value: Math.max(0, Math.round(lastPoint.value * (1 + changeRate * (i + 1)))),
    };
  });
}
