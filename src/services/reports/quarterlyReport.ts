// Quarterly report template
import { HealthReport, ActivityLog, NutritionLog, SleepLog, MentalHealthLog } from '../../types';
import { generateReport } from './reportGenerator';

export function generateQuarterlyReport(
  userId: string,
  activityLogs: ActivityLog[],
  nutritionLogs: NutritionLog[],
  sleepLogs: SleepLog[],
  moodLogs: MentalHealthLog[]
): HealthReport {
  const end = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  const start = startDate.toISOString().split('T')[0];

  return generateReport(userId, 'quarterly', start, end, activityLogs, nutritionLogs, sleepLogs, moodLogs);
}

export function getQuarterLabel(): string {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const quarter = Math.ceil(month / 3);
  return `Q${quarter} ${year}`;
}

export function compareWithPreviousQuarter(
  current: HealthReport,
  previous: HealthReport
): Record<string, { change: number; direction: 'up' | 'down' | 'same' }> {
  const keys = ['totalActivity', 'avgCalories', 'avgSleep', 'avgMood'] as const;
  const comparison: Record<string, { change: number; direction: 'up' | 'down' | 'same' }> = {};

  keys.forEach((key) => {
    const curr = current.metrics[key];
    const prev = previous.metrics[key];
    const change = Math.round((curr - prev) * 10) / 10;
    comparison[key] = {
      change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
    };
  });

  return comparison;
}
