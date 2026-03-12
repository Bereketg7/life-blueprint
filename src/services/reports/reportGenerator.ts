// Main report generator
import { HealthReport, ActivityLog, NutritionLog, SleepLog, MentalHealthLog } from '../../types';

function generateId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function generateReport(
  userId: string,
  type: HealthReport['type'],
  start: string,
  end: string,
  activityLogs: ActivityLog[],
  nutritionLogs: NutritionLog[],
  sleepLogs: SleepLog[],
  moodLogs: MentalHealthLog[]
): HealthReport {
  const inRange = (date: string) => date >= start && date <= end;

  const filteredActivity = activityLogs.filter((l) => inRange(l.date));
  const filteredNutrition = nutritionLogs.filter((l) => inRange(l.date));
  const filteredSleep = sleepLogs.filter((l) => inRange(l.date));
  const filteredMood = moodLogs.filter((l) => inRange(l.date));

  const avgCalories =
    filteredNutrition.length > 0
      ? Math.round(filteredNutrition.reduce((s, n) => s + n.calories, 0) / filteredNutrition.length)
      : 0;

  const avgSleep =
    filteredSleep.length > 0
      ? Math.round((filteredSleep.reduce((s, l) => s + l.hoursSlept, 0) / filteredSleep.length) * 10) / 10
      : 0;

  const avgMood =
    filteredMood.length > 0
      ? Math.round((filteredMood.reduce((s, m) => s + m.mood, 0) / filteredMood.length) * 10) / 10
      : 0;

  const totalActivity = filteredActivity.filter((a) => a.status === 'completed').length;

  const insights: string[] = [];
  const recommendations: string[] = [];

  if (avgSleep < 7) {
    insights.push(`Average sleep was ${avgSleep} hours – below recommended 7-9 hours.`);
    recommendations.push('Establish a consistent bedtime routine.');
  }
  if (totalActivity === 0) {
    insights.push('No recorded workouts this period.');
    recommendations.push('Aim for at least 3 workout sessions per week.');
  }
  if (avgMood < 5) {
    insights.push(`Average mood was ${avgMood}/10 – consider stress management.`);
    recommendations.push('Try daily 5-minute meditation sessions.');
  }

  return {
    id: generateId(),
    userId,
    type,
    period: { start, end },
    metrics: {
      totalActivity,
      avgCalories,
      avgSleep,
      avgMood,
      streakDays: 0,
      goalsCompleted: 0,
    },
    insights,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}
